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
    caract, _ = extraer_todo(ruta_archivo)
    return caract


def extraer_todo(ruta_archivo):
    """Devuelve (caract_norm, info_raw) con valores crudos para el resumen."""
    tamano_kb = os.path.getsize(ruta_archivo) / 1024
    entropia  = calcular_entropia(ruta_archivo)

    extension            = ruta_archivo.split('.')[-1].lower()
    extension_sospechosa = 1 if extension in ['exe', 'bat', 'vbs', 'sh', 'cmd'] else 0

    with open(ruta_archivo, 'rb') as f:
        muestra = f.read(1000)

    chars_especiales = (
        sum(1 for b in muestra if b < 32 or b > 126) / len(muestra)
        if muestra else 0.0
    )

    tamano_norm   = min(tamano_kb / TAMANO_MAX_KB, 1.0)
    entropia_norm = entropia / 8.0

    caract = [tamano_norm, entropia_norm, extension_sospechosa, chars_especiales]
    info   = {
        'tamano_kb': round(tamano_kb, 2),
        'entropia':  round(entropia, 4),
        'extension': extension,
        'chars_pct': round(chars_especiales * 100, 1),
    }
    return caract, info
