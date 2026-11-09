// Utilità colore condivise: luminosità, contrasto (WCAG) e miscela.
export const rgb = (hex) => {
  const h = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
}
export const hex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
export const mix = (a, b, t) => {
  const x = rgb(a), y = rgb(b)
  return hex(x.map((v, i) => v + (y[i] - v) * t))
}
export const luce = (h) => {
  const [r, g, b] = rgb(h).map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
export const contrasto = (a, b) => {
  const x = luce(a), y = luce(b)
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

// Dalle 4 tinte di base ricava card (surface) e testo tenue (muted) con contrasto AA garantito.
export function palette([id, nome, primary, accent, bg, text], dark = false) {
  const surface = dark ? mix(bg, '#ffffff', 0.07) : mix(bg, '#ffffff', 0.65)
  let t = 0.42
  let muted = mix(text, bg, t)
  while ((contrasto(muted, bg) < 4.6 || contrasto(muted, surface) < 4.6) && t > 0) {
    t = Math.max(0, t - 0.05)
    muted = mix(text, bg, t)
  }
  return { id, nome, primary, accent, bg, surface, text, muted, ...(dark ? { dark: true } : {}) }
}

// Trova i colori principali di un'immagine (per esempio il logo di un cliente).
// Ignora sfondo bianco e trasparenze, preferisce i colori vivaci a quelli spenti, scarta i colori troppo simili.
export function coloriDaPixel(dati, larghezza, altezza, max = 6) {
  const gruppi = new Map()
  let validi = 0
  for (let i = 0; i < dati.length; i += 4) {
    const r = dati[i], g = dati[i + 1], b = dati[i + 2], a = dati[i + 3]
    if (a < 200) continue
    if (r > 235 && g > 235 && b > 235) continue // bianco: di solito è lo sfondo
    validi++
    const chiave = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4)
    const x = gruppi.get(chiave) || { n: 0, r: 0, g: 0, b: 0 }
    x.n++; x.r += r; x.g += g; x.b += b
    gruppi.set(chiave, x)
  }
  if (!validi) return []
  const candidati = [...gruppi.values()]
    .filter((x) => x.n >= Math.max(3, validi * 0.004))
    .map((x) => {
      const r = x.r / x.n, g = x.g / x.n, b = x.b / x.n
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b)
      const saturazione = mx === 0 ? 0 : (mx - mn) / mx
      return { rgb: [r, g, b], punteggio: x.n * (0.3 + saturazione * 1.5) }
    })
    .sort((p, q) => q.punteggio - p.punteggio)
  // Ai bordi delle forme i colori si mescolano con lo sfondo: sono sfumature di un colore già trovato, non colori nuovi.
  const distanza = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
  const eSfumatura = (c, base) => {
    for (let t = 0.1; t <= 0.9; t += 0.1) {
      const chiaro = base.map((v) => v + (255 - v) * t)
      const scuro = base.map((v) => v * (1 - t))
      if (distanza(c, chiaro) < 30 || distanza(c, scuro) < 30) return true
    }
    return false
  }
  const scelti = []
  for (const c of candidati) {
    const vicino = scelti.some((s) => distanza(s, c.rgb) < 70 || eSfumatura(c.rgb, s))
    if (!vicino) scelti.push(c.rgb)
    if (scelti.length >= max) break
  }
  return scelti.map(hex)
}

