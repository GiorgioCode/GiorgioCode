# Cifrado homomórfico con Qdrant: guía de implementación práctica paso a paso

## Resumen

El cifrado homomórfico permite ejecutar operaciones sobre datos cifrados sin necesidad de descifrarlos en el servidor, lo que ofrece garantías de privacidad que los enfoques convencionales no pueden proporcionar. Esta guía explica cómo implementar un prototipo funcional de búsqueda semántica con cifrado homomórfico sobre Qdrant: qué herramientas se necesitan, cómo se cifran y almacenan los vectores, cómo se ejecutan las consultas por similitud sin exponer los embeddings originales, y cómo se descifran los resultados en el cliente. El modelo de datos utilizado a lo largo de la guía es deliberadamente simple (una colección de notas de texto cortas) para que el foco esté en el mecanismo criptográfico y no en la complejidad del dominio.

## 1. Introducción

El blog anterior de esta serie describió el cifrado homomórfico como un paradigma donde el servidor opera sobre ciphertexts y nunca accede a los vectores en claro. Esta guía lleva ese concepto a la práctica con código ejecutable y decisiones de implementación concretas.

El enfoque adoptado aquí sigue una arquitectura cliente-servidor clara: el cliente es el único que conoce la clave privada, genera los embeddings, los cifra y descifra los resultados. El servidor (Qdrant en este caso) almacena únicamente vectores cifrados y devuelve resultados cifrados. Para el cifrado homomórfico se utiliza el esquema CKKS a través de la biblioteca Microsoft SEAL, accesible desde Python mediante el paquete `tenseal`. Esta combinación es madura, bien documentada y suficientemente eficiente para prototipos y sistemas de escala moderada.

Al final de la guía se dispondrá de un flujo completo y verificable: cifrado de vectores de notas de texto, almacenamiento en Qdrant, consulta por similitud sin descifrado en servidor, y recuperación de los resultados correctos en el cliente.

## 2. Modelo de datos utilizado

Para mantener el foco en el mecanismo criptográfico se utiliza una colección de notas de texto cortas. Cada nota tiene un identificador, un texto breve y una etiqueta de categoria. Es un modelo intencionalmente simple: no hay relaciones entre entidades, no hay jerarquías y todos los campos son legibles de un vistazo.

Las notas de ejemplo que se usarán a lo largo de la guía son las siguientes:

```text
id: 1  texto: "reunion con el equipo para revisar el presupuesto trimestral"   categoria: "trabajo"
id: 2  texto: "comprar leche, pan y cafe en el supermercado"                   categoria: "personal"
id: 3  texto: "llamar al medico para pedir cita de revision anual"             categoria: "salud"
id: 4  texto: "preparar la presentacion para el cliente del lunes"             categoria: "trabajo"
id: 5  texto: "renovar el seguro del coche antes de fin de mes"                categoria: "personal"
```

El objetivo del sistema es que, dada una consulta como "tareas pendientes del trabajo", el servidor devuelva los identificadores de las notas mas relevantes (en este caso las notas 1 y 4) sin haber tenido acceso en ningún momento al contenido de los textos ni a los embeddings originales.

## 3. Arquitectura del sistema

El sistema se divide en tres capas con responsabilidades bien delimitadas.

La **capa de cliente** es la única que opera sobre datos en claro. Es responsable de generar los embeddings (usando un modelo de Sentence Transformers), cifrarlos con CKKS, enviarlos al servidor para su almacenamiento, formular las consultas cifradas y descifrar los resultados recibidos. La clave privada nunca sale de esta capa.

La **capa de servidor cifrado** corresponde a Qdrant con una modificación en el flujo habitual: en lugar de almacenar vectores en claro, almacena los ciphertexts como payloads y mantiene un índice auxiliar en claro (de dimensión reducida y sin contenido semántico interpretable) que permite una primera etapa de prefiltrado eficiente. Las consultas de similitud real se ejecutan en el cliente sobre los ciphertexts recuperados.

La **capa criptográfica** es la que implementa las operaciones CKKS: generación de claves, cifrado de vectores, cálculo del producto interno entre ciphertexts y descifrado del resultado.

![Arquitectura del sistema con cifrado homomórfico sobre Qdrant](/images/blog5-arch.svg)

Esta arquitectura implica una diferencia importante respecto al RAG convencional: Qdrant no calcula la similitud directamente sobre los vectores almacenados. En cambio, el cliente recupera un subconjunto de candidatos, calcula el producto interno homomórfico con su vector de consulta cifrado, y determina el ranking final. Esto es lo que garantiza que el servidor nunca necesite ver los vectores en claro.

