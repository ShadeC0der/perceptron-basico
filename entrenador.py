from perceptron import Perceptron

# [tamano_kb, entropia, ext_sospechosa, chars_especiales]  |  etiqueta: 1=malicioso, 0=legitimo
DATOS_ENTRENAMIENTO = [
    # Archivos legítimos
    ([42.3,  3.8, 0, 0.02], 0),   # PDF normal
    ([120.0, 4.1, 0, 0.05], 0),   # Word normal
    ([350.0, 3.5, 0, 0.01], 0),   # Video normal
    ([85.0,  4.3, 0, 0.03], 0),   # ZIP normal
    ([200.0, 3.9, 0, 0.02], 0),   # Imagen normal
    ([14.0,  4.5, 0, 0.03], 0),   # TXT pequeño normal
    ([5.0,   4.2, 0, 0.02], 0),   # TXT muy pequeño
    ([30.0,  4.4, 0, 0.04], 0),   # Script Python legítimo
    # Archivos maliciosos
    ([8.1,   7.6, 1, 0.91], 1),   # EXE sospechoso
    ([2.0,   7.9, 1, 0.88], 1),   # Script malicioso
    ([1.2,   7.8, 1, 0.95], 1),   # BAT malicioso
    ([0.5,   7.5, 1, 0.85], 1),   # VBS malicioso
    ([3.0,   7.7, 1, 0.90], 1),   # EXE pequeño malicioso
    ([7.8,   7.9, 1, 0.63], 1),   # EXE bytes aleatorios
]


def entrenar(red, epochs=2000, verbose=True):
    for epoch in range(epochs):
        error_total = 0
        for entradas, correcto in DATOS_ENTRENAMIENTO:
            error_total += red.entrenar_un_ejemplo(entradas, correcto)

        if verbose and epoch % 200 == 0:
            print(f"  Epoch {epoch:4d}: Error = {error_total:.4f}")

    return red
