import Icona from './Icona.jsx'

// Barra di schede. Versione grande: la pallina salta da una voce all'altra.
// Versione compatta: un cono di luce scorre da un'icona all'altra.
export default function TabBolla({ voci, attivo, onScegli, compatta = false }) {
  const i = Math.max(0, voci.findIndex((v) => v.id === attivo))
  const largo = `${100 / voci.length}%`

  if (compatta) {
    return (
      <div className="luce-bar" role="tablist">
        <span className="cono" style={{ width: largo, transform: `translateX(${i * 100}%)` }} />
        {voci.map((v) => (
          <button key={v.id} role="tab" aria-selected={attivo === v.id} aria-label={v.nome} className={attivo === v.id ? 'on' : ''} onClick={() => onScegli(v.id)}>
            <Icona nome={v.icona || v.id} size={22} />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="bolla-bar" role="tablist">
      <span className="bolla-slider" style={{ width: largo, transform: `translateX(${i * 100}%)` }}>
        <span className="bolla" key={attivo}><Icona nome={voci[i].icona || voci[i].id} size={15} /></span>
      </span>
      {voci.map((v) => (
        <button key={v.id} role="tab" aria-selected={attivo === v.id} aria-label={v.nome} className={attivo === v.id ? 'on' : ''} onClick={() => onScegli(v.id)}>
          <span className="bolla-icona"><Icona nome={v.icona || v.id} size={22} /></span>
          <span className="bolla-testo">{v.nome}</span>
        </button>
      ))}
    </div>
  )
}
