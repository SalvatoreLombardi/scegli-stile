// Palette divise per gruppo. primary = colore principale, accent = secondario;
// bg/surface/text/muted = sfondo, card, testo, testo tenue. dark = palette già scura.
// Direzione ricavata dalla ricerca del 08/11/2026: base neutra calma + un accento espressivo, terre e verdi naturali,
// lusso = colore profondo + metallo (oro, bronzo, champagne), neon solo come accento su fondi scuri.
// Fonti: Pantone Cloud Dancer 2026 (#F0EEE9), daveyandkrista.com/2026-brand-color-trends, madegooddesigns.com (luxury/earth),
// loungelizard.com/blog/web-design-color-trends, gopickcolors.com/blog/2026-web-color-trends-predictions, colorswall.com.
// Valori adattati e verificati per il contrasto del testo (WCAG AA).
import { palette as gen } from './colori.js'

// Altre palette di ogni gruppo: [id, nome, primary, accent, bg, text]; surface e muted sono calcolati.
const NUOVE_MINIMAL = [
    ['avena', 'Avena', '#3D3A35', '#C9B79C', '#F4F1EA', '#1F1D1A'],
    ['porcellana', 'Porcellana', '#2C2C2C', '#8FB8DE', '#F7F7F5', '#161616'],
    ['gesso', 'Gesso', '#1E1E1E', '#E4572E', '#F3F2EE', '#141414'],
    ['ardesia-chiara', 'Ardesia chiara', '#3C4A57', '#B9C9D6', '#F1F3F4', '#1B242B'],
    ['burro', 'Burro', '#4A4231', '#E8D8A0', '#FAF7EC', '#2A261C'],
    ['pietra', 'Pietra', '#4B4946', '#A89F91', '#EDEBE7', '#1E1D1B'],
    ['zen', 'Zen', '#2F3B34', '#A7BFAE', '#F2F4F0', '#18201B'],
    ['inchiostro', 'Inchiostro', '#0F172A', '#38BDF8', '#F8FAFC', '#0B1220'],
    ['cipria', 'Cipria', '#4A3B3B', '#E3B8B0', '#FAF3F1', '#2A1F1F'],
    ['argento', 'Argento', '#34383D', '#B8BEC6', '#F4F5F6', '#16181B'],
    ['sale-pepe', 'Sale e pepe', '#222222', '#6B6B6B', '#FBFBFA', '#111111'],
    ['te-verde', 'Tè verde', '#41503F', '#C9D6A8', '#F5F7EE', '#1C241B'],
    ['terra-chiara', 'Terra chiara', '#6B4F3A', '#E2CFB4', '#F8F3EC', '#2B2018'],
    ['azzurro-polvere', 'Azzurro polvere', '#35546B', '#A9C7DB', '#F2F6F8', '#14232D'],
    ['lino', 'Lino', '#5A5347', '#D8C9AE', '#F6F2E9', '#26221B'],
    ['mono-blu', 'Mono blu', '#1D3FD6', '#0B1020', '#F6F7FB', '#0B1020'],
  ]
const NUOVE_ELEGANTE = [
    ['smeraldo-oro', 'Smeraldo e oro', '#0F3D2E', '#C9A227', '#F4F0E4', '#10241C'],
    ['nero-oro', 'Nero e oro', '#121212', '#C5A24D', '#F6F2EA', '#121212'],
    ['vino-crema', 'Vino e crema', '#5E1224', '#D9B99B', '#F8F1E7', '#2B0F17'],
    ['blu-reale', 'Blu reale', '#1A2B6D', '#D4AF37', '#F5F3EE', '#141C42'],
    ['petrolio-rame', 'Petrolio e rame', '#12424A', '#B87333', '#F3EEE6', '#0F2A2F'],
    ['ametista', 'Ametista', '#3D2C5A', '#CDAE74', '#F7F3F8', '#221733'],
    ['perla', 'Perla', '#2E3440', '#C9B8A6', '#F5F3F0', '#1F232B'],
    ['bronzo-antico', 'Bronzo antico', '#3B2A1E', '#A9784B', '#F2EBDD', '#241911'],
    ['cipresso', 'Cipresso', '#1E3A2F', '#B9A06A', '#F1EFE6', '#13241D'],
    ['rosa-antico', 'Rosa antico', '#6B2D3C', '#D8A7A0', '#FAF2F0', '#2E1319'],
    ['oltremare', 'Oltremare', '#0B2A5B', '#E6D5A8', '#F5F4EF', '#0B1D3F'],
    ['carbone-rosa', 'Carbone e rosa', '#2B2B30', '#E8B4B8', '#F7F4F4', '#1B1B1F'],
    ['borgogna', 'Borgogna', '#4A1420', '#C9A227', '#F8F1EA', '#2A0D14'],
    ['ardesia-oro', 'Ardesia e oro', '#2F3E4E', '#C9A84C', '#F3F1EC', '#1B2631'],
    ['tartufo', 'Tartufo', '#3A2D2A', '#BFA58A', '#F4EEE8', '#221A17'],
    ['notte-argento', 'Notte e argento', '#14182B', '#B8C0D0', '#F2F3F7', '#0F1322'],
  ]
