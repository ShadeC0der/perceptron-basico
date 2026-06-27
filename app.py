import os
from flask import Flask, render_template, request, jsonify
from perceptron import Perceptron
from extractor import extraer_todo
from entrenador import entrenar

app = Flask(__name__)

RUTA_MODELO = os.path.join(os.path.dirname(__file__), 'modelo.json')
RUTA_DATOS  = os.path.join(os.path.dirname(__file__), 'datos')


def _cargar_modelo():
    if os.path.isfile(RUTA_MODELO):
        return Perceptron.cargar(RUTA_MODELO)
    red = Perceptron(n_entradas=4, tasa_aprendizaje=0.1)
    entrenar(red, epochs=2000, verbose=False)
    red.guardar(RUTA_MODELO)
    return red


red = _cargar_modelo()


def _generar_resumen(info, caract, pesos, z):
    ext = info['extension']
    e   = info['entropia']
    c   = info['chars_pct']
    kb  = info['tamano_kb']

    # ── Tipo de archivo ──
    susp_exts = {'exe', 'bat', 'vbs', 'cmd', 'sh'}
    code_exts = {'py', 'js', 'ts', 'rb', 'php', 'java', 'c', 'cpp', 'go'}
    text_exts = {'txt', 'csv', 'json', 'xml', 'html', 'css', 'md', 'yaml', 'yml', 'ini', 'cfg'}

    if ext in susp_exts:
        tipo = f'Ejecutable / Script peligroso (.{ext})'
    elif ext in code_exts:
        tipo = f'Código fuente (.{ext})'
    elif ext in text_exts:
        tipo = f'Archivo de texto o datos (.{ext})'
    elif c > 50:
        tipo = f'Binario desconocido (.{ext})' if ext else 'Binario sin extensión'
    else:
        tipo = f'Archivo de datos (.{ext})' if ext else 'Archivo'

    # ── Niveles por feature ──
    if e < 4.0:
        e_nivel, e_desc = 'bajo', 'texto repetitivo o estructura predecible'
    elif e < 6.0:
        e_nivel, e_desc = 'medio', 'texto o datos bien estructurados'
    elif e < 7.5:
        e_nivel, e_desc = 'alto', 'posible compresión o binario'
    else:
        e_nivel, e_desc = 'muy_alto', 'posible cifrado o código empaquetado'

    if c < 5:
        c_nivel, c_desc = 'bajo', 'contenido legible en ASCII'
    elif c < 30:
        c_nivel, c_desc = 'medio', 'mezcla de texto y datos binarios'
    elif c < 70:
        c_nivel, c_desc = 'alto', 'contenido principalmente binario'
    else:
        c_nivel, c_desc = 'muy_alto', 'ejecutable o datos cifrados'

    kb_desc = (
        'archivo muy pequeño' if kb < 10 else
        'archivo pequeño'     if kb < 100 else
        'archivo mediano'     if kb < 300 else
        'archivo grande'
    )

    factores = [
        {
            'nombre':  'Tamaño',
            'raw':     f'{kb:.2f} KB — {kb_desc}',
            'nivel':   'neutro',
            'contrib': round(float(pesos[0] * caract[0]), 4),
        },
        {
            'nombre':  'Entropía',
            'raw':     f'{e:.4f} / 8.0 — {e_nivel.replace("_", " ")} ({e_desc})',
            'nivel':   e_nivel,
            'contrib': round(float(pesos[1] * caract[1]), 4),
        },
        {
            'nombre':  'Extensión',
            'raw':     (f'.{ext} — ejecutable de alto riesgo'
                        if caract[2] == 1 else
                        f'.{ext} — extensión no ejecutable'),
            'nivel':   'muy_alto' if caract[2] == 1 else 'bajo',
            'contrib': round(float(pesos[2] * caract[2]), 4),
        },
        {
            'nombre':  'Chars. especiales',
            'raw':     f'{c:.1f}% — {c_desc}',
            'nivel':   c_nivel,
            'contrib': round(float(pesos[3] * caract[3]), 4),
        },
    ]

    # ── Factor dominante ──
    nombres   = ['Tamaño', 'Entropía', 'Extensión', 'Chars. especiales']
    contribs  = [abs(float(w * x)) for w, x in zip(pesos, caract)]
    idx_dom   = contribs.index(max(contribs))

    return {
        'tipo':                    tipo,
        'tamano_kb':               kb,
        'factores':                factores,
        'factor_dominante':        nombres[idx_dom],
        'factor_dominante_contrib': round(float(pesos[idx_dom] * caract[idx_dom]), 4),
        'margen_z':                round(float(z), 4),
    }


def _build_response(nombre, caract, info, z, confianza):
    nombres = ['Tamaño', 'Entropía', 'Ext. sospechosa', 'Chars especiales']
    return {
        'archivo':  nombre,
        'features': [
            {
                'nombre':      n,
                'valor':       round(float(v), 4),
                'peso':        round(float(w), 4),
                'contribucion': round(float(w * v), 4),
            }
            for n, v, w in zip(nombres, caract, red.pesos)
        ],
        'bias':      round(float(red.bias), 4),
        'z':         round(float(z), 4),
        'confianza': round(float(confianza), 4),
        'resultado': 'sospechoso' if confianza > 0.5 else 'legitimo',
        'resumen':   _generar_resumen(info, caract, red.pesos, z),
    }


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/archivos')
def listar_archivos():
    def _listar(carpeta):
        ruta = os.path.join(RUTA_DATOS, carpeta)
        if not os.path.isdir(ruta):
            return []
        return sorted(f for f in os.listdir(ruta)
                      if os.path.isfile(os.path.join(ruta, f)))

    return jsonify({
        'legitimos':   _listar('legitimos'),
        'sospechosos': _listar('sospechosos'),
    })


@app.route('/api/analizar-ruta', methods=['POST'])
def analizar_ruta():
    body      = request.get_json(silent=True) or {}
    categoria = body.get('categoria', '')
    nombre    = body.get('nombre', '')

    if categoria not in ('legitimos', 'sospechosos') or not nombre:
        return jsonify({'error': 'Parámetros inválidos'}), 400

    ruta = os.path.realpath(os.path.join(RUTA_DATOS, categoria, nombre))
    base = os.path.realpath(RUTA_DATOS)
    if not ruta.startswith(base + os.sep):
        return jsonify({'error': 'Acceso denegado'}), 403

    if not os.path.isfile(ruta):
        return jsonify({'error': 'Archivo no encontrado'}), 404

    caract, info = extraer_todo(ruta)
    confianza    = red.predecir(caract)
    z            = sum(w * x for w, x in zip(red.pesos, caract)) + red.bias

    return jsonify(_build_response(nombre, caract, info, z, confianza))


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
