import os
import math


def calcular_entropia(ruta_archivo):
    with open(ruta_archivo, 'rb') as f:
        datos = f.read()

    if len(datos) == 0:
        return 0

    frecuencia = {}
    for byte in datos:
        frecuencia[byte] = frecuencia.get(byte, 0) + 1

    entropia = 0
    total = len(datos)
    for conteo in frecuencia.values():
        p = conteo / total
        entropia -= p * math.log2(p)

    return round(entropia, 4)


TAMANO_MAX_KB = 500.0  # cap de normalización — archivos más grandes quedan en 1.0


def extraer_caracteristicas(ruta_archivo):
    tamano_kb = os.path.getsize(ruta_archivo) / 1024
    entropia = calcular_entropia(ruta_archivo)

    extension = ruta_archivo.split('.')[-1].lower()
    extension_sospechosa = 1 if extension in ['exe', 'bat', 'vbs', 'sh', 'cmd'] else 0

    with open(ruta_archivo, 'rb') as f:
        muestra = f.read(1000)

    if len(muestra) == 0:
        chars_especiales = 0.0
    else:
        chars_especiales = sum(1 for b in muestra if b < 32 or b > 126) / len(muestra)

    # Normalizar a [0, 1] para que todas las features tengan el mismo peso
    tamano_norm   = min(tamano_kb / TAMANO_MAX_KB, 1.0)
    entropia_norm = entropia / 8.0

    return [tamano_norm, entropia_norm, extension_sospechosa, chars_especiales]
