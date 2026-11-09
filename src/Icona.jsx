const P = {
  vetrina: 'M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01',
  ecommerce: 'M5 7h14l-1.5 11h-11zM9 7a3 3 0 016 0',
  webapp: 'M8 3h8a2 2 0 012 2v14a2 2 0 01-2 2H8a2 2 0 01-2-2V5a2 2 0 012-2zM11 18h2',
  landing: 'M5 3h14v18H5zM8 8h8M8 12h8M8 16h4',
  piu: 'M12 5v14M5 12h14',
  indietro: 'M15 5l-7 7 7 7',
  avanti: 'M9 5l7 7-7 7',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 017 0v3',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  sole: 'M12 4V2M12 22v-2M4 12H2M22 12h-2M6 6L4.5 4.5M19.5 19.5L18 18M18 6l1.5-1.5M4.5 19.5L6 18M12 8a4 4 0 100 8 4 4 0 000-8z',
  luna: 'M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z',
  cestino: 'M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13',
  copia: 'M9 9h10v11H9zM5 15V4h10',
  stella: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  atmosfera: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z',
  colori: 'M12 3a9 9 0 100 18c1.6 0 2.2-1 1.7-2.1s0-2.1 1.4-2.1H18a3 3 0 003-3c0-5.5-4-10.8-9-10.8zM7.5 11.5h.01M10 7.5h.01M14.5 7.5h.01',
  font: 'M4 19L10 5l6 14M6.3 14.5h7.4M18 19v-7M16 12.5h4',
  bottoni: 'M7 8h10a4 4 0 010 8H7a4 4 0 010-8zM9.5 12h5',
  card: 'M12 4l9 5-9 5-9-5zM3 14l9 5 9-5',
  clienti: 'M4 11l8-7 8 7v9H4zM10 20v-5h4v5',
  backup: 'M12 4v11M7.5 10.5L12 15l4.5-4.5M5 20h14',
  minimal: 'M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z',
  elegante: 'M6 4h12l3 5-9 11L3 9zM3 9h18M9 4l-2 5 5 11 5-11-2-5',
  naturale: 'M5 19c0-9 5-14 14-14 0 9-5 14-14 14zM5 19l8-8',
  mediterraneo: 'M3 9c3-3 6 3 9 0s6-3 9 0M3 15c3-3 6 3 9 0s6-3 9 0',
  vivace: 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4',
  tecnologico: 'M8 8h8v8H8zM4 10h4M4 14h4M16 10h4M16 14h4M10 4v4M14 4v4M10 16v4M14 16v4',
  pdf: 'M6 3h8l5 5v13H6zM14 3v5h5M9 14h6M9 17.5h4',
  x: 'M6 6l12 12M18 6L6 18',
  'f-moderno': 'M5 19L12 5l7 14M8 14h8',
  'f-classico': 'M5 4h10a3 3 0 013 3v13H8a3 3 0 01-3-3zM5 17a3 3 0 013-3h10',
  'f-deciso': 'M13 3L5 13h6l-1 8 8-10h-6z',
  'f-caldo': 'M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z',
  'f-leggero': 'M20 4c-8 0-13 4-13 11l-3 5M20 4c0 6-4 10-10 10M9 15h6',
  pennello: 'M4 20c3 0 4-1.5 4-3a2.5 2.5 0 015 0c0 2-2 3-9 3zM9.5 14.5L20 4',
}
export default function Icona({ nome, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[nome]} />
    </svg>
  )
}
