# Arquitecturas modernas de RAG con Qdrant: implementación práctica paso a paso

## Resumen

Los sistemas RAG ("Retrieval-Augmented Generation") conectan modelos de lenguaje grandes con bases de conocimiento externas: en lugar de depender exclusivamente de lo que el modelo aprendió durante el entrenamiento, se recupera información relevante antes de generar la respuesta. Esta guía explica cómo construir una arquitectura RAG con la base de datos vectorial Qdrant: qué componentes intervienen, cómo fluyen los datos, cómo preparar el corpus, cómo crear colecciones e insertar vectores, cómo realizar consultas y cómo integrar todo con un modelo generativo. El objetivo es disponer de un prototipo funcional que combine recuperación semántica, embeddings y generación de texto de forma coherente y extensible.

---

## 1. Introducción

Los modelos de lenguaje generan texto fluido pero tienen dos limitaciones estructurales: su conocimiento tiene una fecha de corte y no suelen citar fuentes verificables. Las arquitecturas RAG resuelven esto haciendo que el modelo consulte una base de conocimiento antes de responder (Lewis et al., 2020): se recuperan fragmentos relevantes por similitud semántica y se inyectan en el prompt como contexto, lo que mejora la precisión y reduce la generación de información inventada (Ji et al., 2023).

Las bases de datos vectoriales son el núcleo del paso de recuperación en este esquema. Qdrant es un motor diseñado específicamente para búsquedas por similitud eficientes, filtrado por metadatos y cargas típicas de aplicaciones de IA (Qdrant Team, 2024). A lo largo de esta guía se describe cómo montar un RAG con Qdrant de forma práctica, desde la preparación del corpus hasta la generación de la respuesta final.

---

## 2. Arquitectura general de un sistema RAG

Un sistema RAG completo se apoya en tres componentes interconectados.

El primero es un **modelo de embeddings**, que convierte texto (tanto las consultas del usuario como los documentos del corpus) en vectores en un espacio donde la proximidad geométrica refleja similitud de significado. El segundo es una **base de datos vectorial** donde se almacenan los vectores de los documentos, junto con metadatos opcionales que permiten filtrar resultados por criterios estructurados (fecha, categoría, fuente, etc.). El tercero es un **modelo de lenguaje generativo** que recibe la consulta original y los documentos recuperados como contexto y produce la respuesta final.

El flujo completo es: consulta del usuario a vector de consulta, búsqueda en la base vectorial por similitud, recuperación de los fragmentos mas relevantes, inyección de esos fragmentos en el prompt del modelo generativo, y generación de la respuesta.

![Flujo general de un sistema RAG](/images/blog3-flow.svg)

La calidad del sistema depende de los tres componentes en igual medida: embeddings que capturen bien el significado del dominio, un corpus fragmentado de forma adecuada, y un prompt que permita al modelo aprovechar el contexto recuperado sin confundirlo con su conocimiento previo.

---

## 3. Componentes del sistema

### 3.1 Modelo de embeddings

Los embeddings convierten texto en vectores de longitud fija (por ejemplo 384, 768 o 1536 dimensiones) que capturan el significado semántico del contenido. Textos con significado similar quedan cerca en ese espacio vectorial; textos sobre temas distintos quedan lejos. Las opciones más habituales son Sentence Transformers (modelos de código abierto, bien adaptados para oraciones y párrafos en múltiples idiomas), los embeddings de OpenAI (accesibles via API, con buena cobertura general), o modelos especializados disponibles en Hugging Face.

La elección del modelo determina tres aspectos críticos: la dimensión del vector resultante (que debe coincidir con la configurada en la colección de Qdrant), el idioma o idiomas soportados, y el coste operativo (ejecución local frente a llamada a API). Para búsqueda semántica en colecciones grandes, los modelos que producen vectores normalizados combinados con la métrica coseno suelen ofrecer los mejores resultados (Reimers y Gurevych, 2019).

### 3.2 Base de datos vectorial Qdrant

Qdrant es un motor de base de datos vectorial optimizado para búsquedas de vecinos más cercanos. Utiliza por defecto el índice HNSW ("Hierarchical Navigable Small World"), que ofrece un equilibrio sólido entre velocidad de consulta y precisión de los resultados. Entre sus capacidades destacadas se encuentran el filtrado por payload (metadatos asociados a cada vector), el escalado horizontal para colecciones de gran tamaño, y la exposición de interfaces REST y gRPC que facilitan la integración con cualquier lenguaje o plataforma.

### 3.3 Modelo de lenguaje generativo

