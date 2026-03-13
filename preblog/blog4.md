# Cifrado homomórfico en bases de datos vectoriales: hacia una búsqueda semántica realmente privada

## Resumen

Las bases de datos vectoriales se han convertido en el núcleo de numerosas aplicaciones modernas de inteligencia artificial: sistemas de búsqueda semántica, recomendadores, arquitecturas RAG ("Retrieval-Augmented Generation") y memorias de largo plazo para agentes inteligentes. Sin embargo, en la gran mayoría de las implementaciones actuales los vectores se almacenan en claro en el servidor. Esto significa que aunque el canal de comunicación esté cifrado mediante TLS, el operador de la infraestructura o un atacante que obtenga acceso al almacenamiento podría inspeccionar directamente los embeddings de documentos, consultas o perfiles de usuario, con las implicaciones de privacidad que esto conlleva.

El cifrado homomórfico ofrece una alternativa cualitativamente diferente: permite ejecutar operaciones matemáticas sobre datos cifrados sin necesidad de descifrarlos en ningún momento del procesamiento. Este artículo explora cómo aplicar cifrado homomórfico en bases de datos vectoriales, qué esquemas criptográficos resultan más adecuados para este propósito, cuáles son los compromisos de rendimiento involucrados y en qué escenarios puede justificarse asumir ese coste adicional a cambio de una privacidad mucho más robusta.

---

## 1. Introducción

Los embeddings han transformado la manera de representar y recuperar información. En lugar de trabajar exclusivamente con claves y valores discretos, los sistemas modernos utilizan vectores de alta dimensión que capturan similitudes semánticas entre documentos, consultas o entidades de cualquier tipo.

Este enfoque permite construir motores de búsqueda capaces de recuperar documentos conceptualmente relacionados con una consulta incluso cuando no comparten ninguna palabra exacta. Sin embargo, esta misma representación introduce desafíos de privacidad que las arquitecturas convencionales no resuelven completamente. Si un atacante accede a la base vectorial, no obtiene simplemente registros estructurados: obtiene representaciones numéricas densas que condensan el contenido semántico de documentos y consultas, lo que en dominios sensibles puede equivaler a exponer historiales médicos, preferencias personales o conversaciones privadas en una forma comprimida pero analizable.

Las técnicas criptográficas tradicionales protegen principalmente dos aspectos: el transporte de los datos (mediante TLS u otros protocolos) y su almacenamiento en reposo (cifrado de disco o de columnas). En ambos casos, sin embargo, los datos deben descifrarse en el servidor para poder ser procesados, lo que significa que el servidor siempre tiene acceso a la información en claro en algún momento de la operación.

El cifrado homomórfico propone un paradigma radicalmente diferente: mantener los datos cifrados incluso durante el procesamiento. Desde la publicación del primer esquema completamente homomórfico por Craig Gentry en 2009, la investigación ha avanzado de forma sostenida, dando lugar a bibliotecas prácticas como SEAL, PALISADE y OpenFHE que permiten realizar operaciones matemáticas directamente sobre datos cifrados. Aplicado a bases de datos vectoriales, este enfoque permitiría calcular productos internos, distancias y métricas de similitud sin que el servidor llegue a conocer los embeddings originales en ningún momento. Un servidor podría así responder consultas semánticas sin acceder a los datos en claro, lo que modifica de raíz el modelo de confianza en arquitecturas de IA alojadas en la nube o en entornos multi-inquilino.

---

## 2. Qué es el cifrado homomórfico y por qué es relevante

Un esquema de cifrado es homomórfico cuando permite realizar determinadas operaciones matemáticas sobre datos cifrados de modo que, al descifrar el resultado, se obtiene el mismo valor que si la operación se hubiera ejecutado directamente sobre los datos originales en claro.

Por ejemplo, en un esquema aditivamente homomórfico se cumple:

Dec(Enc(a) + Enc(b)) = a + b

