import { useState } from 'react'
import Foto from './Foto.jsx'
import Icona from './Icona.jsx'
import SelettoreLingue from './SelettoreLingue.jsx'
import { ATTIVITA, TIPI } from './attivita.js'
import { LINGUE_DEFAULT } from './lingue.js'

export default function Nuovo({ onAnnulla, onCrea }) {
  const [passo, setPasso] = useState(1)
  const [d, setD] = useState({ nome: '', referente: '', attivita: '', tipo: '', lingue: LINGUE_DEFAULT })
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
            <input autoFocus value={d.nome} onChange={(e) => set('nome', e.target.value)} placeholder="Es. Ottica Visione" />
          </label>
          <label className="campo">Referente <em>(facoltativo)</em>
            <input value={d.referente} onChange={(e) => set('referente', e.target.value)} placeholder="Es. Mario Rossi" />
          </label>
        </div>
      )}

      {passo === 2 && (
        <div className="passo passo--largo" key="p2">
          <span className="eyebrow">Nuovo cliente · 2 di 4</span>
          <h1 className="titolo">Che <em>attività</em> è?</h1>
          <div className="tessere">
            {ATTIVITA.map((a, i) => (
              <button key={a.id} style={{ '--i': i }} className={'tessera' + (d.attivita === a.id ? ' on' : '')} onClick={() => set('attivita', a.id)}>
                <Foto att={a.id} nome="hero" className="tessera__foto" />
                <span className="tessera__nome">{a.nome}</span>
                {d.attivita === a.id && <span className="spunta"><Icona nome="check" size={18} /></span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {passo === 3 && (
        <div className="passo passo--largo" key="p3">
          <span className="eyebrow">Nuovo cliente · 3 di 4</span>
          <h1 className="titolo">Che <em>progetto</em> serve?</h1>
          <div className="tipi">
            {TIPI.map((t, i) => (
              <button key={t.id} style={{ '--i': i }} className={'tipo glass' + (d.tipo === t.id ? ' on' : '')} onClick={() => set('tipo', t.id)}>
                <span className="tipo__icona"><Icona nome={t.id} size={30} /></span>
                <b>{t.nome}</b>
                <small>{t.desc}</small>
              </button>
            ))}
          </div>
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
