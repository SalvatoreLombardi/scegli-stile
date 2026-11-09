import { PALETTE, FONT, BOTTONI, RIEMPIMENTO, CARD, ANGOLI_CARD } from './dati.js'
import { ATTIVITA, TIPI, BRIEF } from './attivita.js'
import { LINGUE, lingueCliente } from './lingue.js'
import { trova, temaTesto, colorePrincipale } from './utils.js'
import { urlFoto } from './Foto.jsx'

const INK = [18, 32, 29]
const TENUE = [93, 108, 104]
const TEAL = [24, 179, 148]
const LINEA = [222, 230, 227]

// I font standard del PDF non hanno caratteri come cinese o emoji: li sostituisco per non rovinare il testo.
const pulisci = (s) => String(s ?? '').replace(/[^ -ÿ–—‘’“”•€\n]/g, '?')
const rgbDa = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

// Carica la foto e la ritaglia (cover) nelle proporzioni della fascia in alto, restituendo un JPEG pronto.
async function fotoRitagliata(att, rapporto) {
  try {
    const r = await fetch(urlFoto(att, 'hero'))
    if (!r.ok) return null
    const url = URL.createObjectURL(await r.blob())
    const img = await new Promise((ok, ko) => {
      const i = new Image()
      i.onload = () => ok(i)
      i.onerror = ko
      i.src = url
    })
    URL.revokeObjectURL(url)
    const cw = 1400, ch = Math.round(cw / rapporto)
    const c = document.createElement('canvas')
    c.width = cw
    c.height = ch
    const sc = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
    const w = img.naturalWidth * sc, h = img.naturalHeight * sc
    c.getContext('2d').drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
    return c.toDataURL('image/jpeg', 0.82)
  } catch {
    return null
  }
}

