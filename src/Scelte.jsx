import Foto from './Foto.jsx'
import Icona from './Icona.jsx'
import { ATTIVITA, TIPI } from './attivita.js'

// I riquadri sono div con role="button": Safari non ritaglia bene foto e angoli arrotondati dentro un <button>.
const tasto = (fn) => ({ role: 'button', tabIndex: 0, onClick: fn, onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn() } } })

export function SceltaAttivita({ valore, onScegli }) {
  return (
    <div className="tessere">
      {ATTIVITA.map((a, i) => (
        <div key={a.id} style={{ '--i': i }} className={'tessera' + (valore === a.id ? ' on' : '')} {...tasto(() => onScegli(a.id))}>
          <Foto att={a.id} nome="hero" className="tessera__foto" />
          <span className="tessera__nome">{a.nome}</span>
          {valore === a.id && <span className="spunta"><Icona nome="check" size={18} /></span>}
        </div>
      ))}
    </div>
  )
}

export function SceltaTipo({ valore, onScegli }) {
  return (
    <div className="tipi">
      {TIPI.map((t, i) => (
        <div key={t.id} style={{ '--i': i }} className={'tipo glass' + (valore === t.id ? ' on' : '')} {...tasto(() => onScegli(t.id))}>
          <span className="tipo__icona"><Icona nome={t.id} size={30} /></span>
          <b>{t.nome}</b>
          <small>{t.desc}</small>
        </div>
      ))}
    </div>
  )
}