El modelo generativo recibe la consulta del usuario y los textos de los documentos recuperados (no los vectores en si, sino el contenido textual asociado a ellos) y genera la respuesta final. Puede ser un modelo ejecutado de forma local (Llama, Mistral y similares), uno alojado en un servidor propio, o uno accesible por API (OpenAI, Anthropic, etc.). El aspecto mas importante del diseño es que el prompt incluya de forma clara y bien estructurada tanto la pregunta del usuario como el contexto recuperado, y que la longitud total no supere el limite de tokens del modelo seleccionado.

---

## 4. Preparación de los datos

Antes de cargar nada en Qdrant es necesario preparar el corpus con cuidado. Este proceso implica cuatro pasos: recopilar los documentos fuente, dividirlos en fragmentos (proceso conocido como "chunking"), generar el embedding de cada fragmento con el mismo modelo que se usará en las consultas, y decidir qué metadatos asociar a cada fragmento (fuente, fecha de creación, categoría, autor, etc.).

El chunking es una de las decisiones mas importantes de toda la arquitectura. Fragmentos demasiado pequeños pierden el contexto necesario para interpretar correctamente el contenido; fragmentos demasiado grandes diluyen la relevancia semántica y consumen demasiado espacio del contexto del modelo generativo. El rango más habitual en la práctica es de 200 a 500 tokens por fragmento, con un solapamiento opcional entre fragmentos consecutivos (por ejemplo 50 tokens de superposición) para evitar que una idea quede cortada exactamente en el limite entre dos fragmentos. La estrategia de división puede basarse en párrafos, en un número fijo de caracteres, o en separadores semánticos detectados automáticamente.

### Ejemplo de chunking

![Ejemplo de chunking](/images/blog3-chunking.svg)

Cada fragmento debe convertirse en un vector utilizando exactamente el mismo modelo de embeddings que se empleará en el momento de las consultas. Esto garantiza que las consultas y los documentos viven en el mismo espacio vectorial y que la métrica de similitud tiene sentido comparativo.

---

## 5. Creación de la colección en Qdrant

En Qdrant los vectores se organizan en colecciones. Cada colección tiene un nombre identificador, una dimensión fija para todos sus vectores (que debe coincidir con la dimensión que produce el modelo de embeddings elegido) y una métrica de distancia para calcular la similitud entre vectores. La métrica COSINE es la más habitual cuando los vectores están normalizados, que es el caso de la mayoría de los modelos de embeddings modernos. Crear la colección es el paso previo obligatorio antes de insertar cualquier punto.

Ejemplo en Python:

```python
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance

client = QdrantClient(host="localhost", port=6333)

client.create_collection(
    collection_name="documents",
    vectors_config=VectorParams(
        size=768,
        distance=Distance.COSINE
    )
)
```

La dimensión (size=768 en el ejemplo) debe corresponderse exactamente con la que devuelve el modelo de embeddings seleccionado. Si se opta por distancia L2 (euclidiana) en lugar de coseno, los vectores no necesitan estar normalizados previamente. La colección también permite configurar opciones avanzadas como la estructura del índice HNSW o la cuantización de vectores para reducir el uso de memoria en colecciones muy grandes.

---

## 6. Inserción de documentos

Cada fragmento del corpus se inserta en Qdrant como un "punto": una estructura que contiene un identificador único (entero o UUID), el vector correspondiente (la lista de números reales que devuelve el modelo de embeddings) y un payload con metadatos y el texto original del fragmento. El texto se guarda en el payload precisamente para poder recuperarlo y pasárselo al modelo generativo durante la fase de consulta; la búsqueda por similitud opera exclusivamente sobre el vector.

Ejemplo en Python:

```python
client.upsert(
    collection_name="documents",
    points=[
        {
            "id": 1,
            "vector": embedding_vector,
            "payload": {
                "text": chunk_text,
                "source": "documento_origen.pdf",
                "date": "2024-01-15"
            }
        }
    ]
)
```

El payload puede incluir cualquier campo que sea útil para filtrar resultados posteriormente: fuente del documento, fecha de publicación, categoría temática, idioma, etc. Estos campos permiten restringir la búsqueda a subconjuntos del corpus sin modificar la lógica vectorial (por ejemplo, "solo documentos publicados en los últimos seis meses" o "solo artículos de la categoría legal").

---

## 7. Recuperación de información

Cuando el usuario formula una pregunta, el sistema genera el embedding de esa pregunta utilizando el mismo modelo que se usó para indexar el corpus. Ese vector es la "consulta vectorial"; Qdrant devuelve los puntos del índice cuyo vector es más similar al de la consulta según la métrica configurada (coseno en el ejemplo). Se especifica un límite ("top k") de resultados a devolver, tipicamente entre 5 y 10, para no saturar el contexto del modelo generativo con información redundante.

```python
search_result = client.search(
    collection_name="documents",
    query_vector=query_embedding,
    limit=5
)
```