Cuando el esquema permite además multiplicaciones (con ciertas restricciones en el número de operaciones encadenadas), se habla de esquemas parcialmente homomórficos. Cuando no existe ninguna restricción sobre el tipo ni la cantidad de operaciones, se habla de esquemas completamente homomórficos ("Fully Homomorphic Encryption" o FHE).

En las bases de datos vectoriales, la operación fundamental es el cálculo de similitud entre vectores. Las métricas mas utilizadas son el producto interno, la distancia euclidiana y la similitud coseno. Todas estas funciones pueden expresarse mediante combinaciones de sumas y multiplicaciones entre los componentes de los vectores, lo que las hace directamente traducibles al marco del cifrado homomórfico.

Entre los esquemas disponibles, CKKS (propuesto por Cheon, Kim, Kim y Song en 2017) destaca por su capacidad de operar con números reales aproximados y vectores de alta dimensión, lo que lo hace especialmente atractivo para embeddings de texto o imagen donde los valores son números en coma flotante y una pequeña imprecisión es aceptable.

---

## 3. Arquitectura básica de una base vectorial con cifrado homomórfico

En una arquitectura convencional, la aplicación genera embeddings y los envía en claro al servidor que gestiona la base vectorial. Cuando se introduce cifrado homomórfico, el flujo cambia de manera fundamental.

El proceso típico sería el siguiente:

1. El cliente genera el embedding dentro de un entorno confiable bajo su control.
2. El cliente cifra el vector utilizando una clave pública asociada al esquema homomórfico elegido.
3. El servidor almacena únicamente vectores cifrados; nunca accede a los valores originales.
4. Las consultas se ejecutan mediante operaciones homomórficas directamente sobre los datos cifrados.
5. El servidor devuelve resultados cifrados que solo el cliente puede descifrar con su clave privada.

![Arquitectura de base vectorial con cifrado homomórfico](/images/blog4-homomorphic-arch.svg)

Este enfoque tiene dos consecuencias estructuralmente importantes. En primer lugar, el servidor deja de ser un punto de exposición directa de datos sensibles: incluso con acceso completo al almacenamiento, un atacante solo vería ciphertexts sin acceso a la clave privada del cliente. En segundo lugar, el cliente mantiene el control completo de la clave privada y del proceso de descifrado, lo que significa que la privacidad de los datos no depende de la confianza en el operador del servidor.

La principal limitación de este diseño es el coste computacional: las operaciones sobre vectores cifrados son órdenes de magnitud más costosas que sus equivalentes sobre datos en claro.

---

## 4. Esquemas homomórficos para vectores: foco en CKKS

No todos los esquemas de cifrado homomórfico son igualmente adecuados para operar con embeddings.

Los esquemas BFV y BGV están diseñados principalmente para operaciones exactas sobre enteros, lo que los hace inadecuados para embeddings de texto o imagen cuyos componentes son números reales en coma flotante. El esquema CKKS, en cambio, fue desarrollado específicamente para realizar cálculos aproximados sobre números reales, lo que encaja de forma natural con las características de los embeddings modernos.

CKKS ofrece tres propiedades especialmente relevantes en este contexto:

- Permite trabajar con vectores de valores reales o complejos directamente, sin necesidad de cuantización previa a enteros.
- Soporta el empaquetado de múltiples valores en un único ciphertext, lo que permite aprovechar el paralelismo en los cálculos.
- Permite ejecutar operaciones en paralelo sobre todos los valores empaquetados siguiendo un modelo SIMD ("Single Instruction, Multiple Data").

Esto resulta especialmente útil para embeddings de alta dimensión. Por ejemplo, un embedding de 768 dimensiones puede empaquetarse dentro de uno o pocos ciphertexts dependiendo de los parámetros del esquema seleccionados. CKKS introduce un pequeño error de aproximación controlado en cada operación, pero en el contexto de embeddings esto es generalmente aceptable, ya que estas representaciones son en si mismas aproximaciones semánticas que toleran cierta imprecisión numérica sin perder su utilidad para la recuperación de información.

---

## 5. Cálculo de similitud sobre vectores cifrados