const NUOVE_NATURALE = [
    ['foresta', 'Foresta', '#2D4A35', '#C8B27A', '#F2F1E7', '#17261C'],
    ['bosco', 'Bosco', '#3E5641', '#D1A37B', '#F1F2EA', '#1B281E'],
    ['terra-bruciata', 'Terra bruciata', '#7A4B2E', '#B7C29A', '#F6EFE6', '#2C1B10'],
    ['fieno', 'Fieno', '#7A6A2F', '#A8B58B', '#F8F4E2', '#2B260F'],
    ['noce', 'Noce', '#5C4033', '#C2A878', '#F5EEE5', '#261913'],
    ['menta-selvatica', 'Menta selvatica', '#2E6B5B', '#E7C9A5', '#F0F6F3', '#12302A'],
    ['erba', 'Erba', '#3F7D3A', '#E6D58A', '#F3F7EC', '#162A15'],
    ['castagna', 'Castagna', '#6B3E26', '#D6B98C', '#F7EFE3', '#2A170C'],
    ['fiordaliso-terra', 'Fiordaliso e terra', '#4A6FA5', '#C7A27C', '#F5F3EE', '#1A2A40'],
    ['eucalipto', 'Eucalipto', '#4F7F6F', '#E5D1B8', '#F3F6F4', '#173028'],
    ['torba', 'Torba', '#3C3A2E', '#9DB38A', '#F1EFE6', '#1E1D14'],
    ['argilla-verde', 'Argilla e verde', '#9C5B3F', '#6E8B6B', '#F8F0E7', '#2D1B12'],
    ['cedro', 'Cedro', '#355C4A', '#C99A62', '#F3F0E6', '#162A21'],
    ['miele', 'Miele', '#8F6410', '#556B2F', '#FBF5E4', '#2E2108'],
    ['alga', 'Alga', '#2F5D62', '#A9C5A0', '#EFF5F2', '#10302F'],
    ['bacca', 'Bacca', '#6E2C3E', '#7B9E6B', '#F6F2EC', '#2A1219'],
  ]
const NUOVE_MEDITERRANEO = [
    ['mare-aperto', 'Mare aperto', '#145DA0', '#F2B880', '#F4F8FB', '#0C2D48'],
    ['pietra-lecce', 'Pietra di Lecce', '#8F6A3C', '#2F6F8F', '#F8F2E6', '#2E2417'],
    ['agrumeto', 'Agrumeto', '#B86E00', '#2E7D4F', '#FFF9EA', '#2B1F05'],
    ['bouganville', 'Bouganville', '#C2185B', '#00838F', '#FFF6F8', '#35101F'],
    ['ulivo-cielo', 'Ulivo e cielo', '#6B7B3F', '#4A90B8', '#F6F5EC', '#252C17'],
    ['maiolica', 'Maiolica', '#1F5FA8', '#E6B422', '#F7F6F0', '#11284A'],
    ['trullo', 'Trullo', '#5A4A3A', '#2A7DA0', '#F7F4EE', '#251D15'],
    ['adriatico', 'Adriatico', '#0E6BA8', '#E9C46A', '#F5FAFC', '#082B44'],
    ['fico-india', 'Fico d’India', '#6E7D1F', '#D9534F', '#F8F7EA', '#262A0E'],
    ['rosa-salina', 'Rosa salina', '#BC4A53', '#2C7DA0', '#FDF4EF', '#3A1A1D'],
    ['capperi', 'Capperi', '#4E7A52', '#E9A23B', '#F5F6EE', '#1D2D1F'],
    ['tufo', 'Tufo', '#9A6B3C', '#1F6F78', '#FAF3E8', '#30220F'],
    ['cielo-mezzogiorno', 'Cielo di mezzogiorno', '#2272B8', '#F4D35E', '#F6FAFD', '#0F2E4C'],
    ['melograno', 'Melograno', '#A4262C', '#6B8E4E', '#FBF3EC', '#34100F'],
    ['scoglio', 'Scoglio', '#3B5B6E', '#E5B687', '#F2F4F4', '#162630'],
    ['ginestra', 'Ginestra', '#8A6D00', '#2B9EB3', '#FFFBE8', '#2A2300'],
  ]
