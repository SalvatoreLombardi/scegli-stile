import { useState } from 'react'
import Cliente from './Cliente.jsx'
import Foto from './Foto.jsx'
import Icona from './Icona.jsx'
import Nuovo from './Nuovo.jsx'
import Studio from './Studio.jsx'
import { PALETTE } from './dati.js'
import { ATTIVITA, TIPI } from './attivita.js'
import { trova } from './utils.js'
import { useClienti } from './store.js'

function Backup({ clienti, onImporta, onChiudi }) {
  const [testo, setTesto] = useState('')
  const [msg, setMsg] = useState('')
  const copia = async () => {
    try { await navigator.clipboard.writeText(JSON.stringify(clienti)); setMsg('Backup copiato. Incollalo in un appunto o in una mail a te stesso.') } catch { setMsg('Non riesco a copiare: tieni premuto sul testo qui sotto.') }
  }
  const importa = () => {
    try { onImporta(testo); setMsg('Importato.'); setTesto('') } catch { setMsg('Testo non valido.') }
  }
  return (
    <div className="velo" onClick={onChiudi}>
      <div className="finestra" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h3>Backup dei clienti</h3>
        <p className="aiuto">I clienti sono salvati solo su questo iPad. Aggiungi l’app alla schermata Home per non perderli e fai ogni tanto un backup.</p>
        <button className="secondario largo" onClick={copia}><Icona nome="copia" size={18} /> Copia backup</button>
        <textarea rows="3" value={testo} onChange={(e) => setTesto(e.target.value)} placeholder="Per ripristinare: incolla qui il backup" />
        <div className="barra-piede">
          <button className="secondario" onClick={importa} disabled={!testo}>Ripristina</button>
          <button className="primario" onClick={onChiudi}>Chiudi</button>
        </div>
        {msg && <p className="aiuto">{msg}</p>}
      </div>
    </div>
  )
}

const ESEMPI = [
  { id: 'vetrina', nome: 'Sito vetrina', desc: 'Presenta l’attività in più pagine' },
  { id: 'ecommerce', nome: 'E-commerce', desc: 'Catalogo, carrello e pagamenti' },
  { id: 'webapp', nome: 'App', desc: 'Prenotazioni e area clienti' },
]

// Schemi neutri dei tre layout: solo forme, nessuna foto.
function Schema({ tipo }) {
  if (tipo === 'vetrina') {
    return (
      <div className="wire">
        <div className="w-nav"><i className="w-dot" /><i className="w-bar s" /><i className="w-btn" /></div>
        <div className="w-blk w-hero"><i className="w-bar m" /><i className="w-bar s" /><i className="w-btn" /></div>
        <div className="w-row"><i className="w-blk p" /><i className="w-blk" /><i className="w-blk p" /></div>
      </div>
    )
  }
  if (tipo === 'ecommerce') {
    return (
      <div className="wire">
        <div className="w-nav"><i className="w-dot" /><i className="w-bar s" /><i className="w-pill" /></div>
        <div className="w-blk w-banner" />
        <div className="w-row w-prod"><div><i className="w-blk" /><i className="w-bar s" /></div><div><i className="w-blk p" /><i className="w-bar s" /></div><div><i className="w-blk" /><i className="w-bar s" /></div></div>
      </div>
    )
  }
  return (
    <div className="wire w-app">
      <div className="w-lato"><i className="w-dot" /><i className="w-bar" /><i className="w-bar" /><i className="w-bar" /></div>
      <div className="w-main">
        <div className="w-row w-kpi"><i className="w-blk" /><i className="w-blk p" /><i className="w-blk" /></div>
        <i className="w-riga" /><i className="w-riga" /><i className="w-riga" />
      </div>
    </div>
  )
}

function Rail({ attivo, onClienti, onNuovo, onBackup }) {
  return (
    <nav className="rail" aria-label="Navigazione">
      <span className="logo punti" style={{ transform: 'scale(.9)' }}><i /><i /><i /></span>
      <div className="sep" />
      <button className={attivo === 'clienti' ? 'on' : ''} onClick={onClienti} aria-label="Clienti"><Icona nome="clienti" /></button>
      <button onClick={onNuovo} aria-label="Nuovo cliente"><Icona nome="piu" /></button>
      <div className="sep" />
      <button onClick={onBackup} aria-label="Backup"><Icona nome="backup" /></button>
    </nav>
  )
}