// Analizza un'immagine già caricata (Image o ImageBitmap): colori principali e miniatura del logo.
function analizza(sorgente, nw, nh) {
  const scala = Math.min(1, 96 / Math.max(nw, nh))
  const w = Math.max(1, Math.round(nw * scala)), h = Math.max(1, Math.round(nh * scala))
  const c = document.createElement('canvas'); c.width = w; c.height = h
  const ctx = c.getContext('2d')
  ctx.drawImage(sorgente, 0, 0, w, h)
  const colori = coloriDaPixel(ctx.getImageData(0, 0, w, h).data, w, h)
  const s2 = Math.min(1, 480 / Math.max(nw, nh))
  const t = document.createElement('canvas'); t.width = Math.max(1, Math.round(nw * s2)); t.height = Math.max(1, Math.round(nh * s2))
  const tc = t.getContext('2d')
  tc.drawImage(sorgente, 0, 0, t.width, t.height)
  // Toglie i margini vuoti (bianchi o trasparenti) attorno al logo: così il logo vero riempie lo spazio.
  try {
    const px = tc.getImageData(0, 0, t.width, t.height).data
    let x0 = t.width, y0 = t.height, x1 = -1, y1 = -1
    for (let y = 0; y < t.height; y++) {
      for (let x = 0; x < t.width; x++) {
        const i = (y * t.width + x) * 4
        if (px[i + 3] > 25 && !(px[i] > 243 && px[i + 1] > 243 && px[i + 2] > 243)) {
          if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y
        }
      }
    }
    if (x1 - x0 > 8 && y1 - y0 > 8) {
      const m = Math.round(Math.max(t.width, t.height) * 0.02) // piccolo respiro
      x0 = Math.max(0, x0 - m); y0 = Math.max(0, y0 - m); x1 = Math.min(t.width - 1, x1 + m); y1 = Math.min(t.height - 1, y1 + m)
      const r = document.createElement('canvas'); r.width = x1 - x0 + 1; r.height = y1 - y0 + 1
      const rc = r.getContext('2d')
      rc.drawImage(t, x0, y0, r.width, r.height, 0, 0, r.width, r.height)
      // Se il logo ha lo sfondo bianco, lo rende trasparente (mantenendo i bordi morbidi): si vede bene su qualsiasi colore.
      const ang = [[0, 0], [r.width - 1, 0], [0, r.height - 1], [r.width - 1, r.height - 1]].map(([x, y]) => rc.getImageData(x, y, 1, 1).data)
      if (ang.every((c) => c[3] > 240 && c[0] > 240 && c[1] > 240 && c[2] > 240)) {
        const im = rc.getImageData(0, 0, r.width, r.height); const d = im.data
        for (let i = 0; i < d.length; i += 4) {
          const a = 255 - Math.min(d[i], d[i + 1], d[i + 2])
          if (a < 8) { d[i + 3] = 0; continue }
          for (let k = 0; k < 3; k++) d[i + k] = Math.max(0, Math.min(255, 255 - ((255 - d[i + k]) * 255) / a))
          d[i + 3] = Math.min(d[i + 3], a)
        }
        rc.putImageData(im, 0, 0)
      }
      return { colori, anteprima: r.toDataURL('image/png') }
    }
  } catch { /* se non si riesce a ritagliare, resta l'immagine intera */ }
  return { colori, anteprima: t.toDataURL('image/png') }
}

// Legge i colori da un indirizzo (logo già salvato).
export async function coloriDaUrl(url) {
  const img = await new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ko(new Error('immagine non leggibile')); i.src = url })
  return analizza(img, img.naturalWidth, img.naturalHeight)
}

// Legge i colori da una foto scelta. Se il primo metodo non riesce (formato strano), prova il secondo.
export async function coloriDaFile(file) {
  const url = URL.createObjectURL(file)
  try {
    return await coloriDaUrl(url)
  } catch (primo) {
    if (typeof createImageBitmap === 'function') {
      const bmp = await createImageBitmap(file)
      return analizza(bmp, bmp.width, bmp.height)
    }
    throw primo
  } finally {
    URL.revokeObjectURL(url)
  }
}

// ---------- Dal logo: palette e font più vicini ----------
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])