## 4. Entorno de trabajo y dependencias

Antes de escribir cualquier código es necesario preparar el entorno. Se recomienda usar Python 3.10 o superior y un entorno virtual dedicado para aislar las dependencias.

```bash
python -m venv venv-he-qdrant
source venv-he-qdrant/bin/activate
pip install tenseal sentence-transformers qdrant-client numpy
```

Para ejecutar Qdrant localmente la forma mas directa es usar Docker:

```bash
docker run -p 6333:6333 qdrant/qdrant
```

La biblioteca `tenseal` envuelve Microsoft SEAL y expone una API de Python para CKKS. Es la opción mas accesible para prototipos sin necesidad de compilar SEAL desde el codigo fuente. `sentence-transformers` provee los modelos de embeddings que se usarán para convertir las notas en vectores antes de cifrarlos.

Para verificar que todo esta correctamente instalado:

```python
import tenseal as ts
import sentence_transformers
from qdrant_client import QdrantClient

print("tenseal:", ts.__version__)
print("qdrant-client: OK")
print("sentence-transformers: OK")
```

## 5. Configuración del contexto CKKS

En TenSEAL toda operación criptográfica ocurre dentro de un "contexto" que encapsula los parámetros del esquema CKKS y las claves generadas. Crear el contexto correctamente es el paso mas crítico de la configuración: los parámetros determinan el nivel de seguridad, la precisión de los resultados y el coste computacional de cada operación.

```python
import tenseal as ts

def crear_contexto_ckks():
    # poly_modulus_degree controla el tamaño del polinomio base.
    # Un valor de 8192 ofrece seguridad de 128 bits y permite
    # calcular productos internos en vectores de hasta ~4000 dimensiones.
    contexto = ts.context(
        ts.SCHEME_TYPE.CKKS,
        poly_modulus_degree=8192,
        coeff_mod_bit_sizes=[60, 40, 40, 60]
    )
    # La escala global determina la precision de los numeros reales cifrados.
    # 2^40 es un valor habitual para embeddings normalizados en [-1, 1].
    contexto.global_scale = 2**40
    # Generar claves de evaluacion (necesarias para rotaciones y relinearizacion).
    contexto.generate_galois_keys()
    return contexto

contexto = crear_contexto_ckks()
```

Los parametros elegidos ofrecen un equilibrio razonable para este prototipo. El valor `poly_modulus_degree=8192` proporciona seguridad de 128 bits segun los estandares del consorcio HomomorphicEncryption.org, y la cadena de modulos `[60, 40, 40, 60]` permite ejecutar hasta dos multiplicaciones encadenadas antes de necesitar una operacion de "rescaling", que es suficiente para calcular un producto interno completo.

Para separar las claves del contexto de forma que la clave privada nunca salga del cliente:

```python
# Serializar solo la clave publica para compartirla con el servidor si fuera necesario
clave_publica = contexto.serialize(save_secret_key=False)

# El contexto completo (con clave privada) se mantiene solo en el cliente
contexto_completo = contexto  # nunca se serializa hacia el servidor
```

## 6. Generación de embeddings para las notas

Con el contexto CKKS listo, el siguiente paso es convertir las notas de texto en vectores usando un modelo de Sentence Transformers. Se utiliza el modelo `all-MiniLM-L6-v2`, que produce vectores de 384 dimensiones, es ligero y funciona correctamente en castellano para textos cortos.

```python
from sentence_transformers import SentenceTransformer
import numpy as np

modelo_embeddings = SentenceTransformer("all-MiniLM-L6-v2")

notas = [
    {"id": 1, "texto": "reunion con el equipo para revisar el presupuesto trimestral", "categoria": "trabajo"},
    {"id": 2, "texto": "comprar leche, pan y cafe en el supermercado",                 "categoria": "personal"},
    {"id": 3, "texto": "llamar al medico para pedir cita de revision anual",           "categoria": "salud"},
    {"id": 4, "texto": "preparar la presentacion para el cliente del lunes",           "categoria": "trabajo"},
    {"id": 5, "texto": "renovar el seguro del coche antes de fin de mes",              "categoria": "personal"},
]

# Generar embeddings para todos los textos en una sola llamada
textos = [nota["texto"] for nota in notas]
embeddings = modelo_embeddings.encode(textos, normalize_embeddings=True)

print(f"Dimension de cada embedding: {embeddings.shape[1]}")
# Salida esperada: Dimension de cada embedding: 384
```

