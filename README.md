# Proyecto Nodo

**Detector de archivos maliciosos mediante red neuronal simple (Perceptrón)**

Demo en vivo: [https://perceptron-basico.onrender.com/](https://perceptron-basico.onrender.com/)

---

## Requisitos

- Python 3 (sin librerías externas)

Verificar que está instalado:

```bash
python3 --version
```

---

## Estructura del proyecto

```
nodo/
├── datos/
│   ├── legitimos/          archivos usados para entrenar (clase segura)
│   └── sospechosos/        archivos usados para entrenar (clase maliciosa)
├── pruebas/                archivos listos para probar el modelo
├── extractor.py            calcula las 4 características de un archivo
├── perceptron.py           la neurona: sigmoid, derivada, ajuste de pesos
├── entrenador.py           datos base y bucle de entrenamiento
├── entrenar_manual.py      entrena el modelo con archivos reales de las carpetas
├── main.py                 interfaz principal del programa
└── modelo.json             pesos guardados del último entrenamiento
```

---

## Cómo ejecutar

### Uso normal

```bash
cd /proyecto
python3 main.py
```

El programa carga el modelo guardado (`modelo.json`) y queda esperando rutas de archivos.

```
Ruta del archivo a analizar (o 'q' para salir): pruebas/updater.exe

  Características extraídas:
    Tamaño (KB)         : 0.0234
    Entropía            : 0.9981
    Ext. sospechosa     : 1.0000
    Chars especiales    : 0.6290

  Confianza de malicioso: 98.47%
  RESULTADO: ⚠  SOSPECHOSO — el archivo tiene características inusuales
```

Escribe `q` para salir.

### Archivos de prueba listos

La carpeta `pruebas/` contiene 12 archivos para experimentar:

| Archivo                      | Tipo esperado         |
| ---------------------------- | --------------------- |
| `pruebas/system_log.txt`     | Legítimo              |
| `pruebas/backup.sh`          | Legítimo              |
| `pruebas/config.xml`         | Legítimo              |
| `pruebas/notas_alumnos.csv`  | Legítimo              |
| `pruebas/README.md`          | Legítimo              |
| `pruebas/api_response.json`  | Legítimo              |
| `pruebas/updater.exe`        | Sospechoso            |
| `pruebas/install_helper.vbs` | Sospechoso            |
| `pruebas/cleanup.bat`        | Sospechoso            |
| `pruebas/repair.cmd`         | Sospechoso            |
| `pruebas/setup_pro.exe`      | Sospechoso            |
| `pruebas/telemetry.dat`      | Ambiguo (caso límite) |

---

## Entrenar con archivos propios

Para mejorar el modelo con archivos reales:

```bash
# 1. Copiar archivos a las carpetas correspondientes
cp mi_documento.pdf   datos/legitimos/
cp virus_muestra.exe  datos/sospechosos/

# 2. Eliminar el modelo anterior
rm modelo.json

# 3. Entrenar con los nuevos datos
python3 entrenar_manual.py

# 4. Usar el programa normalmente
python3 main.py
```

Mientras más variados sean los archivos de entrenamiento (distintos tamaños y tipos), mejor será la precisión del modelo.

---

---

# Informe técnico — Conceptos clave del proyecto

## 1. ¿Qué es el Perceptrón?

El perceptrón es la unidad más simple de una red neuronal: una sola neurona artificial que recibe múltiples valores numéricos de entrada, los combina y produce una única salida.

Fue propuesto por Frank Rosenblatt en 1958 y es el punto de partida para entender el aprendizaje automático. En este proyecto, la neurona recibe 4 características de un archivo y decide si es malicioso o legítimo.

---

## 2. Las 4 características del archivo (entradas de la red)

Antes de que la neurona tome una decisión, el módulo `extractor.py` transforma el archivo en 4 números normalizados entre 0 y 1:

| Característica       | Qué mide                         | Legítimo        | Sospechoso      |
| -------------------- | -------------------------------- | --------------- | --------------- |
| Tamaño normalizado   | Peso del archivo / 500 KB        | cualquier valor | cualquier valor |
| Entropía normalizada | Aleatoriedad del contenido / 8   | 0.50 – 0.65     | 0.94 – 1.00     |
| Extensión sospechosa | 1 si es .exe .bat .vbs .cmd      | 0               | 1               |
| Chars especiales     | % de bytes fuera del rango ASCII | 0.01 – 0.06     | 0.60 – 0.95     |

La normalización es importante: sin ella, el tamaño del archivo (que puede llegar a miles de KB) dominaría el aprendizaje y opacaría las otras señales.

---

## 3. Entropía de Shannon

La entropía mide qué tan aleatorio o caótico es el contenido de un archivo. Se calcula con la fórmula:

```
H = -Σ p(x) × log₂(p(x))
```

Donde `p(x)` es la probabilidad de aparición de cada byte (0–255).

- Un archivo de texto tiene palabras y espacios repetidos → entropía baja (~4 bits)
- Un archivo cifrado o comprimido tiene bytes casi uniformemente distribuidos → entropía alta (~7.9 bits)
- El valor máximo teórico es 8 (todos los 256 bytes con igual probabilidad)

En el código (`extractor.py`):

```python
frecuencia = {}
for byte in datos:
    frecuencia[byte] = frecuencia.get(byte, 0) + 1

entropia = 0
for conteo in frecuencia.values():
    p = conteo / total
    entropia -= p * math.log2(p)
```

---

## 4. Función Sigmoid

La función sigmoid convierte la suma ponderada de la neurona (cualquier número real) en un valor entre 0 y 1, que se interpreta como probabilidad de que el archivo sea malicioso.

```
σ(z) = 1 / (1 + e^(-z))
```

| Valor de z | Salida sigmoid | Interpretación |
| ---------- | -------------- | -------------- |
| -5         | 0.007          | muy seguro     |
| 0          | 0.500          | no sabe        |
| +5         | 0.993          | muy sospechoso |

Tiene dos propiedades que la hacen ideal para este uso:

1. Su salida siempre está acotada entre 0 y 1
2. Su derivada se puede calcular usando la propia función, lo que simplifica el entrenamiento

En el código (`perceptron.py`):

```python
def sigmoid(z):
    return 1 / (1 + math.exp(-z))
```

---

## 5. Derivada de la Sigmoid

La derivada de la sigmoid indica qué tan rápido cambia la función en cada punto. Se usa durante el entrenamiento para calcular cuánto ajustar los pesos.

Su forma es especialmente elegante:

```
σ'(z) = σ(z) × (1 - σ(z))
```

La derivada se puede calcular reutilizando el valor de la sigmoid ya computado, sin necesidad de derivar desde cero.

En el código:

```python
def derivada_sigmoid(z):
    s = sigmoid(z)
    return s * (1 - s)
```

---

## 6. Suma Ponderada

La neurona combina las 4 características del archivo multiplicando cada una por un peso aprendido y sumando un sesgo (bias):

```
z = w₁×x₁ + w₂×x₂ + w₃×x₃ + w₄×x₄ + bias
```

- `x₁ x₂ x₃ x₄` son las características del archivo (entradas)
- `w₁ w₂ w₃ w₄` son los pesos (lo que la red aprende)
- `bias` permite desplazar la decisión sin depender solo de las entradas

Al inicio todos los pesos valen 0.1. Tras el entrenamiento, los pesos que corresponden a características más informativas (entropía, chars especiales) crecen más que los demás.

---

## 7. Regla de la Cadena

Para calcular cómo afecta cada peso al error final, se necesita derivar funciones encadenadas. Eso es exactamente la regla de la cadena del Cálculo Diferencial:

```
dError/dw = dError/dSalida × dSalida/dZ × dZ/dw
```

Simplificado en código como:

```python
gradiente = error * derivada_sigmoid(z)
```

La regla de la cadena permite "propagar" el error hacia atrás a través de la función sigmoid hasta llegar a los pesos, y calcular cuánto debe cambiar cada uno.

---

## 8. Gradiente Descendente

Es el mecanismo con el que la red mejora. Usa la derivada del error para ajustar los pesos en la dirección que reduce el error:

```
w_nuevo = w_actual - α × (dError/dw)
```

Donde `α` (alpha) es la tasa de aprendizaje — qué tan grandes son los pasos de ajuste. En este proyecto se usa `α = 0.1`.

La analogía: es como bajar una colina con los ojos cerrados, dando un pequeño paso en la dirección más empinada hacia abajo en cada iteración. El punto más bajo de la colina es donde el error es mínimo.

En el código:

```python
for i in range(len(self.pesos)):
    self.pesos[i] -= self.tasa * gradiente * entradas[i]
self.bias -= self.tasa * gradiente
```

---

## 9. Proceso de entrenamiento

El entrenador muestra ejemplos a la neurona miles de veces (epochs). En cada vuelta:

1. La red predice con los pesos actuales
2. Se calcula el error: `(predicción - valor_correcto)²`
3. Se calcula el gradiente usando la regla de la cadena
4. Se ajustan los pesos con gradiente descendente

Evolución real del error en este proyecto:

```
Epoch    0:  Error = 5.34   (la red no sabe nada)
Epoch  500:  Error = 0.047  (empieza a distinguir)
Epoch 1500:  Error = 0.014  (ya discrimina bien)
Epoch 3000:  Error = 0.007  (convergencia)
```

---

## 10. Limitaciones del modelo

**Limitación 1 — No es un antivirus real**
El perceptrón analiza características externas del archivo (tamaño, entropía, extensión), no su comportamiento en ejecución. Un virus que se comporte como texto normal podría pasar desapercibido.

**Limitación 2 — Clasificación binaria**
Solo puede responder "sospechoso" o "legítimo". No puede dar una escala de peligrosidad ni distinguir entre tipos de amenazas.

**Limitación 3 — Separación lineal**
El perceptrón solo puede trazar una línea recta (hiperplano) en el espacio de características. Si los patrones de archivos legítimos y maliciosos se superponen en ese espacio, el modelo no puede separarlos correctamente sin importar cuántos ejemplos tenga. Para ese nivel se requiere una red multicapa.

**Limitación 4 — Dependencia de los datos**
La calidad del modelo depende directamente de los archivos de entrenamiento. Con datos simulados los resultados son ilustrativos, no clínicamente confiables. El caso `telemetry.dat` (alta entropía, extensión inofensiva) ilustra exactamente este punto: el modelo lo clasifica como legítimo porque nunca vio archivos cifrados con extensión normal.

---
