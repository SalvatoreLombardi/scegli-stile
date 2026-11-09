import { rgb, luce, mix, contrasto } from './colori.js'
import { lingueCliente, lingueNomi } from './lingue.js'
import { PALETTE, TEMA_SCURO, TEMA_CHIARO, FONT, BOTTONI, CARD, ANGOLI_CARD, RIEMPIMENTO } from './dati.js'

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
  const primary = versoScuro ? visibile(p.primary, base.bg, [p.accent]) : versoChiaro ? scurisci(p.primary, base.bg) : p.primary
  const accent = versoScuro ? visibile(p.accent, base.bg, [p.primary]) : versoChiaro ? scurisci(p.accent, base.bg) : p.accent
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
  }
}

export function riepilogo(s) {
  const p = trova(PALETTE, s.palette)
  const f = trova(FONT, s.font)
  return [
    'Il tuo stile scelto',
    `Colori: ${p.nome} (principale ${p.primary}, secondario ${p.accent})`,
    `Tema: ${s.scuro ? 'scuro' : 'chiaro'}`,
    `Font: titoli ${f.titoli}, testi ${f.testi}`,
    `Bottoni: ${trova(BOTTONI, s.bottone).nome}, ${trova(RIEMPIMENTO, s.riempimento).nome.toLowerCase()}`,
    `Card: ${trova(CARD, s.card).nome}, angoli ${trova(ANGOLI_CARD, s.angoli).nome.toLowerCase()}`,
  ].join('\n')
}

export function riepilogoCliente(c, ATTIVITA, TIPI, BRIEF) {
  const att = trova(ATTIVITA, c.attivita)
  const tipo = trova(TIPI, c.tipo)
  const righe = [`Cliente: ${c.nome}${c.referente ? ` (${c.referente})` : ''}`, `Attività: ${att.nome}`, `Progetto: ${tipo.nome}`, `Lingue: ${lingueNomi(lingueCliente(c))}`, '', riepilogo(c.stile)]
  const domande = (BRIEF[c.tipo] || []).filter((d) => c.brief?.[d.k] && c.brief[d.k].length)
  if (domande.length) {
    righe.push('', 'Brief')
    domande.forEach((d) => righe.push(`${d.q} ${Array.isArray(c.brief[d.k]) ? c.brief[d.k].join(', ') : c.brief[d.k]}`))
  }
  if (c.note) righe.push('', `Note: ${c.note}`)
  return righe.join('\n')
}