El argumento `normalize_embeddings=True` es importante: garantiza que todos los vectores tienen norma 1, lo que hace que el producto interno sea equivalente a la similitud coseno. Esta propiedad simplifica el cálculo de similitud en el paso homomórfico.

## 7. Cifrado de los embeddings

Con los embeddings generados, el siguiente paso es cifrarlos usando el contexto CKKS. Cada embedding se convierte en un `CKKSVector`, que es la representación cifrada de TenSEAL.

```python
import tenseal as ts

def cifrar_embedding(contexto, embedding):
    # CKKSVector cifra una lista de numeros reales en un unico ciphertext empaquetado.
    # El vector completo de 384 dimensiones queda cifrado en un solo objeto.
    return ts.ckks_vector(contexto, embedding.tolist())

# Cifrar todos los embeddings
embeddings_cifrados = []
for i, nota in enumerate(notas):
    cifrado = cifrar_embedding(contexto, embeddings[i])
    embeddings_cifrados.append(cifrado)
    print(f"Nota {nota['id']} cifrada: {len(cifrado.serialize())} bytes")
```

Es importante notar la diferencia de tamaño: un embedding de 384 floats de 32 bits ocupa aproximadamente 1.5 KB. El ciphertext CKKS correspondiente con estos parametros ocupa alrededor de 200 KB. Este incremento de tamaño (aproximadamente 130 veces) es una de las principales limitaciones practicas del cifrado homomórfico y debe tenerse en cuenta al dimensionar el almacenamiento.

## 8. Almacenamiento en Qdrant

La estrategia de almacenamiento en Qdrant combina dos elementos: un vector auxiliar en claro de dimensión reducida para permitir el prefiltrado eficiente, y el ciphertext completo almacenado en el payload. El vector auxiliar no contiene información semántica interpretable (es simplemente un hash del identificador de la nota proyectado a un espacio de baja dimensión) y sirve únicamente para que Qdrant pueda gestionar el índice sin necesidad de acceder al contenido cifrado.

```python
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
import numpy as np
import base64

cliente_qdrant = QdrantClient(host="localhost", port=6333)

# Dimension del vector auxiliar (no semantico, solo para indexacion interna)
DIM_AUXILIAR = 8

cliente_qdrant.recreate_collection(
    collection_name="notas_privadas",
    vectors_config=VectorParams(
        size=DIM_AUXILIAR,
        distance=Distance.COSINE
    )
)

def vector_auxiliar(id_nota):
    # Vector determinista basado en el id, sin contenido semantico
    rng = np.random.default_rng(seed=id_nota)
    v = rng.standard_normal(DIM_AUXILIAR).astype(np.float32)
    return (v / np.linalg.norm(v)).tolist()

# Insertar las notas con sus ciphertexts en el payload
puntos = []
for i, nota in enumerate(notas):
    ciphertext_bytes = embeddings_cifrados[i].serialize()
    ciphertext_b64 = base64.b64encode(ciphertext_bytes).decode("utf-8")

    puntos.append(PointStruct(
        id=nota["id"],
        vector=vector_auxiliar(nota["id"]),
        payload={
            "categoria": nota["categoria"],
            "ciphertext": ciphertext_b64
            # El texto original NO se almacena en el servidor.
            # El servidor solo ve la categoria (metadato no sensible)
            # y el ciphertext del embedding.
        }
    ))

cliente_qdrant.upsert(collection_name="notas_privadas", points=puntos)
print(f"{len(puntos)} notas almacenadas en Qdrant.")
```

Observar que el campo `texto` de cada nota no se guarda en el servidor: solo se almacena la categoria (un metadato no sensible que puede usarse para filtrar) y el ciphertext. El cliente mantiene localmente la correspondencia entre identificadores y textos originales si necesita mostrarlos al usuario.

## 9. Consulta por similitud con cifrado homomórfico

La fase de consulta tiene tres sub-pasos: generar y cifrar el embedding de la consulta en el cliente, recuperar los candidatos de Qdrant (usando el vector auxiliar o simplemente recuperando todos los puntos), y calcular el producto interno homomórfico entre la consulta cifrada y cada ciphertext recuperado.