Cada resultado incluye el identificador del punto, la puntuación de similitud y el payload completo. A partir del payload se recupera el texto de cada fragmento para incorporarlo al prompt del modelo generativo. Opcionalmente se puede utilizar el parámetro `query_filter` para restringir la búsqueda por cualquier campo del payload (por ejemplo, filtrar por idioma o por una fuente específica).

---

## 8. Generación de la respuesta

Los fragmentos recuperados por Qdrant (sus textos, no sus vectores) se incorporan al prompt que se envía al modelo de lenguaje generativo. Un esquema de prompt habitual tiene tres partes: una instrucción del sistema que indica al modelo que responda exclusivamente con base en el contexto proporcionado, el contexto en si (los fragmentos recuperados, numerados o claramente delimitados), y la pregunta del usuario.

Este diseño cumple dos objetivos: reduce la probabilidad de que el modelo complemente el contexto con información inventada de su conocimiento paramétrico, y hace posible pedirle que cite explicitamente las fuentes utilizadas en la respuesta. En la práctica conviene limitar tanto el número de fragmentos como su longitud total para no exceder el limite de tokens del modelo y para que la información más relevante no quede "enterrada" en el centro del contexto, zona que los modelos tienden a aprovechar menos.

---

## 9. Arquitecturas RAG avanzadas

El sistema RAG básico descrito en esta guía ya aporta un valor significativo en la mayoría de los casos de uso. Las implementaciones más avanzadas añaden mejoras selectivas según los requisitos del dominio: recuperación híbrida (combinación de búsqueda vectorial con BM25 seguida de un paso de reranking), Graph-RAG cuando el conocimiento del dominio tiene estructura de grafo y se necesita razonamiento multi-hop, o Agentic-RAG cuando el sistema debe coordinar múltiples herramientas y ejecutar varios pasos de razonamiento antes de producir la respuesta. Todos estos enfoques son compatibles con Qdrant como pieza de recuperación semántica, y pueden orquestarse con bibliotecas como LangChain o LlamaIndex o con pipelines propios según la complejidad que exija el proyecto.

---

## 10. Discusión

Los sistemas RAG mejoran de forma clara la precisión factual al dar al modelo acceso a información externa verificable y actualizable. A cambio introducen tres retos principales: latencia (el proceso de embedding de la consulta más la búsqueda vectorial más la llamada al modelo generativo se suman), dependencia de la calidad del chunking y de los embeddings para que la recuperación sea relevante, y diseño del prompt para que el modelo sepa aprovechar el contexto sin confundirlo con su conocimiento previo. La optimización de cada una de estas piezas sigue siendo un área activa de desarrollo; lo más importante es definir métricas de evaluación propias del dominio (precisión de las respuestas, satisfacción del usuario, tasa de alucinaciones detectadas) e iterar con base en evidencia real.

---

## 11. Conclusión

RAG se ha consolidado como la arquitectura de referencia para aplicaciones que requieren conocimiento actualizable, verificable y trazable. Construir un RAG con Qdrant implica cinco etapas principales: elegir un modelo de embeddings adecuado al dominio e idioma, fragmentar el corpus con un tamaño de chunk apropiado, crear la colección con la dimensión y métrica correctas, insertar los vectores junto con un payload útil, y en tiempo de consulta generar el embedding de la pregunta, buscar en Qdrant y pasar los textos recuperados al modelo generativo dentro de un prompt bien estructurado. Qdrant aporta rendimiento, flexibilidad en el filtrado por metadatos y escalabilidad, lo que facilita refinar y escalar el sistema a medida que crece el corpus o aumenta la complejidad de las consultas. A partir de este esquema base se pueden incorporar recuperación híbrida, grafos de conocimiento o agentes según la profundidad que exija el caso de uso.

---

## Referencias

- [Ji, Z., Lee, N., Frieske, R., Yu, T., Su, D., Xu, Y., Ishii, E., Bang, Y., Madotto, A., & Fung, P. (2023). Survey of hallucination in natural language generation. *ACM Computing Surveys*.](https://dl.acm.org/doi/10.1145/3571730)

- [Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., Küttler, H., Lewis, M., Yih, W., Rocktäschel, T., Riedel, S., & Kiela, D. (2020). Retrieval-Augmented Generation for knowledge-intensive NLP tasks. *Advances in Neural Information Processing Systems*.](https://arxiv.org/abs/2005.11401)

- [Qdrant Team. (2024). *Qdrant vector database documentation*. Qdrant.](https://qdrant.tech/documentation/)

- [Reimers, N., & Gurevych, I. (2019). Sentence-BERT: Sentence embeddings using Siamese BERT networks. *Proceedings of EMNLP*.](https://arxiv.org/abs/1908.10084)