const NUOVE_VIVACE = [
    ['ciliegia', 'Ciliegia', '#C8102E', '#FFC72C', '#FFF7F5', '#2B0A12'],
    ['oceano-neon', 'Oceano neon', '#0057FF', '#00E0B8', '#F4F8FF', '#0A1A3C'],
    ['sole-viola', 'Sole e viola', '#6A1B9A', '#FFB300', '#FBF6FF', '#220B33'],
    ['tropicale', 'Tropicale', '#00796B', '#FF6F61', '#F2FBF9', '#06302B'],
    ['bubblegum', 'Bubblegum', '#D61F7C', '#6F52FF', '#FFF4FA', '#3A0D26'],
    ['lava', 'Lava', '#D63A00', '#FFB000', '#FFF6EE', '#3A1100'],
    ['elettrico', 'Elettrico', '#3A0CA3', '#F72585', '#F6F3FF', '#170640'],
    ['giungla', 'Giungla', '#00875A', '#FFD23F', '#F2FBF6', '#052E1D'],
    ['pesca-viola', 'Pesca e viola', '#7048E8', '#FF8C69', '#FFF6F2', '#240F5A'],
    ['ananas', 'Ananas', '#A86000', '#00A6A6', '#FFFBEA', '#332000'],
    ['lampone', 'Lampone', '#B5179E', '#4CC9F0', '#FFF4FD', '#3A0630'],
    ['arcobaleno', 'Arcobaleno', '#D91A45', '#3D8BFF', '#FFFAF6', '#33101A'],
    ['smeraldo-corallo', 'Smeraldo e corallo', '#00855F', '#FF6B6B', '#F3FBF8', '#06301F'],
    ['ciano-pop', 'Ciano pop', '#0079B5', '#FF5CA8', '#F2FAFF', '#07293A'],
    ['mandarino', 'Mandarino', '#CC4209', '#4263EB', '#FFF6EE', '#38150A'],
    ['prugna-lime', 'Prugna e lime', '#7B1E6B', '#A3E635', '#FDF5FC', '#2D0A27'],
  ]
const NUOVE_TECNOLOGICO = [
    ['aurora', 'Aurora', '#7CF5C8', '#7C8CFF', '#060B14', '#E6EEF8'],
    ['cyber-rosa', 'Cyber rosa', '#FF4FA3', '#2DE2E6', '#0C0714', '#F5ECFA'],
    ['matrix', 'Matrix', '#39FF88', '#0BC46A', '#020A05', '#DFFBE9'],
    ['sunset-neon', 'Sunset neon', '#FF7A59', '#FFC857', '#12090C', '#FBEFE9'],
    ['ghiaccio', 'Ghiaccio', '#9BE7FF', '#5AA9FF', '#07121A', '#E8F6FF'],
    ['rubino', 'Rubino', '#FF5470', '#FFA8B8', '#10070A', '#FBE9ED'],
    ['viola-profondo', 'Viola profondo', '#B388FF', '#64F4D4', '#0E0820', '#EFE9FF'],
    ['acciaio', 'Acciaio', '#8FB6FF', '#E0E7F1', '#0D1117', '#E6EDF3'],
    ['lime-nero', 'Lime e nero', '#C6FF3D', '#FFFFFF', '#0A0B09', '#F2F5EA'],
    ['ambra-viola', 'Ambra e viola', '#FFB347', '#9B7BFF', '#0F0B18', '#F7EFE3'],
    ['blu-elettrico', 'Blu elettrico', '#4D7CFF', '#00D4FF', '#050A1C', '#E7EDFF'],
    ['turchese-notte', 'Turchese notte', '#2DD4BF', '#F472B6', '#06161A', '#E4F7F5'],
    ['magenta-nero', 'Magenta e nero', '#E040FB', '#FFD740', '#0B0510', '#F6E9FB'],
    ['cobalto', 'Cobalto', '#5B8DEF', '#F6C177', '#0B1220', '#E8EEF9'],
    ['grafene', 'Grafene', '#EDEDED', '#FF6B35', '#0A0A0A', '#F2F2F2'],
    ['laser', 'Laser', '#FF2E63', '#08D9D6', '#0A0A12', '#F3F3F8'],
  ]

