import { useState } from 'react'
import Cliente from './Cliente.jsx'
import Copertina from './Copertina.jsx'
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

const LINK = [
  { etichetta: 'Il mio sito', nome: 'salvatorelombardi.com', url: 'https://salvatorelombardi.com' },
  { etichetta: 'Un mio lavoro', nome: 'leterrazzesulmondo.it', url: 'https://leterrazzesulmondo.it' },
]

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

// Ricarica la pagina scaricando sempre l'ultima versione: l'indirizzo cambia ogni volta, così Safari non usa la copia vecchia.
// I clienti restano salvati sul dispositivo.
function aggiornaApp() {
  window.location.replace(window.location.pathname + '?r=' + Date.now())
}

function Rail({ attivo, onHome, onClienti, onNuovo, onBackup }) {
  const [gira, setGira] = useState(false)
  return (
    <nav className="rail" aria-label="Navigazione">
      <span className="logo punti" style={{ transform: 'scale(.9)' }}><i /><i /><i /></span>
      <div className="sep" />
      <button className={attivo === 'home' ? 'on' : ''} onClick={onHome} aria-label="Home"><Icona nome="home" /></button>
      <button className={attivo === 'clienti' ? 'on' : ''} onClick={onClienti} aria-label="Clienti"><Icona nome="clienti" /></button>
      <button onClick={onNuovo} aria-label="Nuovo cliente"><Icona nome="piu" /></button>
      <div className="sep" />
      <button onClick={onBackup} aria-label="Backup"><Icona nome="backup" /></button>
      <button className={gira ? 'gira' : ''} onClick={() => { setGira(true); setTimeout(aggiornaApp, 350) }} aria-label="Aggiorna l'app"><Icona nome="aggiorna" /></button>
    </nav>
  )
}

