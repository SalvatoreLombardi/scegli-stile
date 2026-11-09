import Icona from './Icona.jsx'

// Barra di schede con la pallina che salta da una voce all'altra.
export default function TabBolla({ voci, attivo, onScegli, compatta = false }) {
  const i = Math.max(0, voci.findIndex((v) => v.id === attivo))
  return (
    <div className={'bolla-bar' + (compatta ? ' bolla-bar--compatta' : '')} role="tablist">
      <span className="bolla-slider" style={{ width: `${100 / voci.length}%`, transform: `translateX(${i * 100}%)` }}>
        <span className="bolla" key={attivo}><Icona nome={voci[i].icona || voci[i].id} size={compatta ? 20 : 22} /></span>
      </span>
      {voci.map((v) => (
        <button key={v.id} role="tab" aria-selected={attivo === v.id} aria-label={v.nome} className={attivo === v.id ? 'on' : ''} onClick={() => onScegli(v.id)}>
          <span className="bolla-icona"><Icona nome={v.icona || v.id} size={compatta ? 20 : 22} /></span>
          {!compatta && <span className="bolla-testo">{v.nome}</span>}
        </button>
      ))}
    </div>
  )
}