export const GRUPPI_PALETTE = [
  {
    id: 'minimal', nome: 'Minimal', desc: 'Base neutra calma, un solo accento', icona: 'minimal',
    palette: [
      { id: 'cloud-dancer', nome: 'Cloud Dancer', primary: '#1B1B1A', accent: '#9A8F80', bg: '#F0EEE9', surface: '#FFFFFF', text: '#1B1B1A', muted: '#6C6A65' },
      { id: 'carta', nome: 'Carta', primary: '#1F4FE0', accent: '#111111', bg: '#FAFAF8', surface: '#FFFFFF', text: '#111111', muted: '#66665F' },
      { id: 'sabbia-chiara', nome: 'Sabbia chiara', primary: '#5C4433', accent: '#D2B48C', bg: '#F5F0E6', surface: '#FFFDF8', text: '#2A2018', muted: '#6F6354' },
      { id: 'nebbia', nome: 'Nebbia', primary: '#2B3A3A', accent: '#7FA39B', bg: '#EEF1F0', surface: '#FFFFFF', text: '#1A2424', muted: '#62706F' },
      { id: 'grafite-lime', nome: 'Grafite e lime', primary: '#232323', accent: '#C6F24E', bg: '#F4F4F2', surface: '#FFFFFF', text: '#161616', muted: '#6A6A66' },
      { id: 'latte', nome: 'Latte', primary: '#3B2F2A', accent: '#D9A58B', bg: '#F7F1EA', surface: '#FFFFFF', text: '#241B17', muted: '#716259' },
      ...NUOVE_MINIMAL.map((r) => gen(r)),
    ],
  },
  {
    id: 'elegante', nome: 'Elegante', desc: 'Colore profondo e un tocco di metallo', icona: 'elegante',
    palette: [
      { id: 'navy-oro', nome: 'Navy e oro', primary: '#14213D', accent: '#C9A227', bg: '#F5F0E1', surface: '#FFFDF7', text: '#14213D', muted: '#6B6A66' },
      { id: 'bordeaux-champagne', nome: 'Bordeaux e champagne', primary: '#800020', accent: '#C8A96A', bg: '#FAF3E6', surface: '#FFFFFF', text: '#2A0F18', muted: '#7D6068' },
      { id: 'notte-bronzo', nome: 'Notte e bronzo', primary: '#10182B', accent: '#A9784B', bg: '#E8E2D6', surface: '#F6F2EA', text: '#10182B', muted: '#675F54' },
      { id: 'avorio-oro', nome: 'Avorio e oro', primary: '#1C1C1C', accent: '#B8902E', bg: '#F5F0E1', surface: '#FFFFFF', text: '#1C1C1C', muted: '#6E685B' },
      { id: 'blu-champagne', nome: 'Blu e champagne', primary: '#1B2A4A', accent: '#E5D5B0', bg: '#F6F3EC', surface: '#FFFFFF', text: '#14213D', muted: '#68675F' },
      { id: 'prugna', nome: 'Prugna', primary: '#5A2A4A', accent: '#D4AF37', bg: '#FAF5F7', surface: '#FFFFFF', text: '#2A1224', muted: '#7C6674' },
      ...NUOVE_ELEGANTE.map((r) => gen(r)),
    ],
  },
  {
    id: 'naturale', nome: 'Naturale', desc: 'Verdi, terre e toni caldi', icona: 'naturale',
    palette: [
      { id: 'teal-profondo', nome: 'Teal profondo', primary: '#1F5C63', accent: '#D9C2A3', bg: '#F4F1EA', surface: '#FFFFFF', text: '#17262A', muted: '#62706F' },
      { id: 'muschio', nome: 'Muschio', primary: '#566648', accent: '#C98B5B', bg: '#F3F1E8', surface: '#FFFFFF', text: '#232A1E', muted: '#656B5C' },
      { id: 'cacao', nome: 'Cacao', primary: '#4A3A32', accent: '#5F6F52', bg: '#F5EFE6', surface: '#FFFFFF', text: '#2A201B', muted: '#71625A' },
      { id: 'ulivo', nome: 'Ulivo', primary: '#5B6B3A', accent: '#C97C5D', bg: '#F3EBD6', surface: '#FFFDF5', text: '#2A3320', muted: '#626649' },
      { id: 'salvia', nome: 'Salvia', primary: '#4E7561', accent: '#E2B8A0', bg: '#F2F5F1', surface: '#FFFFFF', text: '#1E2D26', muted: '#5C6D66' },
      { id: 'argilla', nome: 'Argilla', primary: '#8A5A44', accent: '#A3B18A', bg: '#F6EFE8', surface: '#FFFFFF', text: '#2E1F18', muted: '#74625A' },
      ...NUOVE_NATURALE.map((r) => gen(r)),
    ],
  },
  {
    id: 'mediterraneo', nome: 'Mediterraneo', desc: 'Calce, mare, terracotta, sole', icona: 'mediterraneo',
    palette: [
      { id: 'terracotta-mare', nome: 'Terracotta e mare', primary: '#B65C3A', accent: '#2E6F95', bg: '#F6F1E6', surface: '#FFFFFF', text: '#0F2D3F', muted: '#5F6F78' },
      { id: 'blu-egeo', nome: 'Blu Egeo', primary: '#0B3C5D', accent: '#E28B67', bg: '#F7F1E6', surface: '#FFFFFF', text: '#0B2236', muted: '#5D6B76' },
      { id: 'calce-ulivo', nome: 'Calce e ulivo', primary: '#5B6B3A', accent: '#2F4F6F', bg: '#F7F4EC', surface: '#FFFFFF', text: '#232A1E', muted: '#656B5C' },
      { id: 'tramonto-salentino', nome: 'Tramonto salentino', primary: '#B35730', accent: '#3A7399', bg: '#FBF3E6', surface: '#FFFFFF', text: '#2E1B12', muted: '#80675A' },
      { id: 'limone-costa', nome: 'Limone di costa', primary: '#8F6A00', accent: '#1D6FA3', bg: '#FFFBEF', surface: '#FFFFFF', text: '#2A2410', muted: '#716B4C' },
      { id: 'masseria', nome: 'Masseria', primary: '#8F5F34', accent: '#7FA39B', bg: '#F8F2E8', surface: '#FFFDF8', text: '#2A2118', muted: '#716555' },
      ...NUOVE_MEDITERRANEO.map((r) => gen(r)),
    ],
  },
  {
    id: 'vivace', nome: 'Vivace', desc: 'Colori pieni, personalità forte', icona: 'vivace',
    palette: [
      { id: 'corallo-sole', nome: 'Corallo e sole', primary: '#D92B44', accent: '#FFB259', bg: '#FFF8F6', surface: '#FFFFFF', text: '#2A1519', muted: '#80626A' },
      { id: 'viola-elettrico', nome: 'Viola elettrico', primary: '#6D3BFF', accent: '#FF4D8D', bg: '#F8F6FF', surface: '#FFFFFF', text: '#1E1536', muted: '#756A92' },
      { id: 'arancio-pop', nome: 'Arancio pop', primary: '#D4401A', accent: '#5A4B8A', bg: '#FFF7F2', surface: '#FFFFFF', text: '#2B1538', muted: '#7C6A74' },
      { id: 'blu-lime', nome: 'Blu e lime', primary: '#1D4ED8', accent: '#C6F24E', bg: '#F7FAFF', surface: '#FFFFFF', text: '#0E1B3D', muted: '#5F6B85' },
      { id: 'smeraldo-giallo', nome: 'Smeraldo e giallo', primary: '#08805E', accent: '#F5B83D', bg: '#F4FAF8', surface: '#FFFFFF', text: '#0D2A23', muted: '#4F6E65' },
      { id: 'fucsia', nome: 'Fucsia', primary: '#D6246E', accent: '#2EC4B6', bg: '#FFF5F9', surface: '#FFFFFF', text: '#2A0F1C', muted: '#80626F' },
      ...NUOVE_VIVACE.map((r) => gen(r)),
    ],
  },
  {
    id: 'tecnologico', nome: 'Tecnologico', desc: 'Fondi scuri, accenti al neon', icona: 'tecnologico',
    palette: [
      { id: 'mood-dark', nome: 'Mood dark', dark: true, primary: '#40E0FF', accent: '#6C4DF5', bg: '#0B0D10', surface: '#151A21', text: '#E9EEF5', muted: '#8A94A3' },
      { id: 'neural', nome: 'Neural', dark: true, primary: '#00FFA3', accent: '#FF3D81', bg: '#030712', surface: '#0E1626', text: '#E8F0FF', muted: '#8591A8' },
      { id: 'nebbia-viola', nome: 'Nebbia viola', dark: true, primary: '#A9BEE8', accent: '#FF6A3D', bg: '#1A0F26', surface: '#2B1538', text: '#F1ECF8', muted: '#A598B8' },
      { id: 'quantum', nome: 'Quantum', dark: true, primary: '#00FFF6', accent: '#FF00CC', bg: '#050505', surface: '#111113', text: '#F4F4F5', muted: '#8E8E96' },
      { id: 'indaco', nome: 'Indaco', dark: true, primary: '#7FA3FF', accent: '#9B6BFF', bg: '#0A0F24', surface: '#131A38', text: '#EAF0FF', muted: '#8B97BE' },
      { id: 'grafite-ambra', nome: 'Grafite e ambra', dark: true, primary: '#FFB020', accent: '#3DD6C6', bg: '#111214', surface: '#1B1D20', text: '#F3F3F2', muted: '#9A9A96' },
      ...NUOVE_TECNOLOGICO.map((r) => gen(r, true)),
    ],
  },
]
export const PALETTE = GRUPPI_PALETTE.flatMap((g) => g.palette)