// Home: sempre i tre layout di partenza. Toccandone uno si crea un nuovo cliente con quel tipo già scelto.
function Home({ onNuovo }) {
  return (
    <div className="vista vista-entra">
      <div className="home-titolo">
        <div>
          <span className="eyebrow">Scegli Stile</span>
          <h1 className="titolo titolo--xl">Che sito <em>facciamo</em>?</h1>
          <p>Scegli un layout per iniziare, oppure crea un nuovo cliente.</p>
        </div>
        <button className="primario grande" onClick={() => onNuovo()}><Icona nome="piu" size={20} /> Nuovo cliente</button>
      </div>
      <div className="vuoto">
        <div className="esempi">
          {ESEMPI.map((e, i) => (
            <div key={e.id} className="esempio glass" style={{ '--i': i }} role="button" tabIndex={0} onClick={() => onNuovo(e.id)}
              onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') onNuovo(e.id) }}>
              <span className="neon" aria-hidden="true"><i /></span>
              <Schema tipo={e.id} />
              <b>{e.nome}</b>
              <small>{e.desc}</small>
            </div>
          ))}
        </div>
        <div className="link-home">
          {LINK.map((l) => (
            <a key={l.url} className="link-pill glass" href={l.url} target="_blank" rel="noopener">
              <span><small>{l.etichetta}</small><b>{l.nome}</b></span>
              <Icona nome="esterno" size={20} />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

// Clienti: tutte le card dei clienti salvati.
function Clienti({ clienti, onNuovo, onApri, onElimina }) {
  const [da, setDa] = useState(null)
  return (
    <div className="vista vista-entra">
      <div className="home-titolo">
        <div>
          <span className="eyebrow">Studio</span>
          <h1 className="titolo titolo--xl">I tuoi <em>clienti</em></h1>
          <p>{clienti.length === 0 ? 'Qui compariranno le card dei tuoi clienti.' : `${clienti.length} ${clienti.length === 1 ? 'cliente' : 'clienti'} in studio`}</p>
        </div>
        <button className="primario grande" onClick={() => onNuovo()}><Icona nome="piu" size={20} /> Nuovo cliente</button>
      </div>

      <div className="clienti">
        {clienti.map((c, i) => {
          const att = trova(ATTIVITA, c.attivita)
          const pal = trova(PALETTE, c.stile.palette)
          return (
            <div key={c.id} className="cliente-card" style={{ '--i': i }} role="button" tabIndex={0} onClick={() => onApri(c.id)}
              onKeyDown={(ev) => { if (ev.key === 'Enter') onApri(c.id) }}>
              <Foto att={att.id} nome="hero" className="cliente-card__foto" />
              <div className="cliente-card__velo" />
              <button className="cliente-x" aria-label={`Elimina ${c.nome}`} onClick={(ev) => { ev.stopPropagation(); setDa(c) }}>
                <Icona nome="x" size={18} />
              </button>
              <div className="cliente-card__corpo">
                <span className="pill">{att.nome}</span>
                <h3>{c.nome}</h3>
                <div className="cliente-card__piede">
                  <span>{trova(TIPI, c.tipo).nome}</span>
                  <span className="mini-pal">{[pal.primary, pal.accent, pal.bg].map((x, k) => <i key={k} style={{ background: x }} />)}</span>
                </div>
              </div>
            </div>
          )
        })}
        <button className="cliente-nuovo glass" onClick={() => onNuovo()}><span><Icona nome="piu" size={26} /></span>Nuovo cliente</button>
      </div>

      {da && (
        <div className="velo" onClick={() => setDa(null)}>
          <div className="finestra finestra--elimina" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
            <span className="finestra__icona"><Icona nome="cestino" size={26} /></span>
            <h3>Eliminare il cliente?</h3>
            <p className="aiuto">Sei sicuro di voler eliminare <b>{da.nome}</b>? Verranno cancellati anche stile, lingue, brief e note. Non si può annullare.</p>
            <div className="barra-piede">
              <button className="secondario" onClick={() => setDa(null)}>Annulla</button>
              <button className="pericolo" onClick={() => { onElimina(da.id); setDa(null) }}>Elimina</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const { clienti, crea, aggiorna, elimina, importa } = useClienti()
  // La copertina compare all'apertura dell'app; dopo "Aggiorna" non ricompare (sessionStorage resta nella stessa sessione).
  const [v, setV] = useState(() => {
    try { return { n: sessionStorage.getItem('scegli-stile-entrato') ? 'home' : 'copertina' } } catch { return { n: 'copertina' } }
  })
  const entra = () => {
    try { sessionStorage.setItem('scegli-stile-entrato', '1') } catch { /* modalità privata */ }
    setV({ n: 'home' })
  }
  const [backup, setBackup] = useState(false)
  const cliente = v.id ? clienti.find((c) => c.id === v.id) : null
  const conRail = v.n === 'home' || v.n === 'clienti' || v.n === 'cliente'
  const nuovo = (tipo) => setV({ n: 'nuovo', tipo })

  return (
    <div className={'app' + (conRail ? ' con-rail' : '')}>
      <div className="sfondo" aria-hidden="true"><i className="orb orb--1" /><i className="orb orb--2" /><i className="orb orb--3" /><i className="orb orb--4" /></div>
      {conRail && (
        <Rail attivo={v.n === 'home' ? 'home' : 'clienti'} onHome={() => setV({ n: 'home' })} onClienti={() => setV({ n: 'clienti' })} onNuovo={() => nuovo()} onBackup={() => setBackup(true)} />
      )}
      {v.n === 'copertina' && <Copertina onEntra={entra} />}
      {v.n === 'home' && <Home onNuovo={nuovo} />}
      {v.n === 'clienti' && <Clienti clienti={clienti} onNuovo={nuovo} onApri={(id) => setV({ n: 'cliente', id })} onElimina={elimina} />}
      {v.n === 'nuovo' && <Nuovo tipoIniziale={v.tipo} onAnnulla={() => setV({ n: 'home' })} onCrea={(d) => setV({ n: 'cliente', id: crea(d) })} />}
      {v.n === 'cliente' && cliente && (
        <Cliente cliente={cliente} onBack={() => setV({ n: 'clienti' })} onStudio={() => setV({ n: 'studio', id: cliente.id })}
          onAggiorna={(p) => aggiorna(cliente.id, p)} onElimina={() => { elimina(cliente.id); setV({ n: 'clienti' }) }} />
      )}
      {v.n === 'studio' && cliente && (
        <Studio cliente={cliente} onBack={() => setV({ n: 'cliente', id: cliente.id })} onChange={(stile) => aggiorna(cliente.id, { stile })} />
      )}
      {backup && <Backup clienti={clienti} onImporta={importa} onChiudi={() => setBackup(false)} />}
    </div>
  )
}
