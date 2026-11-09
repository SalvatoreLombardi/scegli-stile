import { rgb, luce, mix, contrasto } from './colori.js'
import { lingueCliente, lingueNomi } from './lingue.js'
import { NAV_STILI, NAV_EFFETTI, CATALOGO, LOGO_DIM, PALETTE, TEMA_SCURO, TEMA_CHIARO, FONT, BOTTONI, CARD, ANGOLI_CARD, RIEMPIMENTO } from './dati.js'

export const rgba = (hex, a) => `rgba(${rgb(hex).join(',')},${a})`

const rapporto = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)

// In tema scuro un colore troppo scuro sparirebbe: usa l'alternativa più leggibile.
const visibile = (c, sfondo, alt) => [c, ...alt].find((x) => rapporto(luce(x), luce(sfondo)) >= 3) || '#f2f2f2'

// Scurisce un colore (es. un neon) finché si legge bene sullo sfondo chiaro.
const scurisci = (c, sfondo) => {
  let x = c
  for (let i = 0; i < 14 && contrasto(x, sfondo) < 3; i++) x = mix(x, '#000000', 0.12)
  return x
}

// Sceglie tra bianco e scuro il testo che si legge meglio sullo sfondo dato.
export const testoSu = (hex) => {
  const l = luce(hex)
  return rapporto(l, luce('#ffffff')) >= rapporto(l, luce('#111418')) ? '#ffffff' : '#111418'
}

// Cosa ha scelto il cliente per il tema del sito: un solo tema, oppure chiaro e scuro con interruttore.
export const temaChiave = (s) => (s.temaModo === 'entrambi' ? 'entrambi' : s.scuro ? 'scuro' : 'chiaro')
export const temaTesto = (s) => ({
  chiaro: 'Solo chiaro',
  scuro: 'Solo scuro',
  entrambi: 'Chiaro e scuro (con interruttore per il visitatore)',
})[temaChiave(s)]

// Colore principale scelto per il cliente (il suo, se l'ha indicato; altrimenti quello della palette).
export const colorePrincipale = (s, pal) => (/^#[0-9a-fA-F]{6}$/.test(s.coloreMarchio || '') ? s.coloreMarchio : pal.primary)

// Descrizione del menu scelto (barra in alto, effetto, e per gli e-commerce il catalogo).
export const menuTesto = (s, tipo) => {
  if (tipo === 'webapp') return 'Barra laterale (web app)'
  const st = NAV_STILI.find((x) => x.id === (s.navStile || 'classica')) || NAV_STILI[0]
  const ef = NAV_EFFETTI.find((x) => x.id === (s.navEffetto || 'nessuno')) || NAV_EFFETTI[0]
  let t = `${st.nome}, scorrimento: ${ef.nome.toLowerCase()}`
  if (tipo === 'ecommerce') t += `; catalogo: ${(CATALOGO.find((x) => x.id === (s.catalogo || 'sopra')) || CATALOGO[0]).nome.toLowerCase()}`
  return t
}

export const trova = (lista, id) => lista.find((x) => x.id === id) || lista[0]

// Trasforma le scelte in variabili CSS per l'anteprima.
export function variabili(s) {
  const p = trova(PALETTE, s.palette)
  const f = trova(FONT, s.font)
  const b = trova(BOTTONI, s.bottone)
  const a = trova(ANGOLI_CARD, s.angoli)
  // Il pulsante tema vale per tutte le palette: una chiara può diventare scura e una scura (Tecnologico) chiara.
  const scuro = !!s.scuro
  const versoScuro = scuro && !p.dark
  const versoChiaro = !scuro && p.dark
  const base = versoScuro ? { ...p, ...TEMA_SCURO } : versoChiaro ? { ...p, ...TEMA_CHIARO } : p
  const marchio = /^#[0-9a-fA-F]{6}$/.test(s.coloreMarchio || '') ? s.coloreMarchio : null // colore del logo del cliente
  const principale = marchio || p.primary
  const primary = versoScuro ? visibile(principale, base.bg, [p.accent]) : versoChiaro ? scurisci(principale, base.bg) : principale
  const accentoMarchio = /^#[0-9a-fA-F]{6}$/.test(s.coloreAccento || '') ? s.coloreAccento : null // secondo colore del logo
  const accentoBase = accentoMarchio || p.accent
  const accent = versoScuro ? visibile(accentoBase, base.bg, [principale]) : versoChiaro ? scurisci(accentoBase, base.bg) : accentoBase
  return {
    '--bg': base.bg, '--surface': base.surface, '--text': base.text, '--muted': base.muted,
    '--primary': primary, '--on-primary': testoSu(primary),
    '--accent': accent, '--on-accent': testoSu(accent),
    '--primary-soft': rgba(primary, scuro ? 0.22 : 0.12),
    '--line': scuro ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.1)',
    '--shadow': scuro ? 'rgba(0,0,0,.5)' : 'rgba(15,23,42,.14)',
    '--font-titoli': `'${f.titoli}', Georgia, serif`, '--peso-titoli': f.pesoTitoli, '--peso-testi': f.pesoTesti,
    '--font-testi': `'${f.testi}', -apple-system, sans-serif`,
    '--r-btn': b.raggio, '--r-card': a.raggio,
    '--logo-h': ((LOGO_DIM.find((x) => x.id === s.logoDim) || LOGO_DIM[1]).px) + 'px',
  }
}

export function riepilogo(s) {
  const p = trova(PALETTE, s.palette)
  const f = trova(FONT, s.font)
  return [
    'Il tuo stile scelto',
    `Colori: ${p.nome} (principale ${p.primary}, secondario ${p.accent})`,
    `Tema: ${temaTesto(s)}`,
    ...(s.coloreMarchio ? [`Colore del cliente: ${s.coloreMarchio.toUpperCase()}`] : []),
    `Font: titoli ${f.titoli}, testi ${f.testi}`,
    `Bottoni: ${trova(BOTTONI, s.bottone).nome}, ${trova(RIEMPIMENTO, s.riempimento).nome.toLowerCase()}`,
    `Card: ${trova(CARD, s.card).nome}, angoli ${trova(ANGOLI_CARD, s.angoli).nome.toLowerCase()}`,
  ].join('\n')
}

export function riepilogoCliente(c, ATTIVITA, TIPI, BRIEF) {
  const att = trova(ATTIVITA, c.attivita)
  const tipo = trova(TIPI, c.tipo)
  const righe = [`Cliente: ${c.nome}${c.referente ? ` (${c.referente})` : ''}`, `Attività: ${att.nome}`, `Progetto: ${tipo.nome}`, `Menu: ${menuTesto(c.stile, c.tipo)}`, `Lingue: ${lingueNomi(lingueCliente(c))}`, '', riepilogo(c.stile)]
  const domande = (BRIEF[c.tipo] || []).filter((d) => c.brief?.[d.k] && c.brief[d.k].length)
  if (domande.length) {
    righe.push('', 'Brief')
    domande.forEach((d) => righe.push(`${d.q} ${Array.isArray(c.brief[d.k]) ? c.brief[d.k].join(', ') : c.brief[d.k]}`))
  }
  if (c.note) righe.push('', `Note: ${c.note}`)
  return righe.join('\n')
}