export const TEMA_SCURO = { bg: '#101216', surface: '#1a1d23', text: '#f3f4f6', muted: '#9aa1ad' }
export const TEMA_CHIARO = { bg: '#F5F7FA', surface: '#FFFFFF', text: '#10151C', muted: '#586270' }

export { GRUPPI_FONT, FONT } from './fontsData.js'

export const BOTTONI = [
  { id: 'squadrato', nome: 'Squadrato', raggio: '0px' },
  { id: 'leggero', nome: 'Leggero', raggio: '6px' },
  { id: 'morbido', nome: 'Morbido', raggio: '12px' },
  { id: 'pillola', nome: 'Pillola', raggio: '999px' },
]

export const RIEMPIMENTO = [
  { id: 'pieno', nome: 'Pieno' },
  { id: 'contorno', nome: 'Contorno' },
  { id: 'tenue', nome: 'Tenue' },
]

export const CARD = [
  { id: 'piatta', nome: 'Piatta', note: 'Solo sfondo' },
  { id: 'bordo', nome: 'Con bordo', note: 'Linea sottile' },
  { id: 'ombra', nome: 'Con ombra', note: 'Leggera e morbida' },
  { id: 'rialzata', nome: 'Rialzata', note: 'Ombra marcata' },
  { id: 'accento', nome: 'Con accento', note: 'Barra colorata' },
]