export async function creaPdf(c) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210, H = 297, M = 18, LARG = W - M * 2
  const att = trova(ATTIVITA, c.attivita)
  const tipo = trova(TIPI, c.tipo)
  const s = c.stile
  const pal = trova(PALETTE, s.palette)
  const font = trova(FONT, s.font)
  let y = 0

  // ---- Intestazione con foto dell'attività ----
  const ALT = 62
  doc.setFillColor(...INK)
  doc.rect(0, 0, W, ALT, 'F')
  const img = await fotoRitagliata(att.id, W / ALT)
  if (img) {
    doc.addImage(img, 'JPEG', 0, 0, W, ALT)
    doc.setGState(new doc.GState({ opacity: 0.55 }))
    doc.setFillColor(8, 18, 16)
    doc.rect(0, 0, W, ALT, 'F')
    doc.setGState(new doc.GState({ opacity: 1 }))
  }
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(pulisci(`${att.nome.toUpperCase()}  ·  ${tipo.nome.toUpperCase()}`), M, 34, { charSpace: 0.6 })
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(26)
  const titolo = doc.splitTextToSize(pulisci(c.nome), LARG)
  doc.text(titolo.slice(0, 2), M, 45)
  y = ALT + 14

  const nuovaPagina = () => { doc.addPage(); y = M + 4 }
  const serve = (h) => { if (y + h > H - 22) nuovaPagina() }

  const sezione = (nome) => {
    serve(18)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(...TEAL)
    doc.text(nome.toUpperCase(), M, y, { charSpace: 0.8 })
    y += 2.5
    doc.setDrawColor(...LINEA)
    doc.setLineWidth(0.3)
    doc.line(M, y, W - M, y)
    y += 6.5
  }
  const riga = (k, v) => {
    const righe = doc.splitTextToSize(pulisci(v) || '-', LARG - 46)
    serve(righe.length * 5.2 + 3)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.setTextColor(...TENUE)
    doc.text(pulisci(k), M, y)
    doc.setTextColor(...INK)
    doc.setFont('helvetica', 'bold')
    doc.text(righe, M + 46, y)
    y += righe.length * 5.2 + 2.2
  }

  // ---- Cliente ----
  sezione('Cliente')
  riga('Nome attività', c.nome)
  if (c.referente) riga('Referente', c.referente)
  riga('Tipo di attività', att.nome)
  riga('Progetto', `${tipo.nome} - ${tipo.desc}`)
  riga('Creato il', new Date(c.creato).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }))
  y += 4

  // ---- Lingue ----
  sezione('Lingue del sito')
  const ling = lingueCliente(c)
  const principali = ling.filter((x) => x.principale).map((x) => LINGUE.find((l) => l.id === x.id).nome)
  const altre = ling.filter((x) => !x.principale).map((x) => LINGUE.find((l) => l.id === x.id).nome)
  riga('Principali', principali.join(', '))
  if (altre.length) riga('Aggiuntive', altre.join(', '))
  y += 4

  // ---- Stile ----
  sezione('Stile scelto')
  serve(30)
  const campioni = [[colorePrincipale(s, pal), s.coloreMarchio ? 'Del cliente' : 'Principale'], [pal.accent, 'Secondario'], [pal.bg, 'Sfondo'], [pal.surface, 'Card'], [pal.text, 'Testo']]
  const lato = 24, gap = 5
  campioni.forEach(([hex, nome], i) => {
    const x = M + i * (lato + gap)
    doc.setFillColor(...rgbDa(hex))
    doc.setDrawColor(...LINEA)
    doc.setLineWidth(0.3)
    doc.roundedRect(x, y, lato, 16, 2.5, 2.5, 'FD')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(...INK)
    doc.text(nome, x, y + 21)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...TENUE)
    doc.text(hex.toUpperCase(), x, y + 25)
  })
  y += 33
  riga('Palette', pal.nome)
  if (s.coloreMarchio) riga('Colore del cliente', s.coloreMarchio.toUpperCase())
  riga('Tema del sito', temaTesto(s))
  riga('Font', `Titoli ${font.titoli}, testi ${font.testi}`)
  riga('Bottoni', `${trova(BOTTONI, s.bottone).nome}, ${trova(RIEMPIMENTO, s.riempimento).nome.toLowerCase()}`)
  riga('Card', `${trova(CARD, s.card).nome}, angoli ${trova(ANGOLI_CARD, s.angoli).nome.toLowerCase()}`)
  y += 4

  // ---- Brief ----
  const domande = (BRIEF[c.tipo] || []).filter((d) => c.brief?.[d.k] && c.brief[d.k].length)
  sezione('Brief')
  if (domande.length === 0) {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(...TENUE)
    doc.text('Nessuna risposta compilata.', M, y)
    y += 9
  } else {
    domande.forEach((d) => riga(d.q, Array.isArray(c.brief[d.k]) ? c.brief[d.k].join(', ') : c.brief[d.k]))
    y += 4
  }

  // ---- Note ----
  if (c.note && c.note.trim()) {
    sezione('Note')
    const righe = doc.splitTextToSize(pulisci(c.note), LARG)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(...INK)
    righe.forEach((r) => { serve(6); doc.text(r, M, y); y += 5.2 })
  }

  // ---- Piè di pagina ----
  const n = doc.getNumberOfPages()
  for (let p = 1; p <= n; p++) {
    doc.setPage(p)
    doc.setDrawColor(...LINEA)
    doc.setLineWidth(0.3)
    doc.line(M, H - 16, W - M, H - 16)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...TENUE)
    doc.text('Scheda cliente - salvatorelombardi.com', M, H - 10.5)
    doc.text(`${p} / ${n}`, W - M, H - 10.5, { align: 'right' })
  }

  const nomeFile = 'scheda-' + c.nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.pdf'
  return { blob: doc.output('blob'), nomeFile }
}

// Su iPad apre il foglio di condivisione (Salva su File, AirDrop, Mail); altrove scarica il file.
export async function scaricaPdf(c) {
  const { blob, nomeFile } = await creaPdf(c)
  const file = new File([blob], nomeFile, { type: 'application/pdf' })
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: nomeFile })
      return
    } catch (e) {
      if (e && e.name === 'AbortError') return
    }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nomeFile
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}