// Sceglie la palette (chiara) i cui colori sono più vicini a quelli del logo.
export function paletteDaLogo(colori, palette) {
  if (!colori.length) return null
  const c0 = rgb(colori[0]), c1 = rgb(colori[1] || colori[0])
  let migliore = null, punti = Infinity
  for (const p of palette) {
    if (p.dark) continue
    const d = dist(c0, rgb(p.primary)) + 0.7 * dist(c1, rgb(p.accent))
    if (d < punti) { punti = d; migliore = p }
  }
  return migliore
}

// ---------- Somiglianza di carattere ----------
// Dal logo e dal nome del cliente scritto in ogni font si misurano caratteristiche della forma (spessore dei tratti,
// contrasto tra tratti verticali e orizzontali, quanto inchiostro c'è, numero di tratti, proporzioni) e si confrontano.
// Non è un riconoscimento esatto: dà i font più vicini per "carattere", da scegliere a occhio.
const ALT = 56

function caratteristiche(mask, w, h) {
  let ink = 0
  const orizz = [], vert = []
  let transizioni = 0, righe = 0
  for (let y = 0; y < h; y++) {
    let run = 0, tr = 0
    for (let x = 0; x < w; x++) {
      if (mask[y * w + x]) run++
      else if (run) { orizz.push(run); run = 0; tr++ }
    }
    if (run) { orizz.push(run); tr++ }
    if (tr) { transizioni += tr; righe++ }
  }
  for (let x = 0; x < w; x++) {
    let run = 0
    for (let y = 0; y < h; y++) {
      if (mask[y * w + x]) run++
      else if (run) { vert.push(run); run = 0 }
    }
    if (run) vert.push(run)
  }
  for (let i = 0; i < w * h; i++) if (mask[i]) ink++
  const med = (a) => { if (!a.length) return 0; const b = [...a].sort((p, q) => p - q); return b[Math.floor(b.length / 2)] }
  const media = (a) => (a.length ? a.reduce((p, q) => p + q, 0) / a.length : 0)
  const mh = med(orizz) / h, mv = med(vert) / h
  return [
    ink / (w * h),            // quanto inchiostro
    mh,                        // spessore dei tratti verticali (steli)
    media(orizz) / h,
    mv,                        // spessore dei tratti orizzontali
    media(vert) / h,
    mv / Math.max(mh, 1e-3),   // contrasto (alto = grazie e tratti sottili)
    righe ? transizioni / righe : 0, // quanti tratti si incrociano in una riga
    Math.log(w / h),           // proporzioni
  ]
}

// Maschera di un'immagine scalata a altezza fissa, ritagliata sul contenuto.
function mascheraDa(ctx, cw, ch, soglia) {
  const d = ctx.getImageData(0, 0, cw, ch).data
  let x0 = cw, y0 = ch, x1 = -1, y1 = -1
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
    const i = (y * cw + x) * 4
    if (d[i] < soglia || d[i + 1] < soglia || d[i + 2] < soglia) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y }
  }
  if (x1 - x0 < 4 || y1 - y0 < 4) return null
  return { x0, y0, w: x1 - x0 + 1, h: y1 - y0 + 1 }
}

