import Bandiera from './Bandiera.jsx'
import Icona from './Icona.jsx'
import { LINGUE } from './lingue.js'

// Scelta delle lingue del sito: tocca un pallino per aggiungerla, il pulsante sotto la rende principale.
export default function SelettoreLingue({ valore, onChange, compatto = false }) {
  const scelta = (id) => valore.find((x) => x.id === id)

  const alterna = (id) => {
    if (scelta(id)) {
      if (valore.length === 1) return
      let resto = valore.filter((x) => x.id !== id)
      if (!resto.some((x) => x.principale)) resto = resto.map((x, i) => (i === 0 ? { ...x, principale: true } : x))
      onChange(resto)
    } else {
      onChange([...valore, { id, principale: !valore.some((x) => x.principale) }])
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
      <div className="pallini">
        {LINGUE.map((l, i) => {
          const s = scelta(l.id)
          return (
            <div key={l.id} style={{ '--i': i }} className={'pallino-col' + (s ? ' on' : '')}>
              <button className="pallino" onClick={() => alterna(l.id)} aria-pressed={!!s} aria-label={`${l.nome}${s ? ', scelta' : ''}`}>
                <Bandiera id={l.id} size={compatto ? 60 : 92} />
                {s && <span className="pallino__spunta"><Icona nome="check" size={compatto ? 12 : 16} /></span>}
              </button>
              <b>{l.nativo}</b>
              {s ? (
                <button className={'pallino__stato' + (s.principale ? ' on' : '')} onClick={() => principale(l.id)} aria-pressed={s.principale}>
                  <Icona nome="stella" size={13} /> {s.principale ? 'Principale' : 'Aggiuntiva'}
                </button>
              ) : (
                <small>{l.nome}</small>
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
