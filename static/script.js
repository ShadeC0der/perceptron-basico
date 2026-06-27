/* ══ DOM refs ═══════════════════════════════════════════ */
const errorBanner     = document.getElementById('errorBanner');
const secRed          = document.getElementById('secRed');
const secInforme      = document.getElementById('secInforme');
const networkSvg      = document.getElementById('networkSvg');
const featuresList    = document.getElementById('featuresList');
const mathContent     = document.getElementById('mathContent');
const gaugeSvg        = document.getElementById('gaugeSvg');
const confidenceValue = document.getElementById('confidenceValue');
const verdictIcon     = document.getElementById('verdictIcon');
const verdictText     = document.getElementById('verdictText');
const verdictDesc     = document.getElementById('verdictDesc');
const verdictFile     = document.getElementById('verdictFile');
const historyBody     = document.getElementById('historyBody');
const historyCard     = document.getElementById('historyCard');
const collapseBtn     = document.getElementById('collapseBtn');
const mathBody        = document.getElementById('mathBody');
const listLegitimos   = document.getElementById('listLegitimos');
const listSospechosos = document.getElementById('listSospechosos');
const summaryFileHeader = document.getElementById('summaryFileHeader');
const summaryFactors    = document.getElementById('summaryFactors');
const zExplanation      = document.getElementById('zExplanation');
const zMarker           = document.getElementById('zMarker');
const zMarkerDot        = document.getElementById('zMarkerDot');
const zMarkerLabel      = document.getElementById('zMarkerLabel');
const zDominant         = document.getElementById('zDominant');

let scanCount = 0;
let activeBtn = null;

/* ══ Collapse ════════════════════════════════════════════ */
collapseBtn.addEventListener('click', () => {
  const isOpen = !collapseBtn.classList.contains('closed');
  collapseBtn.classList.toggle('closed', isOpen);
  mathBody.classList.toggle('collapsed', isOpen);
});

/* ══ Icon helper ═════════════════════════════════════════ */
const ICON_PATHS = {
  'file':       '<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>',
  'file-text':  '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  'file-code':  '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="10 13 8 15 10 17"/><polyline points="14 13 16 15 14 17"/>',
  'terminal':   '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
  'cpu':        '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>',
  'braces':     '<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/>',
  'table2':     '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/>',
  'globe':      '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  'palette':    '<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
  'shield-ok':  '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
  'shield-bad': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
};
function icon(name, size = 14) {
  const p = ICON_PATHS[name] ?? ICON_PATHS['file'];
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
}

/* ══ File list ═══════════════════════════════════════════ */
const EXT_ICON_MAP = {
  py:'file-code', js:'file-code', ts:'file-code', jsx:'file-code', tsx:'file-code',
  rb:'file-code', php:'file-code', java:'file-code', c:'file-code', cpp:'file-code', go:'file-code',
  html:'globe', css:'palette',
  json:'braces',
  csv:'table2', xlsx:'table2',
  txt:'file-text', md:'file-text', xml:'file-text', yaml:'file-text', yml:'file-text',
  ini:'file-text', cfg:'file-text', dat:'file-text',
  sh:'terminal', bash:'terminal',
  exe:'cpu', bat:'terminal', vbs:'terminal', cmd:'terminal',
};
const extIcon = n => icon(EXT_ICON_MAP[n.split('.').pop()?.toLowerCase()] ?? 'file');

