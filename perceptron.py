import math
import json


def sigmoid(z):
    # Clamp para evitar overflow en exp
    z = max(-500, min(500, z))
    return 1 / (1 + math.exp(-z))


def derivada_sigmoid(z):
    s = sigmoid(z)
    return s * (1 - s)


class Perceptron:
    def __init__(self, n_entradas, tasa_aprendizaje=0.1):
        self.pesos = [0.1] * n_entradas
        self.bias = 0.0
        self.tasa = tasa_aprendizaje

    def predecir(self, entradas):
        z = sum(w * x for w, x in zip(self.pesos, entradas)) + self.bias
        return sigmoid(z)

    def entrenar_un_ejemplo(self, entradas, correcto):
        prediccion = self.predecir(entradas)
        error = prediccion - correcto

        z = sum(w * x for w, x in zip(self.pesos, entradas)) + self.bias
        gradiente = error * derivada_sigmoid(z)

        for i in range(len(self.pesos)):
            self.pesos[i] -= self.tasa * gradiente * entradas[i]
        self.bias -= self.tasa * gradiente

        return error ** 2

    def guardar(self, ruta='modelo.json'):
        with open(ruta, 'w') as f:
            json.dump({'pesos': self.pesos, 'bias': self.bias, 'tasa': self.tasa}, f, indent=2)
        print(f"Modelo guardado en {ruta}")

    @classmethod
    def cargar(cls, ruta='modelo.json'):
        with open(ruta) as f:
            datos = json.load(f)
        red = cls(n_entradas=len(datos['pesos']), tasa_aprendizaje=datos['tasa'])
        red.pesos = datos['pesos']
        red.bias = datos['bias']
        return red