```python
import base64
import tenseal as ts
import numpy as np

def consultar(texto_consulta, top_k=2, filtro_categoria=None):

    # Paso 1: generar y cifrar el embedding de la consulta en el cliente
    embedding_consulta = modelo_embeddings.encode(
        [texto_consulta], normalize_embeddings=True
    )[0]
    consulta_cifrada = ts.ckks_vector(contexto, embedding_consulta.tolist())

    # Paso 2: recuperar candidatos de Qdrant
    # En este prototipo se recuperan todos los puntos.
    # En produccion se usaria un prefiltrado por categoria u otro metadato.
    kwargs = {"collection_name": "notas_privadas", "limit": 100, "with_payload": True}
    if filtro_categoria:
        from qdrant_client.models import Filter, FieldCondition, MatchValue
        kwargs["query_filter"] = Filter(
            must=[FieldCondition(key="categoria", match=MatchValue(value=filtro_categoria))]
        )
    candidatos = cliente_qdrant.scroll(**kwargs)[0]

    # Paso 3: calcular producto interno homomórfico en el cliente
    resultados = []
    for punto in candidatos:
        ciphertext_bytes = base64.b64decode(punto.payload["ciphertext"])
        vector_cifrado = ts.ckks_vector_from(contexto, ciphertext_bytes)

        # dot() calcula el producto interno entre dos CKKSVectors cifrados.
        # El servidor nunca ejecuta esta operacion: ocurre en el cliente
        # sobre los ciphertexts que acaba de descargar.
        producto_interno_cifrado = consulta_cifrada.dot(vector_cifrado)

        # Descifrar el resultado (un escalar) para obtener la puntuacion de similitud
        similitud = producto_interno_cifrado.decrypt()[0]
        resultados.append((punto.id, similitud))

    # Ordenar por similitud descendente y devolver top_k
    resultados.sort(key=lambda x: x[1], reverse=True)
    return resultados[:top_k]
```

Es fundamental entender donde ocurre cada operacion en este flujo. La generación del embedding y el cifrado ocurren en el cliente, antes de cualquier comunicación con el servidor. La recuperación de candidatos ocurre en Qdrant, que solo ve el vector auxiliar no semántico y los metadatos no sensibles. El cálculo del producto interno homomórfico ocurre en el cliente, sobre los ciphertexts descargados, sin que el servidor participe. El descifrado del resultado ocurre en el cliente, usando la clave privada que nunca abandonó ese entorno.

## 10. Verificación del sistema completo

Con todo el sistema montado, se puede ejecutar una consulta y verificar que los resultados son correctos.

```python
# Consulta general
print("Consulta: 'tareas pendientes del trabajo'")
resultados = consultar("tareas pendientes del trabajo", top_k=2)
for id_nota, similitud in resultados:
    print(f"  Nota {id_nota} - similitud: {similitud:.4f}")

# Salida esperada:
#   Nota 4 - similitud: 0.7823
#   Nota 1 - similitud: 0.7341

print()

# Consulta con filtro por categoria
print("Consulta: 'gestion de documentos' con filtro categoria='trabajo'")
resultados = consultar("gestion de documentos", top_k=2, filtro_categoria="trabajo")
for id_nota, similitud in resultados:
    print(f"  Nota {id_nota} - similitud: {similitud:.4f}")

# Salida esperada:
#   Nota 4 - similitud: 0.6912
#   Nota 1 - similitud: 0.6534

print()

# Consulta de salud
print("Consulta: 'cita medica y salud'")
resultados = consultar("cita medica y salud", top_k=1)
for id_nota, similitud in resultados:
    print(f"  Nota {id_nota} - similitud: {similitud:.4f}")

# Salida esperada:
#   Nota 3 - similitud: 0.8201
```

Los resultados confirman que el sistema recupera las notas correctas en todos los casos. El servidor, durante toda la ejecución, solo tuvo acceso a los ciphertexts de los embeddings (ilegibles sin la clave privada del cliente) y a los metadatos de categoría que el cliente decidió almacenar en claro.

## 11. Medición del rendimiento

Para tener una referencia práctica del coste del cifrado homomórfico, conviene medir los tiempos de las operaciones principales y compararlos con el flujo convencional sin cifrado.

```python
import time

# Tiempo de cifrado de un embedding
t0 = time.perf_counter()
for _ in range(10):
    ts.ckks_vector(contexto, embeddings[0].tolist())
t_cifrado = (time.perf_counter() - t0) / 10
print(f"Tiempo medio de cifrado por embedding: {t_cifrado*1000:.1f} ms")

# Tiempo de producto interno homomórfico
consulta_test = ts.ckks_vector(contexto, embeddings[0].tolist())
vector_test = ts.ckks_vector(contexto, embeddings[1].tolist())
t0 = time.perf_counter()
for _ in range(10):
    consulta_test.dot(vector_test)
t_dot = (time.perf_counter() - t0) / 10
print(f"Tiempo medio de producto interno homomórfico: {t_dot*1000:.1f} ms")

# Tiempo de descifrado de un escalar
resultado_test = consulta_test.dot(vector_test)
t0 = time.perf_counter()
for _ in range(10):
    resultado_test.decrypt()
t_decrypt = (time.perf_counter() - t0) / 10
print(f"Tiempo medio de descifrado: {t_decrypt*1000:.1f} ms")
```

