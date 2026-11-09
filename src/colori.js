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
