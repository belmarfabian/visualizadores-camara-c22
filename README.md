# Visualizadores de la Cámara de Diputadas y Diputados de Chile

Tres visualizaciones interactivas de la actividad legislativa de la Cámara, desarrolladas en el marco del C22 del Centro de Estudios Públicos.

**Sitio publicado:** https://belmarfabian.github.io/visualizadores-camara-c22/

| Visualizador | Qué muestra |
|---|---|
| **Hemiciclo** | Los 155 escaños con las votaciones individuales, ordenados según su posición W-NOMINATE. |
| **Votaciones** | Mapa ideológico, heatmap de coincidencias, medidas de polarización, detección de díscolos y balance por bancada. |
| **Discurso** | Monitor del discurso legislativo, con procesamiento de lenguaje natural y ranking de relevancia por PageRank. |

## Método

Las coordenadas ideológicas (dimensiones 1 y 2) provienen de W-NOMINATE (Poole y Rosenthal), estimado con la implementación oficial en R sobre las votaciones del período 2026-2030.

## Sobre este repositorio

Contiene el sitio publicado. El pipeline de datos, los scripts de estimación y los documentos de trabajo viven en un repositorio aparte, de acceso restringido.

## Derechos

Todos los derechos reservados. © 2026 C22, Centro de Estudios Públicos.

Este sitio, su código, sus visualizaciones y los conjuntos de datos derivados
que contiene no se pueden copiar, redistribuir, adaptar ni reutilizar sin
permiso previo y por escrito. Ver [LICENSE](LICENSE).

Las votaciones y los discursos analizados provienen de las API de datos
abiertos del Congreso Nacional de Chile y conservan las condiciones de su
fuente.