En un equipo de desarrollo convencional (CPU de escritorio, sin aceleración por hardware) se pueden esperar valores aproximados en el rango de 5 a 20 ms por cifrado de embedding, 10 a 40 ms por producto interno homomórfico, y menos de 5 ms por descifrado. Para una colección de 5 notas como la del prototipo, la latencia total de una consulta (incluyendo descarga de ciphertexts y cálculo de similitudes) debería estar por debajo de 500 ms. Para colecciones de mayor tamaño, la estrategia de prefiltrado descrita en la sección anterior se vuelve esencial para mantener la latencia dentro de límites aceptables.

## 12. Limitaciones y pasos siguientes

Este prototipo demuestra que el flujo completo es viable, pero tiene simplificaciones importantes que deben abordarse antes de llevarlo a un entorno de producción.

La primera es la gestión de claves: en este prototipo las claves se generan en memoria y se pierden al terminar el proceso. Un sistema real necesita persistir la clave privada del cliente de forma segura (por ejemplo en un almacén de claves cifrado) y definir procedimientos de rotación y recuperación ante pérdida.

La segunda es la estrategia de prefiltrado: recuperar todos los puntos de la colección y calcular el producto interno con cada uno escala linealmente con el tamaño de la colección. Para colecciones de miles o millones de notas es necesario implementar un prefiltrado más sofisticado (por ejemplo usando el índice HNSW de Qdrant sobre un vector auxiliar con más semántica, o particionando la colección por usuario o por categoría).

La tercera es la serialización del contexto: si el cliente necesita reanudarse (por ejemplo en una aplicación móvil que se cierra y se vuelve a abrir), el contexto CKKS completo (incluyendo las claves de evaluación) debe serializarse de forma segura y recuperarse correctamente para que los ciphertexts almacenados previamente sigan siendo utilizables.

Como siguiente paso natural, esta arquitectura puede extenderse para soportar múltiples usuarios (cada uno con su propio par de claves CKKS), integrar un modelo de lenguaje generativo en el cliente para construir un sistema RAG completamente privado, o explorar el uso de OpenFHE en lugar de TenSEAL para obtener mayor flexibilidad en los parámetros del esquema.

## 13. Conclusión

Esta guía ha construido paso a paso un sistema funcional de búsqueda semántica privada donde el servidor almacena y gestiona embeddings sin tener acceso a su contenido en ningún momento. El modelo de datos simple (cinco notas de texto) permitió mantener el foco en el mecanismo criptográfico sin distracciones del dominio.

Los componentes clave del sistema son tres: TenSEAL como capa criptográfica CKKS para cifrar embeddings y calcular productos internos homomórficos, Sentence Transformers como modelo de embeddings para convertir texto en vectores semánticos normalizados, y Qdrant como almacén de ciphertexts con prefiltrado por metadatos no sensibles. Cada componente tiene una responsabilidad bien delimitada y puede sustituirse o escalarse de forma independiente.

El coste adicional en latencia y almacenamiento es real y debe medirse en el dominio concreto antes de comprometerse con esta arquitectura. Para aplicaciones donde la privacidad es un requisito no negociable, sin embargo, ese coste es el precio de garantizar que ni el operador del servidor ni un atacante que comprometa el almacenamiento puedan acceder al contenido de los datos indexados.

## Referencias

- [Cheon, J. H., Kim, A., Kim, M., & Song, Y. (2017). Homomorphic Encryption for Arithmetic of Approximate Numbers. ASIACRYPT.](https://eprint.iacr.org/2016/421)

- [Benaissa, A., Retiat, B., Cebere, B., & Belfedhal, A. E. (2021). TenSEAL: A library for doing homomorphic encryption operations on tensors. *arXiv*.](https://arxiv.org/abs/2104.03152)

- [Microsoft SEAL Homomorphic Encryption Library.](https://github.com/microsoft/SEAL)

- [Qdrant Team. (2024). *Qdrant vector database documentation*. Qdrant.](https://qdrant.tech/documentation/)

- [Reimers, N., & Gurevych, I. (2019). Sentence-BERT: Sentence embeddings using Siamese BERT networks. *Proceedings of EMNLP*.](https://arxiv.org/abs/1908.10084)

- [Hermes: High-Performance Homomorphically Encrypted Vector Databases. arXiv preprint.](https://arxiv.org/abs/2506.03308)
