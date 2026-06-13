import os
from perceptron import Perceptron
from entrenador import entrenar
from extractor import extraer_caracteristicas


BANNER = """
╔══════════════════════════════════════════╗
║   NODO - Detector de archivos            ║
║   Red neuronal simple (Perceptrón)       ║
║   Proyecto ABPro · Cálculo Diferencial   ║
╚══════════════════════════════════════════╝
"""


def mostrar_caracteristicas(caract):
    nombres = ["Tamaño (KB)", "Entropía", "Ext. sospechosa", "Chars especiales"]
    for nombre, valor in zip(nombres, caract):
        print(f"  {nombre:<20}: {valor:.4f}")


RUTA_MODELO = 'modelo.json'


def cargar_o_entrenar():
    if os.path.isfile(RUTA_MODELO):
        print(f"Modelo encontrado en '{RUTA_MODELO}'. Cargando...")
        red = Perceptron.cargar(RUTA_MODELO)
        print("Modelo cargado. (Para reentrenar con archivos propios corre entrenar_manual.py)\n")
    else:
        print("No hay modelo guardado. Entrenando con datos base...")
        red = Perceptron(n_entradas=4, tasa_aprendizaje=0.1)
        entrenar(red, epochs=2000, verbose=True)
        print("\nRed entrenada correctamente.\n")
    return red


def main():
    print(BANNER)

    red = cargar_o_entrenar()

    while True:
        print("─" * 44)
        ruta = input("Ruta del archivo a analizar (o 'q' para salir): ").strip()

        if ruta.lower() == 'q':
            print("\nSaliendo de Nodo. ¡Hasta pronto!")
            break

        if not os.path.isfile(ruta):
            print(f"  ERROR: No se encontró el archivo '{ruta}'\n")
            continue

        print("\nCaracterísticas extraídas:")
        caract = extraer_caracteristicas(ruta)
        mostrar_caracteristicas(caract)

        confianza = red.predecir(caract)
        print(f"\nConfianza de malicioso: {confianza:.2%}")

        if confianza > 0.5:
            print("RESULTADO: ⚠  SOSPECHOSO — el archivo tiene características inusuales")
        else:
            print("RESULTADO: ✓  LEGÍTIMO   — el archivo parece seguro")
        print()


if __name__ == '__main__':
    main()
