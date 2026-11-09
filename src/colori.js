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
  const s2 = Math.min(1, 240 / Math.max(nw, nh))
  const t = document.createElement('canvas'); t.width = Math.max(1, Math.round(nw * s2)); t.height = Math.max(1, Math.round(nh * s2))
  t.getContext('2d').drawImage(sorgente, 0, 0, t.width, t.height)
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
