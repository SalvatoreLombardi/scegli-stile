import Icona from './Icona.jsx'
import { LINGUE } from './lingue.js'

// Scelta delle lingue del sito: tocca una lingua per aggiungerla, la stella la rende principale.
export default function SelettoreLingue({ valore, onChange, compatto = false }) {
  const scelta = (id) => valore.find((x) => x.id === id)

  const alterna = (id) => {
    if (scelta(id)) {
      if (valore.length === 1) return
      let resto = valore.filter((x) => x.id !== id)
      if (!resto.some((x) => x.principale)) resto = resto.map((x, i) => (i === 0 ? { ...x, principale: true } : x))
      onChange(resto)
    } else {
      const nuova = { id, principale: !valore.some((x) => x.principale) }
      onChange([...valore, nuova])
    }
  }
  const principale = (id) => {
    const l = scelta(id)
    if (l.principale && valore.filter((x) => x.principale).length === 1) return
    onChange(valore.map((x) => (x.id === id ? { ...x, principale: !x.principale } : x)))
  }

  const prin = valore.filter((x) => x.principale).map((x) => LINGUE.find((l) => l.id === x.id).nativo)
  const altre = valore.filter((x) => !x.principale).map((x) => LINGUE.find((l) => l.id === x.id).nativo)

  return (
    <div className={'lingue' + (compatto ? ' lingue--compatto' : '')}>
      <div className="lingue-griglia">
        {LINGUE.map((l, i) => {
          const s = scelta(l.id)
          return (
            <div key={l.id} style={{ '--i': i }} className={'lingua glass' + (s ? ' on' : '')}>
              <button className="lingua__corpo" onClick={() => alterna(l.id)} aria-pressed={!!s}>
                <span className="lingua__bandiera">{l.bandiera}</span>
                <b>{l.nativo}</b>
                <small>{l.nome}</small>
                {s && <span className="lingua__spunta"><Icona nome="check" size={16} /></span>}
              </button>
              {s && (
                <button className={'lingua__stato' + (s.principale ? ' on' : '')} onClick={() => principale(l.id)} aria-pressed={s.principale}>
                  <Icona nome="stella" size={15} /> {s.principale ? 'Principale' : 'Aggiuntiva'}
                </button>
              )}
            </div>
          )
        })}
      </div>
      <p className="lingue-riepilogo">
        <b>{prin.join(' · ')}</b>
        {altre.length > 0 && <span> + {altre.join(' · ')}</span>}
      </p>
    </div>
  )
}