export async function fontSimili(urlLogo, testi, fonts, avanza) {
  const img = await new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ko(new Error('logo non leggibile')); i.src = urlLogo })
  // logo su fondo bianco
  const L = 640
  const sl = Math.min(1, L / Math.max(img.naturalWidth, img.naturalHeight))
  const lc = document.createElement('canvas'); lc.width = Math.max(8, Math.round(img.naturalWidth * sl)); lc.height = Math.max(8, Math.round(img.naturalHeight * sl))
  const lx = lc.getContext('2d', { willReadFrequently: true })
  lx.fillStyle = '#fff'; lx.fillRect(0, 0, lc.width, lc.height); lx.drawImage(img, 0, 0, lc.width, lc.height)
  const bb = mascheraDa(lx, lc.width, lc.height, 200)
  if (!bb) return []
  const lw = Math.min(520, Math.max(8, Math.round((bb.w * ALT) / bb.h)))
  const sc = document.createElement('canvas'); sc.width = lw; sc.height = ALT
  const sx = sc.getContext('2d', { willReadFrequently: true })
  const maschera = (soglia) => {
    const m = sx.getImageData(0, 0, lw, ALT).data
    const out = new Uint8Array(lw * ALT)
    for (let i = 0; i < lw * ALT; i++) if (m[i * 4] < soglia || m[i * 4 + 1] < soglia || m[i * 4 + 2] < soglia) out[i] = 1
    return out
  }
  sx.fillStyle = '#fff'; sx.fillRect(0, 0, lw, ALT)
  sx.drawImage(lc, bb.x0, bb.y0, bb.w, bb.h, 0, 0, lw, ALT)
  const caratLogo = caratteristiche(maschera(200), lw, ALT)

  const gc = document.createElement('canvas'); gc.width = 760; gc.height = 260
  const gx = gc.getContext('2d', { willReadFrequently: true })
  const gruppi = []
  for (let n = 0; n < fonts.length; n++) {
    const f = fonts[n]
    try { await document.fonts.load(`${f.pesoTitoli} 64px "${f.titoli}"`, testi[0]) } catch { /* si prova comunque */ }
    let meglio = null
    for (const t of testi) {
      gx.fillStyle = '#fff'; gx.fillRect(0, 0, gc.width, gc.height)
      gx.fillStyle = '#000'; gx.textBaseline = 'alphabetic'
      gx.font = `${f.pesoTitoli} 100px "${f.titoli}", serif`
      const larg = gx.measureText(t).width
      const k = Math.min(1.5, 700 / Math.max(1, larg))
      gx.font = `${f.pesoTitoli} ${Math.round(100 * k)}px "${f.titoli}", serif`
      gx.fillText(t, 24, 160)
      const b2 = mascheraDa(gx, gc.width, gc.height, 150)
      if (!b2) continue
      const fw = Math.min(520, Math.max(8, Math.round((b2.w * ALT) / b2.h)))
      const c2 = document.createElement('canvas'); c2.width = fw; c2.height = ALT
      const x2 = c2.getContext('2d', { willReadFrequently: true })
      x2.fillStyle = '#fff'; x2.fillRect(0, 0, fw, ALT)
      x2.drawImage(gc, b2.x0, b2.y0, b2.w, b2.h, 0, 0, fw, ALT)
      const m = x2.getImageData(0, 0, fw, ALT).data
      const mk = new Uint8Array(fw * ALT)
      for (let i = 0; i < fw * ALT; i++) if (m[i * 4] < 150) mk[i] = 1
      const c = caratteristiche(mk, fw, ALT)
      if (!meglio || Math.abs(c[7] - caratLogo[7]) < Math.abs(meglio[7] - caratLogo[7])) meglio = c // la scrittura (nome o NOME) con proporzioni più vicine
    }
    if (meglio) gruppi.push({ id: f.id, c: meglio })
    if (n % 6 === 5) { if (avanza) avanza(n + 1, fonts.length); await new Promise((r) => setTimeout(r, 0)) }
  }
  // Ogni caratteristica pesa in base alla sua variabilità tra i font (altrimenti conterebbero solo quelle con numeri grandi).
  const k = caratLogo.length
  const sd = []
  for (let j = 0; j < k; j++) {
    const v = gruppi.map((g) => g.c[j]); const mu = v.reduce((p, q) => p + q, 0) / v.length
    sd.push(Math.sqrt(v.reduce((p, q) => p + (q - mu) * (q - mu), 0) / v.length) || 1)
  }
  const peso = [1, 1.2, 0.8, 1.2, 0.8, 1.2, 0.8, 0.6]
  return gruppi
    .map((g) => ({ id: g.id, punti: -g.c.reduce((t, v, j) => t + peso[j] * Math.abs(v - caratLogo[j]) / sd[j], 0) }))
    .sort((a, b) => b.punti - a.punti)
}
