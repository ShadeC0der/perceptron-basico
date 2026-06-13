"""
Entrena el perceptrón usando archivos reales de las carpetas:
  datos/legitimos/    → coloca aquí archivos que son seguros
  datos/sospechosos/  → coloca aquí archivos sospechosos o maliciosos

Al terminar guarda el modelo en modelo.json para que main.py lo use
directamente sin reentrenar.

Uso:
  python3 entrenar_manual.py
"""

import os
from perceptron import Perceptron
from extractor import extraer_caracteristicas

CARPETA_LEGITIMOS   = 'datos/legitimos'
CARPETA_SOSPECHOSOS = 'datos/sospechosos'
RUTA_MODELO         = 'modelo.json'
EPOCHS              = 3000


def cargar_archivos_de_carpeta(carpeta, etiqueta):
    dataset = []
    archivos = [f for f in os.listdir(carpeta) if os.path.isfile(os.path.join(carpeta, f))]

    if not archivos:
        print(f"  [!] La carpeta '{carpeta}' está vacía.")
        return dataset

    for nombre in archivos:
        ruta = os.path.join(carpeta, nombre)
        try:
            caract = extraer_caracteristicas(ruta)
            dataset.append((caract, etiqueta))
            etiq_str = "LEGITIMO" if etiqueta == 0 else "SOSPECHOSO"
            print(f"  [{etiq_str}] {nombre:40s} → entropía={caract[1]:.2f}, chars_esp={caract[3]:.3f}")
        except Exception as e:
            print(f"  [!] No se pudo leer '{nombre}': {e}")

    return dataset


def main():
    print("=" * 55)
    print("  NODO — Entrenamiento con archivos reales")
    print("=" * 55)

    print(f"\nLeyendo archivos legítimos de '{CARPETA_LEGITIMOS}/'...")
    datos_legitimos = cargar_archivos_de_carpeta(CARPETA_LEGITIMOS, etiqueta=0)

    print(f"\nLeyendo archivos sospechosos de '{CARPETA_SOSPECHOSOS}/'...")
    datos_sospechosos = cargar_archivos_de_carpeta(CARPETA_SOSPECHOSOS, etiqueta=1)

    dataset = datos_legitimos + datos_sospechosos

    if len(dataset) < 2:
        print("\nNecesitas al menos 1 archivo legítimo y 1 sospechoso para entrenar.")
        return

    if not datos_legitimos:
        print("\n[!] No hay archivos legítimos. El modelo no aprenderá a distinguir.")
        return

    if not datos_sospechosos:
        print("\n[!] No hay archivos sospechosos. El modelo no aprenderá a distinguir.")
        return

    print(f"\nTotal: {len(datos_legitimos)} legítimos + {len(datos_sospechosos)} sospechosos = {len(dataset)} ejemplos")
    print(f"\nEntrenando durante {EPOCHS} epochs...\n")

    red = Perceptron(n_entradas=4, tasa_aprendizaje=0.1)

    for epoch in range(EPOCHS):
        error_total = 0
        for entradas, correcto in dataset:
            error_total += red.entrenar_un_ejemplo(entradas, correcto)

        if epoch % 500 == 0:
            print(f"  Epoch {epoch:4d}: Error = {error_total:.4f}")

    print(f"\nEntrenamiento finalizado. Error final = {error_total:.4f}")

    red.guardar(RUTA_MODELO)
    print(f"\nAhora puedes correr 'python3 main.py' y usará este modelo directamente.")


if __name__ == '__main__':
    main()