El desafío técnico central consiste en traducir las operaciones habituales de búsqueda vectorial al marco del cifrado homomórfico de forma eficiente.

El producto interno entre un vector de consulta q y un vector almacenado v se define como:

suma(q[i] * v[i]) para i de 1 a n

Con CKKS es posible empaquetar los componentes de ambos vectores de modo que, mediante multiplicaciones elemento a elemento seguidas de operaciones de rotación y suma sobre los ciphertexts, se pueda reconstruir el producto interno completo. Las operaciones de rotación (que desplazan los valores dentro del ciphertext empaquetado para alinear los elementos correspondientes) son las mas costosas computacionalmente en este esquema, por lo que gran parte de la investigación reciente se centra en reducir su número y en diseñar circuitos criptográficos que equilibren la profundidad de las operaciones para evitar que el ruido acumulado degrade la precisión del resultado.

Estas optimizaciones son las que determinan si un sistema de búsqueda homomórfica es únicamente un ejercicio teórico o si puede responder consultas en tiempos de latencia razonables para un caso de uso real.

---

## 6. Coste de rendimiento y estrategias de mitigación

El uso de cifrado homomórfico introduce costes significativos en tres dimensiones principales: tiempo de inserción de vectores (que ahora incluye el proceso de cifrado), tiempo de respuesta a consultas (que requiere operaciones criptográficas sobre los ciphertexts), y uso de memoria (los ciphertexts son considerablemente mas grandes que los vectores originales en claro).

![Trade-offs de rendimiento con cifrado homomórfico](/images/blog4-performance.svg)

Para mitigar estos costes se están explorando diversas estrategias complementarias:

- Aplicar cifrado homomórfico únicamente a los subconjuntos del índice que contienen información verdaderamente sensible, dejando el resto en claro.
- Realizar un prefiltrado en claro mediante metadatos no sensibles antes de ejecutar las operaciones homomórficas, reduciendo el número de ciphertexts sobre los que operar.
- Utilizar hardware especializado como GPU o FPGA, que pueden acelerar significativamente las operaciones de multiplicación polinomial que subyacen a los esquemas homomórficos.
- Ajustar cuidadosamente los parámetros criptográficos (tamaño del polinomio, módulos del esquema) para encontrar el punto de equilibrio entre seguridad, precisión y rendimiento.

En ciertos contextos, como sistemas de salud que operan sobre historiales clínicos o asistentes personales que indexan documentos confidenciales del usuario, puede ser completamente razonable aceptar latencias mayores a cambio de garantías de privacidad que los enfoques convencionales simplemente no pueden ofrecer.

---

## 7. Modelo de amenazas y beneficios reales

El cifrado homomórfico no resuelve todos los problemas de seguridad posibles, pero si ofrece beneficios concretos y bien delimitados frente a un modelo de amenazas específico.

Entre los beneficios principales se encuentran los siguientes: el operador del servidor no puede leer los embeddings en claro bajo ninguna circunstancia, una filtración del almacenamiento no revela los vectores originales a menos que el atacante disponga también de la clave privada del cliente, y el riesgo en entornos multi-inquilino se reduce considerablemente al eliminar la necesidad de confiar en el aislamiento lógico del servidor.

Sin embargo, existen limitaciones importantes que deben tenerse en cuenta al diseñar el sistema. Si el entorno del cliente se ve comprometido, la clave privada puede filtrarse y con ella toda la protección. Los patrones de acceso al servidor (qué colecciones se consultan, con qué frecuencia, en qué secuencia) pueden revelar información indirectamente aunque los contenidos estén cifrados. Algunas operaciones de búsqueda más complejas (filtros combinados, operaciones de reranking avanzadas) siguen siendo difíciles de implementar de forma eficiente en el marco homomórfico.

Por este motivo, muchas propuestas de investigación combinan cifrado homomórfico con otras técnicas de seguridad complementarias, como privacidad diferencial para proteger los patrones de acceso o enclaves seguros para operaciones que no pueden realizarse de forma eficiente de manera homomórfica.

