// Bandiere rotonde disegnate in SVG (nessuna emoji): sono sempre nitide e uguali su ogni dispositivo.
const stella = (cx, cy, r, ruota = 0) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2 + ruota
    const rr = i % 2 ? r * 0.4 : r
    return `${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`
  }).join(' ')

const DISEGNI = {
  it: (
    <>
      <rect width="22" height="64" fill="#009246" />
      <rect x="21" width="22" height="64" fill="#ffffff" />
      <rect x="42" width="22" height="64" fill="#ce2b37" />
    </>
  ),
  fr: (
    <>
      <rect width="22" height="64" fill="#0055a4" />
      <rect x="21" width="22" height="64" fill="#ffffff" />
      <rect x="42" width="22" height="64" fill="#ef4135" />
    </>
  ),
  de: (
    <>
      <rect width="64" height="22" fill="#111111" />
      <rect y="21" width="64" height="22" fill="#dd0000" />
      <rect y="42" width="64" height="22" fill="#ffce00" />
    </>
  ),
  es: (
    <>
      <rect width="64" height="64" fill="#c60b1e" />
      <rect y="16" width="64" height="32" fill="#ffc400" />
    </>
  ),
  cn: (
    <>
      <rect width="64" height="64" fill="#de2910" />
      <polygon points={stella(19, 21, 11)} fill="#ffde00" />
      <polygon points={stella(36, 9, 3.4, 0.5)} fill="#ffde00" />
      <polygon points={stella(43, 17, 3.4, 0.2)} fill="#ffde00" />
      <polygon points={stella(43, 27, 3.4, 0.4)} fill="#ffde00" />
      <polygon points={stella(36, 34, 3.4, 0.6)} fill="#ffde00" />
    </>
  ),
  en: (
    <>
      <rect width="64" height="64" fill="#012169" />
      <path d="M0 0L64 64M64 0L0 64" stroke="#ffffff" strokeWidth="11" />
      <path d="M0 0L64 64M64 0L0 64" stroke="#c8102e" strokeWidth="4.5" />
      <path d="M32 0V64M0 32H64" stroke="#ffffff" strokeWidth="18" />
      <path d="M32 0V64M0 32H64" stroke="#c8102e" strokeWidth="10" />
    </>
  ),
}

let contatore = 0
export default function Bandiera({ id, size = 64 }) {
  const clip = `b${id}${++contatore}`
  return (
    <svg className="bandiera" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <clipPath id={clip}><circle cx="32" cy="32" r="32" /></clipPath>
        <radialGradient id={clip + 'l'} cx="30%" cy="22%" r="75%">
          <stop offset="0" stopColor="#fff" stopOpacity=".5" />
          <stop offset=".55" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".16" />
        </radialGradient>
      </defs>
      <g clipPath={`url(#${clip})`}>
        {DISEGNI[id === 'zh' ? 'cn' : id]}
        <circle cx="32" cy="32" r="32" fill={`url(#${clip}l)`} />
      </g>
    </svg>
  )
}