function buildFileList(ul, files, cat) {
  ul.innerHTML = '';
  files.forEach(nombre => {
    const ext  = nombre.includes('.') ? nombre.split('.').pop().toLowerCase() : '';
    const li   = document.createElement('li');
    const btn  = document.createElement('button');
    btn.className         = 'file-btn';
    btn.dataset.categoria = cat;
    btn.dataset.nombre    = nombre;
    btn.innerHTML = `
      <span class="file-icon" aria-hidden="true">${extIcon(nombre)}</span>
      <span class="file-name">${nombre}</span>
      ${ext ? `<span class="file-ext-badge ${cat === 'sospechosos' ? 'ext-susp' : 'ext-legit'}">.${ext}</span>` : ''}
    `;
    btn.addEventListener('click', () => handleTestFile(btn));
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

async function loadTestFiles() {
  try {
    const res  = await fetch('/api/archivos');
    const data = await res.json();
    buildFileList(listLegitimos,   data.legitimos,   'legitimos');
    buildFileList(listSospechosos, data.sospechosos, 'sospechosos');
  } catch {}
}

async function handleTestFile(btn) {
  if (activeBtn) activeBtn.classList.remove('active', 'loading');
  activeBtn = btn;
  btn.classList.add('active', 'loading');

  const { categoria, nombre } = btn.dataset;
  hideError();

  try {
    const res  = await fetch('/api/analizar-ruta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoria, nombre }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al analizar');
    renderAll(data);
    addToHistory(data);
  } catch (err) {
    showError(err.message);
  } finally {
    btn.classList.remove('loading');
  }
}

loadTestFiles();

/* ══ UI helpers ══════════════════════════════════════════ */
function showError(msg) {
  errorBanner.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:-2px;margin-right:6px"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>${msg}`;
  errorBanner.hidden = false;
}
function hideError() { errorBanner.hidden = true; }

/* ══ Render all ══════════════════════════════════════════ */
function renderAll(data) {
  secRed.hidden     = false;
  secInforme.hidden = false;
  secRed.classList.add('fade-in');
  setTimeout(() => secRed.classList.remove('fade-in'), 500);

  drawNetwork(data);
  renderSummary(data);
  renderFeatures(data.features);
  drawGauge(data.confianza);
  renderVerdict(data);
  renderMath(data);

  collapseBtn.classList.remove('closed');
  mathBody.classList.remove('collapsed');

  setTimeout(() => secRed.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
}

/* ══ Summary ═════════════════════════════════════════════ */
function renderSummary(data) {
  const { resumen, archivo, z } = data;
  const isSusp = data.resultado === 'sospechoso';

  summaryFileHeader.innerHTML = `
    <span class="summary-tipo-badge">${resumen.tipo}</span>
    <span class="summary-filename">${archivo}</span>
    <span class="summary-size">${resumen.tamano_kb} KB</span>
  `;

  summaryFactors.innerHTML = '';
  resumen.factores.forEach(f => {
    const row = document.createElement('div');
    row.className = 'factor-row';
    row.innerHTML = `
      <span class="factor-dot ${f.nivel}"></span>
      <span class="factor-nombre">${f.nombre}</span>
      <span class="factor-raw">${f.raw}</span>
    `;
    summaryFactors.appendChild(row);
  });

  const abs = Math.abs(z).toFixed(3);
  zExplanation.innerHTML = isSusp
    ? `La neurona activa cuando <strong>z &gt; 0</strong>. Este archivo supera el umbral en <strong>+${abs}</strong> → <strong style="color:var(--danger)">sospechoso</strong>.`
    : `La neurona activa cuando <strong>z &gt; 0</strong>. Este archivo no alcanza el umbral en <strong>${abs}</strong> → <strong style="color:var(--primary)">legítimo</strong>.`;

  const pct = 50 + (Math.max(-5, Math.min(5, z)) / 5) * 47;
  zMarker.style.left = `${pct}%`;

  const col  = isSusp ? 'var(--danger)' : 'var(--primary)';
  const glow = isSusp ? 'var(--danger-glow)' : 'var(--primary-glow)';
  zMarkerDot.style.background = col;
  zMarkerDot.style.boxShadow  = `0 0 8px ${glow}`;
  zMarkerLabel.textContent     = `z=${z >= 0 ? '+' : ''}${z.toFixed(3)}`;
  zMarkerLabel.style.color     = col;

  const s = resumen.factor_dominante_contrib >= 0 ? '+' : '';
  zDominant.innerHTML = `
    <span class="dom-label">Factor dominante</span>
    <span class="dom-name">${resumen.factor_dominante}</span>
    <span class="dom-contrib">(contribución ${s}${resumen.factor_dominante_contrib.toFixed(4)})</span>
  `;
}

/* ══ Network SVG (mejorado) ══════════════════════════════ */
function drawNetwork(data) {
  const ns = 'http://www.w3.org/2000/svg';
  const el = (tag, a = {}) => {
    const e = document.createElementNS(ns, tag);
    Object.entries(a).forEach(([k, v]) => e.setAttribute(k, v));
    return e;
  };
  const txt = (s, a = {}) => { const e = el('text', a); e.textContent = s; return e; };

  networkSvg.innerHTML = '';

  /* Layout */
  const INX = 30, INW = 150, INH = 68, INR = 10;
  const CYS = [60, 153, 246, 340];     // centers Y de los 4 inputs
  const NEX = 480, NEY = 200, NER = 82;
  const OUX = 740, OUY = 200, OUR = 58;
  const LINEX = INX + INW;             // 180 — donde terminan los rects
  const LINEY = NEX - NER;             // 398 — donde empieza el neurón

  const isSusp   = data.resultado === 'sospechoso';
  const outColor = isSusp ? '#ff4040' : '#00d4aa';
  const maxW     = Math.max(...data.features.map(f => Math.abs(f.peso)), 0.01);

  /* ── Defs ──────────────────────────────────────────── */
  const defs = el('defs');

  // Glow filter
  const fg = el('filter', { id: 'glow', x: '-60%', y: '-60%', width: '220%', height: '220%' });
  const gb = el('feGaussianBlur', { stdDeviation: '4', result: 'b' });
  const gm = el('feMerge');
  gm.appendChild(el('feMergeNode', { in: 'b' }));
  gm.appendChild(el('feMergeNode', { in: 'SourceGraphic' }));
  fg.appendChild(gb); fg.appendChild(gm);
  defs.appendChild(fg);

  // Output glow
  const og = el('filter', { id: 'oglow', x: '-70%', y: '-70%', width: '240%', height: '240%' });
  const ob = el('feGaussianBlur', { stdDeviation: '6', result: 'b2' });
  const om = el('feMerge');
  om.appendChild(el('feMergeNode', { in: 'b2' }));
  om.appendChild(el('feMergeNode', { in: 'SourceGraphic' }));
  og.appendChild(ob); og.appendChild(om);
  defs.appendChild(og);

  networkSvg.appendChild(defs);

  /* ── Background grid (decorativo) ─────────────────── */
  for (let x = 0; x <= 860; x += 40) {
    networkSvg.appendChild(el('line', {
      x1: x, y1: 0, x2: x, y2: 430,
      stroke: '#111927', 'stroke-width': 1,
    }));
  }
  for (let y = 0; y <= 430; y += 40) {
    networkSvg.appendChild(el('line', {
      x1: 0, y1: y, x2: 860, y2: y,
      stroke: '#111927', 'stroke-width': 1,
    }));
  }

  /* ── Función para punto en bezier cúbica ───────────── */
  function bezierPt(x1,y1,cx1,cy1,cx2,cy2,x2,y2, t) {
    const m = 1 - t;
    return {
      x: m*m*m*x1 + 3*m*m*t*cx1 + 3*m*t*t*cx2 + t*t*t*x2,
      y: m*m*m*y1 + 3*m*m*t*cy1 + 3*m*t*t*cy2 + t*t*t*y2,
    };
  }

  /* ── Conexiones input → neurona ────────────────────── */
  const fullNames = ['Tamaño', 'Entropía', 'Extensión', 'Chars. esp.'];

  data.features.forEach((f, i) => {
    const x1 = LINEX, y1 = CYS[i];
    const x2 = LINEY, y2 = NEY;
    const bx  = (x1 + x2) / 2;

    const normW  = Math.abs(f.peso) / maxW;
    const col    = f.peso >= 0 ? '#22d3ee' : '#f97316';
    const sw     = 1 + normW * 3;
    const op     = 0.3 + normW * 0.6;
    const pid    = `p${i}`;
    const d      = `M ${x1} ${y1} C ${bx} ${y1} ${bx} ${y2} ${x2} ${y2}`;

    networkSvg.appendChild(el('path', {
      id: pid, d, fill: 'none', stroke: col,
      'stroke-width': sw, opacity: op,
    }));

    /* Partícula animada */
    const dot = el('circle', { r: 3.5, fill: col, opacity: 0.9 });
    const mot = el('animateMotion', {
      dur: `${1.3 + i * 0.2}s`, repeatCount: 'indefinite', begin: `${i * 0.28}s`,
    });
    const mp = el('mpath');
    mp.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${pid}`);
    mot.appendChild(mp); dot.appendChild(mot);
    networkSvg.appendChild(dot);

    /* Etiqueta de peso con fondo */
    const lp = bezierPt(x1,y1,bx,y1,bx,y2,x2,y2, 0.38);
    const wStr = `w${i+1}=${f.peso >= 0 ? '+' : ''}${f.peso.toFixed(3)}`;
    const wW   = wStr.length * 6.4 + 10;
    networkSvg.appendChild(el('rect', {
      x: lp.x - wW/2, y: lp.y - 10, width: wW, height: 17,
      rx: 4, fill: '#0c1018', opacity: 0.9,
    }));
    networkSvg.appendChild(txt(wStr, {
      x: lp.x, y: lp.y + 3,
      'text-anchor': 'middle',
      fill: col, 'font-size': '10', 'font-family': 'monospace', 'font-weight': '600',
    }));
  });

  /* ── Neurona → salida ──────────────────────────────── */
  const opid = 'pout';
  networkSvg.appendChild(el('path', {
    id: opid,
    d: `M ${NEX + NER} ${NEY} L ${OUX - OUR} ${OUY}`,
    fill: 'none', stroke: outColor, 'stroke-width': 2.5, opacity: 0.75,
  }));
  const odot = el('circle', { r: 4, fill: outColor, opacity: 0.9 });
  const omot = el('animateMotion', { dur: '0.85s', repeatCount: 'indefinite' });
  const omp  = el('mpath');
  omp.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${opid}`);
  omot.appendChild(omp); odot.appendChild(omot);
  networkSvg.appendChild(odot);

  /* ── Nodos de entrada (rectángulos) ─────────────────── */
  data.features.forEach((f, i) => {
    const rx = INX, ry = CYS[i] - INH / 2;
    const cx = INX + INW / 2;

    // Borde coloreado según contribución
    const contrib = Math.abs(f.contribucion);
    const bCol = contrib > 0.3 ? '#ff4040'
               : contrib > 0.1 ? '#ffaa00'
               : '#1a2438';

    // Rect fondo
    networkSvg.appendChild(el('rect', {
      x: rx, y: ry, width: INW, height: INH, rx: INR,
      fill: '#0a0e1a', stroke: bCol, 'stroke-width': 1.5,
    }));

    // Barra de valor (abajo del rect)
    const barW = INW - 20, barX = INX + 10, barY = ry + INH - 12;
    networkSvg.appendChild(el('rect', {
      x: barX, y: barY, width: barW, height: 3, rx: 2,
      fill: '#1a2438',
    }));
    if (f.valor > 0) {
      const barFill = f.peso >= 0 ? '#22d3ee' : '#f97316';
      networkSvg.appendChild(el('rect', {
        x: barX, y: barY, width: Math.round(barW * f.valor), height: 3, rx: 2,
        fill: barFill, opacity: 0.7,
      }));
    }

    // Nombre de feature (top)
    networkSvg.appendChild(txt(fullNames[i].toUpperCase(), {
      x: cx, y: ry + 16,
      'text-anchor': 'middle', fill: '#4f627a',
      'font-size': '9', 'font-family': 'monospace', 'letter-spacing': '0.5',
    }));

    // Valor normalizado (center)
    networkSvg.appendChild(txt(f.valor.toFixed(4), {
      x: cx, y: ry + 38,
      'text-anchor': 'middle', fill: '#dde4f0',
      'font-size': '15', 'font-weight': '700', 'font-family': 'monospace',
    }));
  });

  /* ── Bias (nodo extra abajo del neurón) ─────────────── */
  const biasSY = NEY + NER + 22, biasCX = NEX;
  networkSvg.appendChild(el('line', {
    x1: biasCX, y1: biasSY, x2: NEX, y2: NEY + NER,
    stroke: '#253144', 'stroke-width': 1.5, 'stroke-dasharray': '4 3',
  }));
  networkSvg.appendChild(el('rect', {
    x: biasCX - 52, y: biasSY,
    width: 104, height: 22, rx: 5,
    fill: '#0c1018', stroke: '#253144', 'stroke-width': 1,
  }));
  const biasSign = data.bias >= 0 ? '+' : '';
  networkSvg.appendChild(txt(`bias = ${biasSign}${data.bias.toFixed(4)}`, {
    x: biasCX, y: biasSY + 15,
    'text-anchor': 'middle', fill: '#4f627a',
    'font-size': '10', 'font-family': 'monospace',
  }));

  /* ── Neurona ─────────────────────────────────────────── */
  // Anillo exterior decorativo
  networkSvg.appendChild(el('circle', {
    cx: NEX, cy: NEY, r: NER + 8,
    fill: 'none', stroke: '#00d4aa', 'stroke-width': 1,
    opacity: 0.15,
  }));

  const neuron = el('circle', {
    cx: NEX, cy: NEY, r: NER,
    fill: '#090d18', stroke: '#00d4aa', 'stroke-width': 2,
    filter: 'url(#glow)',
  });
  neuron.appendChild(el('animate', {
    attributeName: 'stroke-width', values: '2;3.5;2', dur: '2.5s', repeatCount: 'indefinite',
  }));
  networkSvg.appendChild(neuron);

  // Símbolo Σ
  networkSvg.appendChild(txt('Σ', {
    x: NEX, y: NEY - 8,
    'text-anchor': 'middle', fill: '#00d4aa',
    'font-size': '32', 'font-weight': '300',
  }));

  // Línea divisoria
  networkSvg.appendChild(el('line', {
    x1: NEX - 36, y1: NEY + 6, x2: NEX + 36, y2: NEY + 6,
    stroke: '#1a2438', 'stroke-width': 1,
  }));

  // z value
  const zSign = data.z >= 0 ? '+' : '';
  networkSvg.appendChild(txt(`z = ${zSign}${data.z.toFixed(3)}`, {
    x: NEX, y: NEY + 22,
    'text-anchor': 'middle', fill: '#ffaa00',
    'font-size': '11', 'font-family': 'monospace', 'font-weight': '600',
  }));
  networkSvg.appendChild(txt('σ(z)', {
    x: NEX, y: NEY + 37,
    'text-anchor': 'middle', fill: '#4f627a',
    'font-size': '10', 'font-family': 'monospace',
  }));

  /* ── Nodo de salida (anillo de confianza) ────────────── */
  // Background track
  const ringR = OUR - 10;
  const circ  = 2 * Math.PI * ringR;
  networkSvg.appendChild(el('circle', {
    cx: OUX, cy: OUY, r: ringR,
    fill: 'none', stroke: '#1a2438', 'stroke-width': 12, 'stroke-linecap': 'round',
  }));
  // Colored arc
  const arcLen = data.confianza * circ;
  const outRing = el('circle', {
    cx: OUX, cy: OUY, r: ringR,
    fill: 'none', stroke: outColor, 'stroke-width': 12, 'stroke-linecap': 'round',
    'stroke-dasharray': `${arcLen.toFixed(2)} ${(circ - arcLen).toFixed(2)}`,
    'stroke-dashoffset': (circ * 0.25).toFixed(2),
    transform: `rotate(-90 ${OUX} ${OUY})`,
    filter: 'url(#oglow)',
  });
  networkSvg.appendChild(outRing);

  // Background circle
  networkSvg.appendChild(el('circle', {
    cx: OUX, cy: OUY, r: ringR - 8,
    fill: '#07090f',
  }));

  // Porcentaje
  networkSvg.appendChild(txt(`${(data.confianza * 100).toFixed(0)}%`, {
    x: OUX, y: OUY + 5,
    'text-anchor': 'middle', fill: outColor,
    'font-size': '18', 'font-weight': '700', 'font-family': 'monospace',
  }));

  // Label resultado
  networkSvg.appendChild(txt(isSusp ? 'SOSP.' : 'OK', {
    x: OUX, y: OUY + OUR + 20,
    'text-anchor': 'middle', fill: outColor,
    'font-size': '12', 'font-weight': '700', 'font-family': 'monospace', 'letter-spacing': '2',
  }));

  /* ── Leyenda ─────────────────────────────────────────── */
  const ly = 400;
  [[35, '#22d3ee', 'Peso positivo'], [195, '#f97316', 'Peso negativo']].forEach(([lx, lc, label]) => {
    networkSvg.appendChild(el('rect', { x: lx, y: ly, width: 10, height: 10, rx: 2, fill: lc, opacity: 0.8 }));
    networkSvg.appendChild(txt(label, {
      x: lx + 16, y: ly + 9,
      fill: '#4f627a', 'font-size': '10', 'font-family': 'monospace',
    }));
  });
  networkSvg.appendChild(txt('El grosor indica la magnitud del peso', {
    x: 835, y: ly + 9,
    'text-anchor': 'end',
    fill: '#4f627a', 'font-size': '10', 'font-family': 'monospace',
  }));
}

/* ══ Features ════════════════════════════════════════════ */
function renderFeatures(features) {
  featuresList.innerHTML = '';
  features.forEach(f => {
    const posW = f.peso >= 0;
    const posC = f.contribucion >= 0;
    const barColor = f.valor > 0
      ? (posW ? 'var(--weight-pos)' : 'var(--weight-neg)')
      : 'var(--border-hi)';
    const item = document.createElement('div');
    item.className = 'feature-item';
    item.innerHTML = `
      <div class="feature-header">
        <span class="feature-name">${f.nombre}</span>
        <span class="feature-val">x = ${f.valor.toFixed(4)}</span>
      </div>
      <div class="feature-bar-track">
        <div class="feature-bar-fill" data-target="${(f.valor*100).toFixed(2)}"
             style="background:${barColor};width:0%"></div>
      </div>
      <div class="feature-meta">
        <span class="meta-peso">peso</span>
        <span class="meta-peso-val ${posW ? 'pos' : 'neg'}">${posW?'+':''}${f.peso.toFixed(4)}</span>
        <span class="meta-sep">·</span>
        <span class="meta-contrib ${posC ? 'pos-c' : 'neg-c'}">
          contribución ${posC?'+':''}${f.contribucion.toFixed(4)}
        </span>
      </div>
    `;
    featuresList.appendChild(item);
  });
  requestAnimationFrame(() => {
    document.querySelectorAll('.feature-bar-fill').forEach(b => {
      b.style.width = `${b.dataset.target}%`;
    });
  });
}

/* ══ Math con explicaciones ══════════════════════════════ */
function renderMath(data) {
  const { features, bias, z, confianza } = data;
  const isSusp = data.resultado === 'sospechoso';

  // Términos simbólicos
  const symTerms = features.map((f, i) => {
    const cls = f.peso >= 0 ? 'f-term-p' : 'f-term-n';
    return `<span class="${cls}">w<sub>${i+1}</sub>·x<sub>${i+1}</sub></span>`;
  }).join(' <span class="f-plus">+</span> ');

  // Términos numéricos
  const numTerms = features.map(f => {
    const cls  = f.contribucion >= 0 ? 'f-term-p' : 'f-term-n';
    const sign = f.peso >= 0 ? '+' : '';
    return `<span class="${cls}">(${sign}${f.peso.toFixed(3)} × ${f.valor.toFixed(4)})</span>`;
  }).join(' <span class="f-plus">+</span> ');

  // Contribuciones
  const contribTerms = features.map(f => {
    const cls  = f.contribucion >= 0 ? 'f-term-p' : 'f-term-n';
    const sign = f.contribucion >= 0 ? '+' : '';
    return `<span class="${cls}">${sign}${f.contribucion.toFixed(4)}</span>`;
  }).join(' <span class="f-plus">+</span> ');

  const biasSign  = bias >= 0 ? '+' : '';
  const zSign     = z >= 0 ? '+' : '';
  const eNegZ     = Math.exp(-z).toFixed(6);
  const denom     = (1 + Math.exp(-z)).toFixed(6);
  const confPct   = (confianza * 100).toFixed(2);
  const resultCol = isSusp ? 'danger' : 'primary';
  const resultStr = isSusp ? 'SOSPECHOSO' : 'LEGÍTIMO';

  mathContent.innerHTML = `
  <div class="math-steps">

    <!-- PASO 1 -->
    <div class="math-step">
      <div class="math-step-header">
        <span class="math-step-num">PASO 01</span>
        <div>
          <div class="math-step-title">Suma ponderada — z</div>
          <p class="math-step-desc">
            Cada característica del archivo (x) se multiplica por el peso (w) que la red aprendió
            durante el entrenamiento. Un peso positivo grande significa que esa característica
            <em>empuja hacia la clasificación sospechosa</em>. El bias (b) es un ajuste
            independiente que desplaza el umbral de decisión.
          </p>
        </div>
      </div>
      <div class="math-formula">
        <div class="f-line">
          <span class="f-lhs">z</span><span class="f-eq">=</span>
          ${symTerms} <span class="f-plus">+</span> <span class="f-lhs">b</span>
        </div>
        <div class="f-line">
          <span class="f-lhs">z</span><span class="f-eq">=</span>
          ${numTerms} <span class="f-plus">+</span>
          <span class="f-bias">${biasSign}${bias.toFixed(4)}</span>
        </div>
        <div class="f-line">
          <span class="f-lhs">z</span><span class="f-eq">=</span>
          ${contribTerms} <span class="f-plus">+</span>
          <span class="f-bias">${biasSign}${bias.toFixed(4)}</span>
        </div>
        <hr class="f-hr">
        <div class="f-line">
          <span class="f-lhs">z</span><span class="f-eq">=</span>
          <span class="f-result">${zSign}${z.toFixed(6)}</span>
        </div>
      </div>
      <div class="math-result-box">
        <span class="math-result-label">Resultado z =</span>
        <span class="math-result-val ${z >= 0 ? 'danger' : 'primary'}">${zSign}${z.toFixed(4)}</span>
        <span class="math-result-label">${z >= 0 ? '→ por encima del umbral' : '→ por debajo del umbral'}</span>
      </div>
    </div>

    <!-- PASO 2 -->
    <div class="math-step">
      <div class="math-step-header">
        <span class="math-step-num">PASO 02</span>
        <div>
          <div class="math-step-title">Función de activación — σ(z)</div>
          <p class="math-step-desc">
            La función sigmoide comprime cualquier valor real z en una probabilidad entre 0 y 1.
            Su <strong>punto de inflexión</strong> está exactamente en z = 0, donde σ(0) = 0.5 —
            ese es el umbral de decisión del perceptrón. Cuanto más alejado esté z de 0,
            más confiada es la predicción.
          </p>
        </div>
      </div>
      <div class="math-formula">
        <div class="f-line">
          <span class="f-sigma">σ(z)</span><span class="f-eq">=</span>
          <span class="f-sigma">1 / (1 + e<sup>−z</sup>)</span>
        </div>
        <div class="f-line">
          <span class="f-sigma">σ(${zSign}${z.toFixed(4)})</span><span class="f-eq">=</span>
          <span class="f-sigma">1 / (1 + e<sup>−(${zSign}${z.toFixed(4)})</sup>)</span>
        </div>
        <div class="f-line">
          <span class="f-sigma">σ(${zSign}${z.toFixed(4)})</span><span class="f-eq">=</span>
          <span class="f-sigma">1 / (1 + ${eNegZ})</span>
        </div>
        <div class="f-line">
          <span class="f-sigma">σ(${zSign}${z.toFixed(4)})</span><span class="f-eq">=</span>
          <span class="f-sigma">1 / ${denom}</span>
        </div>
        <hr class="f-hr">
        <div class="f-line">
          <span class="f-sigma">σ(z)</span><span class="f-eq">=</span>
          <span class="f-result">${confianza.toFixed(6)}</span>
          <span class="f-eq">=</span>
          <span class="f-result">${confPct}%</span>
        </div>
      </div>
      <div class="math-result-box">
        <span class="math-result-label">Probabilidad de malicioso =</span>
        <span class="math-result-val ${resultCol}">${confPct}%</span>
      </div>
    </div>

    <!-- PASO 3 -->
    <div class="math-step">
      <div class="math-step-header">
        <span class="math-step-num">PASO 03</span>
        <div>
          <div class="math-step-title">Decisión final</div>
          <p class="math-step-desc">
            El perceptrón compara σ(z) contra el umbral de 0.5 (equivalente a z = 0).
            Este umbral es el <strong>punto de inflexión de la sigmoide</strong>: donde la función
            cambia más rápidamente y la red tiene exactamente el 50% de confianza.
            Si σ(z) &gt; 0.5 el archivo es clasificado como sospechoso, si σ(z) ≤ 0.5 como legítimo.
          </p>
        </div>
      </div>
      <div class="math-formula">
        <div class="f-line">
          <span class="f-lhs">Regla</span><span class="f-eq">:</span>
          <span class="f-sigma">σ(z) &gt; 0.5</span>
          <span class="f-eq">→</span>
          <span style="color:var(--danger);font-weight:700">SOSPECHOSO</span>
        </div>
        <div class="f-line">
          <span class="f-lhs">Regla</span><span class="f-eq">:</span>
          <span class="f-sigma">σ(z) ≤ 0.5</span>
          <span class="f-eq">→</span>
          <span style="color:var(--primary);font-weight:700">LEGÍTIMO</span>
        </div>
        <hr class="f-hr">
        <div class="f-line">
          <span class="f-sigma">σ(z) = ${confPct}%</span>
          <span class="f-eq">${isSusp ? '>' : '≤'}</span>
          <span class="f-sigma">50%</span>
          <span class="f-eq">→</span>
          <span class="f-result" style="color:var(--${resultCol})">${resultStr}</span>
        </div>
      </div>
      <div class="math-result-box">
        <span class="math-result-label">Veredicto final:</span>
        <span class="math-result-val ${resultCol}">${resultStr}</span>
        <span class="math-result-label">con ${confPct}% de confianza</span>
      </div>
    </div>

  </div>
  `;
}

/* ══ Gauge ═══════════════════════════════════════════════ */
function drawGauge(confidence) {
  const ns = 'http://www.w3.org/2000/svg';
  const cx = 110, cy = 110, r = 88, rn = 72;
  const el = (tag, a = {}) => {
    const e = document.createElementNS(ns, tag);
    Object.entries(a).forEach(([k, v]) => e.setAttribute(k, v));
    return e;
  };
  const txt = (s, a) => { const e = el('text', a); e.textContent = s; return e; };
  const pt  = (t, rad) => ({
    x: cx + rad * Math.cos(Math.PI * (1 - t)),
    y: cy - rad * Math.sin(Math.PI * (1 - t)),
  });
  const arcD = (t1, t2, rad) => {
    const p1 = pt(t1, rad), p2 = pt(t2, rad);
    return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${rad} ${rad} 0 ${(t2-t1)>.5?1:0} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  };

  gaugeSvg.innerHTML = '';
  gaugeSvg.appendChild(el('path', { d: arcD(0,1,r), fill:'none', stroke:'#1a2438', 'stroke-width':13, 'stroke-linecap':'round' }));
  [[0,.33,'#00d4aa'],[.33,.67,'#ffaa00'],[.67,1,'#ff4040']].forEach(([a,b,c]) => {
    gaugeSvg.appendChild(el('path', { d:arcD(a,b,r), fill:'none', stroke:c, 'stroke-width':13, opacity:.18, 'stroke-linecap':'butt' }));
  });
  if (confidence > 0.005) {
    const col = confidence < .33 ? '#00d4aa' : confidence < .67 ? '#ffaa00' : '#ff4040';
    gaugeSvg.appendChild(el('path', { d:arcD(0,confidence,r), fill:'none', stroke:col, 'stroke-width':13, 'stroke-linecap':'round' }));
  }
  [0,.25,.5,.75,1].forEach(t => {
    const p1=pt(t,r+5), p2=pt(t,r+12), pl=pt(t,r+22);
    gaugeSvg.appendChild(el('line', { x1:p1.x,y1:p1.y,x2:p2.x,y2:p2.y, stroke:'#1a2438','stroke-width':1.5 }));
    gaugeSvg.appendChild(txt(`${(t*100).toFixed(0)}%`, { x:pl.x,y:pl.y+3,'text-anchor':'middle',fill:'#4f627a','font-size':'8.5','font-family':'monospace' }));
  });
  const np = pt(confidence, rn);
  gaugeSvg.appendChild(el('line', { x1:cx,y1:cy,x2:np.x.toFixed(2),y2:np.y.toFixed(2), stroke:'#dde4f0','stroke-width':2.5,'stroke-linecap':'round' }));
  gaugeSvg.appendChild(el('circle', { cx,cy,r:7, fill:'#0c1018',stroke:'#dde4f0','stroke-width':2 }));

  const col = confidence < .33 ? '#00d4aa' : confidence < .67 ? '#ffaa00' : '#ff4040';
  confidenceValue.textContent = `${(confidence*100).toFixed(1)}%`;
  confidenceValue.style.color = col;
}

/* ══ Verdict ═════════════════════════════════════════════ */
function renderVerdict(data) {
  const ok = data.resultado === 'legitimo';
  verdictIcon.innerHTML   = icon(ok ? 'shield-ok' : 'shield-bad', 48);
  verdictIcon.style.color = ok ? 'var(--primary)' : 'var(--danger)';
  verdictText.textContent = ok ? 'LEGÍTIMO' : 'SOSPECHOSO';
  verdictText.className   = `verdict-text ${data.resultado}`;
  verdictDesc.textContent = ok
    ? 'El archivo no presenta características maliciosas conocidas.'
    : 'El archivo tiene indicadores de comportamiento sospechoso.';
  verdictFile.textContent = data.archivo;
}

/* ══ History ═════════════════════════════════════════════ */
function addToHistory(data) {
  scanCount++;
  historyCard.hidden = false;
  const ok  = data.resultado === 'legitimo';
  const f   = data.features;
  const col = ok ? 'var(--primary)' : 'var(--danger)';
  const tr  = document.createElement('tr');
  tr.innerHTML = `
    <td>${scanCount}</td>
    <td title="${data.archivo}">${data.archivo}</td>
    <td>${f[0].valor.toFixed(4)}</td>
    <td>${f[1].valor.toFixed(4)}</td>
    <td>${f[2].valor === 1 ? 'Sí' : 'No'}</td>
    <td>${f[3].valor.toFixed(4)}</td>
    <td>${data.z.toFixed(4)}</td>
    <td style="color:${col}">${(data.confianza*100).toFixed(1)}%</td>
    <td><span class="badge ${data.resultado}">${ok ? 'Legítimo' : 'Sospechoso'}</span></td>
  `;
  historyBody.insertBefore(tr, historyBody.firstChild);
}