export const ANGOLI_CARD = [
  { id: 'netti', nome: 'Netti', raggio: '0px' },
  { id: 'medi', nome: 'Medi', raggio: '10px' },
  { id: 'ampi', nome: 'Ampi', raggio: '22px' },
]

export const DEFAULT = {
  palette: 'carta', font: 'poppins-inter', bottone: 'morbido', riempimento: 'pieno',
  card: 'ombra', angoli: 'medi', scuro: false, temaModo: 'solo', coloreMarchio: '', logoDim: 'medio',
}

export const ATMOSFERE = [
  { id: 'elegante', nome: 'Elegante', desc: 'Sobrio, poco colore', set: { palette: 'navy-oro', font: 'playfair-display-inter', bottone: 'leggero', riempimento: 'contorno', card: 'bordo', angoli: 'netti', scuro: false } },
  { id: 'moderno', nome: 'Moderno', desc: 'Pulito e diretto', set: { palette: 'carta', font: 'poppins-inter', bottone: 'morbido', riempimento: 'pieno', card: 'ombra', angoli: 'medi', scuro: false } },
  { id: 'colorato', nome: 'Colorato', desc: 'Vivace, personalità forte', set: { palette: 'corallo-sole', font: 'montserrat-inter', bottone: 'pillola', riempimento: 'pieno', card: 'rialzata', angoli: 'ampi', scuro: false } },
  { id: 'tecnologico', nome: 'Tecnologico', desc: 'Netto, futurista', set: { palette: 'mood-dark', font: 'space-grotesk-dm-sans', bottone: 'morbido', riempimento: 'pieno', card: 'accento', angoli: 'medi', scuro: true } },
]

export const LOGO_DIM = [
  { id: 'piccolo', nome: 'Piccolo', px: 56 },
  { id: 'medio', nome: 'Medio', px: 80 },
  { id: 'grande', nome: 'Grande', px: 112 },
]
