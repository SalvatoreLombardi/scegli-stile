import { useEffect, useRef, useState } from 'react'
import Anteprima from './Anteprima.jsx'
import Foto from './Foto.jsx'
import Icona from './Icona.jsx'
import { PALETTE, FONT, BOTTONI, CARD, ANGOLI_CARD, RIEMPIMENTO } from './dati.js'
import { ATTIVITA, TIPI, LISTINO, RICORRENTI, BRIEF } from './attivita.js'
import SelettoreLingue from './SelettoreLingue.jsx'
import { SceltaAttivita, SceltaTipo } from './Scelte.jsx'
import { lingueCliente, linguaIniziale } from './lingue.js'
import { creaPdf } from './pdf.js'
import { trova, variabili, riepilogoCliente, temaTesto, colorePrincipale, menuTesto } from './utils.js'

export default function Cliente({ cliente: c, onBack, onStudio, onAggiorna, onElimina }) {
  const [privato, setPrivato] = useState(false)
  const [modifica, setModifica] = useState(null) // 'attivita' | 'tipo'
  const area = useRef(null)
  const timer = useRef(null)
  // L'area riservata non ha nessun segno visibile: si apre tenendo premuto il nome del cliente.
  const inizia = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setPrivato(true), 900) }
  const ferma = () => clearTimeout(timer.current)
  useEffect(() => {
    if (privato && area.current) area.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [privato])
  const [copiato, setCopiato] = useState(false)
  // Il PDF si prepara in anticipo: Safari dell'iPad apre la condivisione solo subito dopo il tocco, non dopo un'attesa.
  const [pdf, setPdf] = useState(null)
  const [pdfErrore, setPdfErrore] = useState(false)
  const [avviso, setAvviso] = useState('')
  const mostra = (m) => { setAvviso(m); setTimeout(() => setAvviso(''), 7000) }
  useEffect(() => {
    let vivo = true
    let url = null
    const t = setTimeout(async () => {
      try {
        const { blob, nomeFile } = await creaPdf(c)
        if (!vivo) return
        url = URL.createObjectURL(blob)
        setPdf({ url, nome: nomeFile, file: new File([blob], nomeFile, { type: 'application/pdf' }) })
        setPdfErrore(false)
      } catch (err) {
        if (vivo) { setPdfErrore(true); mostra('PDF non creato: ' + (err && err.message ? err.message : err)) }
      }
    }, 500)
    return () => {
      vivo = false
      clearTimeout(t)
      if (url) setTimeout(() => URL.revokeObjectURL(url), 15000)
    }
  }, [c])
  // Su iPad/iPhone il download con collegamento e la condivisione dopo un'attesa non sono affidabili:
  // il PDF si apre in una scheda di Safari, da cui si salva con il pulsante Condividi.
  const apple = typeof navigator !== 'undefined' && (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))
  const dopoClic = () => { if (apple) mostra('PDF aperto: per salvarlo tocca Condividi in alto, poi "Salva su File"') }
  const att = trova(ATTIVITA, c.attivita)
  const tipo = trova(TIPI, c.tipo)
  const s = c.stile
  const pal = trova(PALETTE, s.palette)
  const font = trova(FONT, s.font)
  const listino = LISTINO[c.tipo]
  const domande = BRIEF[c.tipo] || []
  const fatte = domande.filter((d) => c.brief?.[d.k] && c.brief[d.k].length).length
  const perc = domande.length ? Math.round((fatte / domande.length) * 100) : 0

  const setBrief = (k, v) => onAggiorna({ brief: { ...c.brief, [k]: v } })
  const toggleMulti = (k, o) => {
    const cur = c.brief?.[k] || []
    setBrief(k, cur.includes(o) ? cur.filter((x) => x !== o) : [...cur, o])
  }
  const copia = async () => {
    try {
      await navigator.clipboard.writeText(riepilogoCliente(c, ATTIVITA, TIPI, BRIEF))
      setCopiato(true)
      setTimeout(() => setCopiato(false), 2000)
    } catch { /* si può selezionare a mano */ }
  }
  const elimina = () => { if (window.confirm(`Eliminare ${c.nome}? Non si può annullare.`)) onElimina() }

  return (
    <div className="vista vista-entra">
      <button className="indietro" onClick={onBack}><Icona nome="indietro" size={18} /> Clienti</button>

      <header className="cl-testa">
        <Foto att={att.id} nome="hero" className="cl-testa__foto" />
        <div className="cl-testa__velo" />
        <a className="cl-pdf" href={pdf ? pdf.url : '#'} {...(pdf ? (apple ? { target: '_blank', rel: 'noopener' } : { download: pdf.nome }) : {})}
          onClick={(e) => { if (pdf) dopoClic(); else { e.preventDefault(); mostra(pdfErrore ? 'PDF non disponibile, riapri la pagina del cliente' : 'Sto preparando il PDF, riprova tra un attimo') } }}>
          <Icona nome="pdf" size={18} /> Scarica PDF
        </a>
        <div className="cl-testa__testo">
          <button className="pill pill--btn" onClick={() => setModifica('attivita')} aria-label="Cambia attività">{att.nome} <Icona nome="matita" size={14} /></button>
          <h1 className="titolo nome-cliente" onPointerDown={inizia} onPointerUp={ferma} onPointerLeave={ferma} onPointerCancel={ferma} onContextMenu={(e) => e.preventDefault()}>{c.nome}</h1>
          <div className="meta">
            <button className="pill pill--chiara pill--btn" onClick={() => setModifica('tipo')} aria-label="Cambia tipo di progetto"><Icona nome={tipo.id} size={16} /> {tipo.nome} <Icona nome="matita" size={14} /></button>
            {c.referente && <span className="meta__txt">Referente: {c.referente}</span>}
          </div>
        </div>
      </header>

      <section className="blocco glass">
        <div className="blocco-testa">
          <h2>Stile <em>scelto</em></h2>
          <button className="primario" onClick={onStudio}><Icona nome="pennello" size={18} /> Apri lo studio di stile</button>
        </div>
        <div className="stile-griglia">
          <div className="miniatura" style={variabili(s)}>
            <div className="miniatura__in"><Anteprima stile={s} cliente={c} lang={linguaIniziale(c)} /></div>
          </div>
          <dl className="dettagli">
            <div><dt>Colori</dt><dd>{pal.nome}<span className="mini-pal">{[colorePrincipale(s, pal), pal.accent, pal.bg, pal.text].map((x, k) => <i key={k} style={{ background: x }} />)}</span></dd></div>
            {s.coloreMarchio && <div><dt>Colore del cliente</dt><dd>{s.coloreMarchio.toUpperCase()}<span className="mini-pal"><i style={{ background: s.coloreMarchio }} /></span></dd></div>}
            <div><dt>Tema del sito</dt><dd>{temaTesto(s)}</dd></div>
            <div><dt>Font</dt><dd>{font.titoli} <small>con {font.testi}</small></dd></div>
            <div><dt>Menu</dt><dd>{menuTesto(s, c.tipo)}</dd></div>
            <div><dt>Bottoni</dt><dd>{trova(BOTTONI, s.bottone).nome}, {trova(RIEMPIMENTO, s.riempimento).nome.toLowerCase()}</dd></div>
            <div><dt>Card</dt><dd>{trova(CARD, s.card).nome}, angoli {trova(ANGOLI_CARD, s.angoli).nome.toLowerCase()}</dd></div>
          </dl>
        </div>
      </section>

      <section className="blocco glass">
        <div className="blocco-testa"><h2>Lingue del <em>sito</em></h2></div>
        <SelettoreLingue compatto valore={lingueCliente(c)} onChange={(l) => onAggiorna({ lingue: l })} />
      </section>

      {privato && (
      <section ref={area} className="blocco blocco--privato glass">
        <div className="blocco-testa">
          <h2><Icona nome="lock" size={20} /> Area <em>riservata</em></h2>
          <button className="secondario" onClick={() => setPrivato(false)}>Nascondi</button>
        </div>

        {privato && (
          <div className="privato">
            <div className="prezzo-box">
              <div>
                <small>Da listino · IVA esclusa</small>
                <b>{listino.da ? `da ${listino.da.toLocaleString('it-IT')} €` : 'Su preventivo'}</b>
                <span>{listino.nota}</span>
                <span className="muted">{RICORRENTI}</span>
              </div>
              <div className="avviso">Preventivo da inviare entro 24 ore.</div>
            </div>

            {lingueCliente(c).length > 1 && (
              <div className="avviso avviso--giallo">Sito in {lingueCliente(c).length} lingue: ricordalo nel preventivo (traduzioni, struttura dei contenuti, SEO per lingua).</div>
            )}

            {c.tipo === 'webapp' && (
              <div className="avviso avviso--giallo">
                Attenzione al divieto di concorrenza del tuo contratto: niente gestionali o software cloud simili. Per app e web app valuta caso per caso prima di accettare.
              </div>
            )}

            <h3>Brief · {perc}%</h3>
            <div className="progresso"><i style={{ width: perc + '%' }} /></div>
            {(BRIEF[c.tipo] || []).map((d) => (
              <div className="domanda" key={d.k}>
                <span className="domanda__q">{d.q}</span>
                {d.t === 'testo' ? (
                  <input value={c.brief?.[d.k] || ''} onChange={(e) => setBrief(d.k, e.target.value)} placeholder="Scrivi…" />
                ) : (
                  <div className="chips">
                    {d.o.map((o) => {
                      const on = d.t === 'multi' ? (c.brief?.[d.k] || []).includes(o) : c.brief?.[d.k] === o
                      return <button key={o} className={'chip' + (on ? ' on' : '')} onClick={() => (d.t === 'multi' ? toggleMulti(d.k, o) : setBrief(d.k, on ? '' : o))}>{o}</button>
                    })}
                  </div>
                )}
              </div>
            ))}

            <h3>Note</h3>
            <textarea rows="3" value={c.note || ''} onChange={(e) => onAggiorna({ note: e.target.value })} placeholder="Appunti dell’incontro, richieste particolari…" />

            <div className="riga-azioni">
              <button className="secondario" onClick={copia}><Icona nome="copia" size={18} /> {copiato ? 'Copiato ✓' : 'Copia riepilogo'}</button>
              <button className="pericolo" onClick={elimina}><Icona nome="cestino" size={18} /> Elimina cliente</button>
            </div>
          </div>
        )}
      </section>
      )}
      {modifica && (
        <div className="velo" onClick={() => setModifica(null)}>
          <div className="finestra finestra--scelta" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h3>{modifica === 'attivita' ? 'Cambia attività' : 'Cambia tipo di progetto'}</h3>
            {modifica === 'tipo' && Object.values(c.brief || {}).some((v) => v && v.length) && (
              <p className="aiuto">Le domande del brief sono diverse per ogni tipo di progetto: cambiandolo, le risposte già inserite vengono azzerate.</p>
            )}
            {modifica === 'attivita' ? (
              <SceltaAttivita valore={c.attivita} onScegli={(id) => { onAggiorna({ attivita: id }); setModifica(null) }} />
            ) : (
              <SceltaTipo valore={c.tipo} onScegli={(id) => { if (id !== c.tipo) onAggiorna({ tipo: id, brief: {} }); setModifica(null) }} />
            )}
            <div className="barra-piede"><button className="secondario" onClick={() => setModifica(null)}>Chiudi</button></div>
          </div>
        </div>
      )}
      {avviso && <div className="avviso-pop" role="status">{avviso}</div>}
    </div>
  )
}