---

## 8. Casos de uso donde resulta especialmente valioso

El cifrado homomórfico en bases de datos vectoriales resulta más valioso en aplicaciones donde la confidencialidad de los datos es un requisito crítico y no negociable:

- Sistemas médicos que indexan historiales clínicos, datos genómicos o resultados de pruebas diagnósticas para búsqueda semántica entre registros de pacientes.
- Asistentes personales que construyen una memoria de largo plazo indexando documentos, correos y notas privadas del usuario alojados en infraestructura de terceros.
- Plataformas legales o financieras donde los documentos indexados contienen información sujeta a confidencialidad profesional o regulatoria.
- Servicios de búsqueda vectorial en la nube que desean ofrecer garantías de privacidad verificables a sus clientes como diferenciador competitivo.

En contextos donde los datos no son especialmente sensibles y el modelo de amenaza no contempla un servidor comprometido, las medidas de seguridad convencionales (cifrado en transito y en reposo, controles de acceso) pueden ser suficientes y mucho menos costosas operativamente.

---

## 9. Guía práctica de implementación (alto nivel)

Un equipo que quiera explorar este enfoque puede seguir una secuencia de pasos razonablemente bien definida:

1. Elegir un esquema y una biblioteca de implementación (CKKS con OpenFHE o Microsoft SEAL son las opciones más maduras y documentadas).
2. Definir con precisión el modelo de amenazas: contra qué tipo de adversario se quiere proteger y qué garantías son suficientes.
3. Diseñar el flujo de gestión de claves: cómo se generan, almacenan y distribuyen las claves públicas y privadas, y qué sucede si una clave se ve comprometida.
4. Prototipar el cálculo de similitud (producto interno o distancia coseno) sobre vectores cifrados con un conjunto pequeño de vectores de prueba.
5. Integrar el prototipo con una base de datos vectorial existente, adaptando las interfaces de inserción y consulta.
6. Medir el rendimiento en términos de latencia, uso de memoria y escalabilidad, e iterar sobre los parámetros criptográficos para optimizar el equilibrio entre seguridad y rendimiento.

El objetivo del prototipo inicial no debería ser competir en latencia con una base vectorial tradicional, sino demostrar que el flujo completo (indexación cifrada, consulta homomórfica y descifrado en cliente) es viable y correcto de extremo a extremo.

---

## 10. Conclusión

El cifrado homomórfico aplicado a bases de datos vectoriales no es una solución universal ni una tecnología lista para desplegar en cualquier contexto, pero si representa una herramienta poderosa y técnicamente madura para diseñar sistemas de búsqueda semántica con garantías de privacidad que los enfoques convencionales no pueden ofrecer.

Permite que un servidor procese consultas y mantenga índices sin acceder en ningún momento a los datos en claro, lo que modifica de forma fundamental el modelo de confianza sobre el que se construyen las arquitecturas de inteligencia artificial alojadas en la nube. Aunque todavía existen desafíos de rendimiento reales, el progreso sostenido en bibliotecas como OpenFHE y el diseño de algoritmos específicos para búsqueda vectorial homomórfica (como los descritos en trabajos recientes sobre Hermes) sugieren que esta tecnología tendrá un papel creciente en los sistemas donde la privacidad no es un requisito opcional sino una restricción fundamental del diseño.

---

## Referencias

- [Gentry, C. (2009). Fully Homomorphic Encryption Using Ideal Lattices. STOC.](https://dl.acm.org/doi/10.1145/1536414.1536440)

- [Cheon, J. H., Kim, A., Kim, M., & Song, Y. (2017). Homomorphic Encryption for Arithmetic of Approximate Numbers. ASIACRYPT.](https://eprint.iacr.org/2016/421)

- [OpenFHE Project. Open-Source Fully Homomorphic Encryption Library.](https://openfhe.org/)

- [Hermes: High-Performance Homomorphically Encrypted Vector Databases. arXiv preprint.](https://arxiv.org/abs/2506.03308)