function Home({ clienti, onNuovo, onApri }) {
  return (
    <div className="vista vista-entra">
      <div className="home-titolo">
        <div>
          <span className="eyebrow">Scegli Stile</span>
          <h1 className="titolo titolo--xl">I tuoi <em>clienti</em></h1>
          <p>{clienti.length === 0 ? 'Crea il primo e fagli scegliere lo stile.' : `${clienti.length} ${clienti.length === 1 ? 'cliente' : 'clienti'} in studio`}</p>
        </div>
        <button className="primario grande" onClick={onNuovo}><Icona nome="piu" size={20} /> Nuovo cliente</button>
      </div>

      {clienti.length === 0 ? (
        <div className="vuoto">
          <div className="esempi">
            {ESEMPI.map((e, i) => (
              <button key={e.id} className="esempio glass" style={{ '--i': i }} onClick={onNuovo}>
                <Schema tipo={e.id} />
                <b>{e.nome}</b>
                <small>{e.desc}</small>
              </button>
            ))}
          </div>
          <h2>Nessun cliente, <em className="s">per ora</em></h2>
          <p>Scegli l’attività e il progetto: l’anteprima si veste su misura e il cliente sceglie lo stile.</p>
        </div>
      ) : (
        <div className="clienti">
          {clienti.map((c, i) => {
            const att = trova(ATTIVITA, c.attivita)
            const pal = trova(PALETTE, c.stile.palette)
            return (
              <button key={c.id} className="cliente-card" style={{ '--i': i }} onClick={() => onApri(c.id)}>
                <Foto att={att.id} nome="hero" className="cliente-card__foto" />
                <div className="cliente-card__velo" />
                <div className="cliente-card__corpo">
                  <span className="pill">{att.nome}</span>
                  <h3>{c.nome}</h3>
                  <div className="cliente-card__piede">
                    <span>{trova(TIPI, c.tipo).nome}</span>
                    <span className="mini-pal">{[pal.primary, pal.accent, pal.bg].map((x, k) => <i key={k} style={{ background: x }} />)}</span>
                  </div>
                </div>
              </button>
            )
          })}
          <button className="cliente-nuovo glass" onClick={onNuovo}><span><Icona nome="piu" size={26} /></span>Nuovo cliente</button>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const { clienti, crea, aggiorna, elimina, importa } = useClienti()
  const [v, setV] = useState({ n: 'home' })
  const [backup, setBackup] = useState(false)
  const cliente = v.id ? clienti.find((c) => c.id === v.id) : null

  return (
    <div className={'app' + (v.n === 'home' || v.n === 'cliente' ? ' con-rail' : '')}>
      <div className="sfondo" aria-hidden="true"><i className="orb orb--1" /><i className="orb orb--2" /><i className="orb orb--3" /><i className="orb orb--4" /></div>
      {(v.n === 'home' || v.n === 'cliente') && (
        <Rail attivo="clienti" onClienti={() => setV({ n: 'home' })} onNuovo={() => setV({ n: 'nuovo' })} onBackup={() => setBackup(true)} />
      )}
      {v.n === 'home' && <Home clienti={clienti} onNuovo={() => setV({ n: 'nuovo' })} onApri={(id) => setV({ n: 'cliente', id })} />}
      {v.n === 'nuovo' && <Nuovo onAnnulla={() => setV({ n: 'home' })} onCrea={(d) => setV({ n: 'cliente', id: crea(d) })} />}
      {v.n === 'cliente' && cliente && (
        <Cliente cliente={cliente} onBack={() => setV({ n: 'home' })} onStudio={() => setV({ n: 'studio', id: cliente.id })}
          onAggiorna={(p) => aggiorna(cliente.id, p)} onElimina={() => { elimina(cliente.id); setV({ n: 'home' }) }} />
      )}
      {v.n === 'studio' && cliente && (
        <Studio cliente={cliente} onBack={() => setV({ n: 'cliente', id: cliente.id })} onChange={(stile) => aggiorna(cliente.id, { stile })} />
      )}
      {backup && <Backup clienti={clienti} onImporta={importa} onChiudi={() => setBackup(false)} />}
    </div>
  )
}
