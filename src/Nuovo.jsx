import { useState } from 'react'
import Icona from './Icona.jsx'
import SelettoreLingue from './SelettoreLingue.jsx'
import { SceltaAttivita, SceltaTipo } from './Scelte.jsx'
import { LINGUE_DEFAULT } from './lingue.js'

export default function Nuovo({ onAnnulla, onCrea, tipoIniziale = '' }) {
  const [passo, setPasso] = useState(1)
  const [d, setD] = useState({ nome: '', referente: '', attivita: '', tipo: tipoIniziale, lingue: LINGUE_DEFAULT })
  const set = (k, v) => setD((o) => ({ ...o, [k]: v }))
  const ok = [d.nome.trim().length > 1, !!d.attivita, !!d.tipo, d.lingue.length > 0][passo - 1]
  const avanti = () => (passo < 4 ? setPasso(passo + 1) : onCrea({ ...d, nome: d.nome.trim(), referente: d.referente.trim() }))

  return (
    <div className="vista vista-entra nuovo">
      <div className="nuovo-testa">
        <button className="indietro" onClick={passo === 1 ? onAnnulla : () => setPasso(passo - 1)}>
          <Icona nome="indietro" size={18} /> {passo === 1 ? 'Annulla' : 'Indietro'}
        </button>
        <div className="passi" aria-label={`Passo ${passo} di 4`}>{[1, 2, 3, 4].map((n) => <i key={n} className={n <= passo ? 'on' : ''} />)}</div>
      </div>

      {passo === 1 && (
        <div className="passo" key="p1">
          <span className="eyebrow">Nuovo cliente · 1 di 4</span>
          <h1 className="titolo">Come si chiama <em>l’attività</em>?</h1>
          <label className="campo">Nome dell’attività
            <input autoFocus value={d.nome} onChange={(e) => set('nome', e.target.value)} />
          </label>
          <label className="campo">Referente <em>(facoltativo)</em>
            <input value={d.referente} onChange={(e) => set('referente', e.target.value)} />
          </label>
        </div>
      )}

      {passo === 2 && (
        <div className="passo passo--largo" key="p2">
          <span className="eyebrow">Nuovo cliente · 2 di 4</span>
          <h1 className="titolo">Che <em>attività</em> è?</h1>
          <SceltaAttivita valore={d.attivita} onScegli={(v) => set('attivita', v)} />
        </div>
      )}

      {passo === 3 && (
        <div className="passo passo--largo" key="p3">
          <span className="eyebrow">Nuovo cliente · 3 di 4</span>
          <h1 className="titolo">Che <em>progetto</em> serve?</h1>
          <SceltaTipo valore={d.tipo} onScegli={(v) => set('tipo', v)} />
        </div>
      )}

      {passo === 4 && (
        <div className="passo passo--largo" key="p4">
          <span className="eyebrow">Nuovo cliente · 4 di 4</span>
          <h1 className="titolo">Che <em>lingue</em> parla il sito?</h1>
          <p className="aiuto lingue-aiuto">Tocca per aggiungere una lingua. La stella indica quelle principali: puoi sceglierne più di una.</p>
          <SelettoreLingue valore={d.lingue} onChange={(l) => set('lingue', l)} />
        </div>
      )}

      <div className="nuovo-piede">
        <button className="primario grande" disabled={!ok} onClick={avanti}>
          {passo < 4 ? 'Continua' : 'Crea cliente'} <Icona nome="avanti" size={20} />
        </button>
      </div>
    </div>
  )
}
