import { useEffect, useRef, useState } from 'react'
import Anteprima from './Anteprima.jsx'
import Icona from './Icona.jsx'
import TabBolla from './TabBolla.jsx'
import Bandiera from './Bandiera.jsx'
import { LINGUE, lingueCliente, linguaIniziale } from './lingue.js'
import { PALETTE, GRUPPI_PALETTE, GRUPPI_FONT, BOTTONI, RIEMPIMENTO, CARD, ANGOLI_CARD, ATMOSFERE } from './dati.js'
import { variabili, temaChiave, colorePrincipale } from './utils.js'
import { contrasto, coloriDaFile, coloriDaUrl } from './colori.js'

const ICONE_FONT = { moderno: 'f-moderno', elegante: 'elegante', tech: 'tecnologico', classico: 'f-classico', deciso: 'f-deciso', caldo: 'f-caldo', leggero: 'f-leggero' }
const PASSI = [
  { id: 'logo', nome: 'Logo', icona: 'immagine' },
  { id: 'direzione', nome: 'Direzione', icona: 'atmosfera' },
  { id: 'colori', nome: 'Colori', icona: 'colori' },
  { id: 'font', nome: 'Font', icona: 'font' },
  { id: 'forma', nome: 'Forma', icona: 'bottoni' },
]
const tasto = (fn) => ({ role: 'button', tabIndex: 0, onClick: fn, onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn() } } })

// Componenti definiti fuori da Studio: restano gli stessi a ogni modifica (altrimenti il selettore dei colori si chiuderebbe).
function Selettore({ classe, onFile, children }) {
  return <label className={classe}>{children}<input type="file" accept="image/*" onChange={onFile} /></label>
}

function LingueSwitch({ lingue, lang, setLang, classe = '' }) {
  if (lingue.length < 2) return null
  return (
    <div className={'lingua-switch ' + classe} role="group" aria-label="Lingua dell'anteprima">
      {lingue.map((x) => {
        const l = LINGUE.find((y) => y.id === x.id)
        return (
          <button key={x.id} className={lang === x.id ? 'on' : ''} onClick={() => setLang(x.id)} aria-pressed={lang === x.id}>
            <Bandiera id={l.id} size={30} />{lang === x.id && <b>{l.nativo}</b>}
          </button>
        )
      })}
    </div>
  )
}

function BloccoColoreCliente({ s, palAttuale, imposta, pocoContrasto }) {
  return (
    <>
      <div className={'marchio-sel' + (s.coloreMarchio ? ' on' : '')}>
        <label className="marchio-sel__corpo">
          <span className="marchio-sel__pallino" style={{ background: colorePrincipale(s, palAttuale) }} />
          <span className="marchio-sel__testo"><b>Il colore del cliente</b><small>{s.coloreMarchio ? s.coloreMarchio.toUpperCase() : 'Tocca per scegliere il colore del suo logo'}</small></span>
          <input type="color" className="marchio-sel__input" aria-label="Colore del cliente" value={s.coloreMarchio || palAttuale.primary} onChange={(e) => imposta('coloreMarchio', e.target.value)} />
        </label>
        {s.coloreMarchio && <button className="marchio-sel__togli" onClick={() => imposta('coloreMarchio', '')}>Togli</button>}
      </div>
      {pocoContrasto && <p className="aiuto marchio-sel__avviso">Questo colore si legge poco sullo sfondo: link e bordi risulteranno deboli.</p>}
    </>
  )
}

export default function Studio({ cliente, onBack, onChange, onLogo }) {
  const s = cliente.stile
  const [passo, setPasso] = useState('logo')
  const [piena, setPiena] = useState(false) // anteprima a schermo intero
  const [lang, setLang] = useState(() => linguaIniziale(cliente))
  const lingue = lingueCliente(cliente)
  const pagina = useRef(null)
  const i = PASSI.findIndex((p) => p.id === passo)
  const vai = (id) => { setPasso(id); if (pagina.current) pagina.current.scrollTo(0, 0) }

  const imposta = (k, v) => onChange({ ...s, [k]: v })
  const palAttuale = PALETTE.find((p) => p.id === s.palette) || PALETTE[0]
  const [gruppoId, setGruppoId] = useState(() => (GRUPPI_PALETTE.find((g) => g.palette.some((p) => p.id === s.palette)) || GRUPPI_PALETTE[0]).id)
  const gruppo = GRUPPI_PALETTE.find((g) => g.id === gruppoId)
  const [gruppoFontId, setGruppoFontId] = useState(() => (GRUPPI_FONT.find((g) => g.font.some((f) => f.id === s.font)) || GRUPPI_FONT[0]).id)
  const gruppoFont = GRUPPI_FONT.find((g) => g.id === gruppoFontId)
  const tema = temaChiave(s)
  const [campione, setCampione] = useState('cliente') // nei font: nome del cliente o nome del font
  const [logo, setLogo] = useState(null) // colori trovati nel logo
  const vars = variabili(s)
  const pocoContrasto = !!s.coloreMarchio && contrasto(s.coloreMarchio, vars['--bg']) < 3
  const scegliTema = (t) => onChange({ ...s, temaModo: t === 'entrambi' ? 'entrambi' : 'solo', scuro: t === 'scuro' ? true : t === 'chiaro' ? false : s.scuro })
  const scegliPalette = (p) => onChange({ ...s, palette: p.id, scuro: p.dark ? true : palAttuale?.dark ? false : s.scuro })

  // Il logo salvato dà subito i suoi colori, anche dopo aver chiuso e riaperto l'app.
  useEffect(() => {
    if (cliente.logo && !logo) coloriDaUrl(cliente.logo).then((r) => setLogo({ colori: r.colori })).catch(() => {})
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const leggiLogo = async (e) => {
    const f = e.target.files && e.target.files[0]
    e.target.value = ''
    if (!f) return
    try {
      const r = await coloriDaFile(f)
      setLogo({ colori: r.colori })
      if (r.anteprima && onLogo) onLogo(r.anteprima)
    } catch { setLogo({ colori: [], errore: true }) }
  }

  return (
    <div className="studio2 vista-entra">
      <header className="studio2__testa">
        <button className="indietro" onClick={onBack}><Icona nome="indietro" size={18} /> {cliente.nome}</button>
        <TabBolla voci={PASSI} attivo={passo} onScegli={vai} />
        <button className="secondario studio2__piena" onClick={() => setPiena(true)}><Icona nome="schermo" size={18} /> Anteprima</button>
      </header>

      <div className="studio2__corpo">
        <main className="studio2__pagina" ref={pagina}>
          {passo === 'logo' && (
            <section className="passo-pag">
              <span className="eyebrow">Passo 1 di {PASSI.length}</span>
              <h2 className="passo-pag__titolo">Il <em>logo</em> del cliente</h2>
              <p className="passo-pag__testo">Parti da qui: dal logo trovo i colori e lo uso per confrontare i font. Puoi cambiare tutto nei passi dopo, oppure saltare se non ce l’ha.</p>
              <div className="logo-pagina">
                {cliente.logo ? <img src={cliente.logo} alt="Logo del cliente" /> : <div className="logo-pagina__vuoto"><Icona nome="immagine" size={44} /></div>}
                <div className="logo-pagina__azioni">
                  <Selettore classe="primario grande logo-pagina__carica" onFile={leggiLogo}><Icona nome="immagine" size={20} /> {cliente.logo ? 'Cambia il logo' : 'Carica il logo'}</Selettore>
                  <small>Foto o immagine: meglio su sfondo bianco o trasparente.</small>
                </div>
              </div>
              {logo && (
                <div className="blocco glass logo-trovati">
                  {logo.colori.length > 0 ? (
                    <>
                      <h3>Colori trovati nel logo</h3>
                      <p className="aiuto">Tocca quello che vuoi usare come colore del sito.</p>
                      <div className="logo-colori__sw logo-colori__sw--grandi">
                        {logo.colori.map((c) => (
                          <button key={c} style={{ background: c }} className={s.coloreMarchio && s.coloreMarchio.toLowerCase() === c ? 'on' : ''} aria-label={'Usa ' + c} onClick={() => imposta('coloreMarchio', c)} />
                        ))}
                      </div>
                    </>
                  ) : <p className="aiuto">{logo.errore ? 'Non riesco a leggere questa immagine.' : 'Non ho trovato colori: prova con una foto più nitida o con sfondo bianco.'}</p>}
                </div>
              )}
              <BloccoColoreCliente s={s} palAttuale={palAttuale} imposta={imposta} pocoContrasto={pocoContrasto} />
            </section>
          )}

          {passo === 'direzione' && (
            <section className="passo-pag">
              <span className="eyebrow">Passo 2 di {PASSI.length}</span>
              <h2 className="passo-pag__titolo">Che <em>direzione</em> prendiamo?</h2>
              <p className="passo-pag__testo">È solo un punto di partenza veloce: scegli quella che si avvicina di più, poi rifinisci colori, font e forme nei passi dopo.{s.coloreMarchio ? ' Il colore del cliente resta.' : ''}</p>
              <div className="direzioni">
                {ATMOSFERE.map((a) => {
                  const pal = PALETTE.find((p) => p.id === a.set.palette)
                  return (
                    <div key={a.id} className="direzione glass" {...tasto(() => onChange({ ...s, ...a.set }))}>
                      <span className="strisce"><i style={{ background: pal.primary }} /><i style={{ background: pal.accent }} /><i style={{ background: pal.bg }} /><i style={{ background: pal.text }} /></span>
                      <b>{a.nome}</b>
                      <small>{a.desc}</small>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {passo === 'colori' && (
            <section className="passo-pag">
              <span className="eyebrow">Passo 3 di {PASSI.length}</span>
              <h2 className="passo-pag__titolo"><em>Colori</em> e tema</h2>
              <BloccoColoreCliente s={s} palAttuale={palAttuale} imposta={imposta} pocoContrasto={pocoContrasto} />
              <div className="tema-sel tema-sel--largo" role="radiogroup" aria-label="Tema del sito">
                <span className="tema-sel__titolo">Tema del sito</span>
                <div className="tema-sel__righe">
                  {[['chiaro', 'Chiaro', 'sole'], ['scuro', 'Scuro', 'luna'], ['entrambi', 'Entrambi', 'tema']].map(([id, nome, icona]) => (
                    <button key={id} role="radio" aria-checked={tema === id} className={tema === id ? 'on' : ''} onClick={() => scegliTema(id)}>
                      <Icona nome={icona} size={17} />{nome}
                    </button>
                  ))}
                </div>
              </div>
              <TabBolla compatta voci={GRUPPI_PALETTE.map((g) => ({ id: g.id, nome: g.nome, icona: g.icona }))} attivo={gruppo.id} onScegli={setGruppoId} />
              <div className="gruppo-testa" key={gruppo.id}><b>{gruppo.nome}</b><span>{gruppo.desc}</span></div>
              <div className="griglia-colori" key={'g' + gruppo.id}>
                {gruppo.palette.map((p, k) => (
                  <button key={p.id} style={{ '--i': k }} className={'colore' + (s.palette === p.id ? ' on' : '')} onClick={() => scegliPalette(p)}>
                    <span className="strisce"><i style={{ background: p.primary }} /><i style={{ background: p.accent }} /><i style={{ background: p.bg }} /><i style={{ background: p.text }} /></span>
                    {p.nome}
                  </button>
                ))}
              </div>
            </section>
          )}

          {passo === 'font' && (
            <section className="passo-pag">
              <span className="eyebrow">Passo 4 di {PASSI.length}</span>
              <h2 className="passo-pag__titolo">Il <em>font</em></h2>
              <div className="conf-logo">
                {cliente.logo ? (
                  <>
                    <img src={cliente.logo} alt="Logo del cliente" />
                    <Selettore classe="conf-logo__cambia" onFile={leggiLogo}>Cambia</Selettore>
                  </>
                ) : (
                  <Selettore classe="conf-logo__aggiungi" onFile={leggiLogo}><Icona nome="immagine" size={18} /> Aggiungi il logo per confrontare</Selettore>
                )}
              </div>
              <div className="campione-sel" role="radiogroup" aria-label="Cosa scrivere nei font">
                <button role="radio" aria-checked={campione === 'cliente'} className={campione === 'cliente' ? 'on' : ''} onClick={() => setCampione('cliente')}>Nome del cliente</button>
                <button role="radio" aria-checked={campione === 'font'} className={campione === 'font' ? 'on' : ''} onClick={() => setCampione('font')}>Nome del font</button>
              </div>
              <TabBolla compatta voci={GRUPPI_FONT.map((g) => ({ id: g.id, nome: g.nome, icona: ICONE_FONT[g.id] }))} attivo={gruppoFont.id} onScegli={setGruppoFontId} />
              <div className="gruppo-testa" key={gruppoFont.id}><b>{gruppoFont.nome}</b><span>{gruppoFont.note}</span></div>
              <div className="lista lista--griglia" key={'f' + gruppoFont.id}>
                {gruppoFont.font.map((f, k) => (
                  <button key={f.id} style={{ '--i': k }} className={'opzione opzione--font' + (s.font === f.id ? ' on' : '')} onClick={() => imposta('font', f.id)}>
                    <span className="esempio-font" style={{ fontFamily: `'${f.titoli}', serif`, fontWeight: f.pesoTitoli }}>{campione === 'cliente' ? cliente.nome : f.titoli}</span>
                    <small style={campione === 'cliente' ? undefined : { fontFamily: `'${f.testi}', sans-serif` }}>{campione === 'cliente' ? `${f.titoli} · con ${f.testi}` : `con ${f.testi}: il tuo testo si legge così`}</small>
                  </button>
                ))}
              </div>
            </section>
          )}

          {passo === 'forma' && (
            <section className="passo-pag">
              <span className="eyebrow">Passo 5 di {PASSI.length}</span>
              <h2 className="passo-pag__titolo"><em>Forma</em> di bottoni e card</h2>
              <div className="forma-colonne">
                <div>
                  <h4>Bottoni · forma</h4>
                  <div className="segmenti">
                    {BOTTONI.map((b) => (
                      <button key={b.id} className={s.bottone === b.id ? 'on' : ''} onClick={() => imposta('bottone', b.id)}>
                        <i className="forma" style={{ borderRadius: b.raggio }} />{b.nome}
                      </button>
                    ))}
                  </div>
                  <h4>Bottoni · riempimento</h4>
                  <div className="segmenti">
                    {RIEMPIMENTO.map((r) => (
                      <button key={r.id} className={s.riempimento === r.id ? 'on' : ''} onClick={() => imposta('riempimento', r.id)}>{r.nome}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4>Card · stile</h4>
                  <div className="lista">
                    {CARD.map((c) => (
                      <button key={c.id} className={'opzione' + (s.card === c.id ? ' on' : '')} onClick={() => imposta('card', c.id)}>
                        <span>{c.nome}</span><small>{c.note}</small>
                      </button>
                    ))}
                  </div>
                  <h4>Card · angoli</h4>
                  <div className="segmenti">
                    {ANGOLI_CARD.map((a) => (
                      <button key={a.id} className={s.angoli === a.id ? 'on' : ''} onClick={() => imposta('angoli', a.id)}>{a.nome}</button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>

        <aside className="studio2__lato">
          <div className="mini-anteprima" style={vars} {...tasto(() => setPiena(true))} aria-label="Apri l'anteprima a schermo intero">
            <div className="mini-anteprima__in" aria-hidden="true"><Anteprima stile={s} cliente={cliente} lang={lang} /></div>
            <span className="mini-anteprima__etichetta"><Icona nome="schermo" size={16} /> Schermo intero</span>
          </div>
          <LingueSwitch lingue={lingue} lang={lang} setLang={setLang} classe="lingua-switch--statico" />
        </aside>
      </div>

      <div className="nav-passi">
        <button className="secondario" disabled={i === 0} onClick={() => vai(PASSI[i - 1].id)}><Icona nome="indietro" size={18} /> Indietro</button>
        <span className="nav-passi__n">{i + 1} / {PASSI.length}</span>
        {i < PASSI.length - 1
          ? <button className="primario" onClick={() => vai(PASSI[i + 1].id)}>Avanti <Icona nome="avanti" size={18} /></button>
          : <button className="primario" onClick={onBack}><Icona nome="check" size={18} /> Fatto</button>}
      </div>

      {piena && (
        <div className="anteprima-piena" style={vars}>
          <div className="sito sito--pieno">
            <Anteprima stile={s} cliente={cliente} lang={lang} onTema={() => imposta('scuro', !s.scuro)} />
          </div>
          <button className="piena-chiudi" onClick={() => setPiena(false)} aria-label="Chiudi l'anteprima"><Icona nome="x" size={20} /> Chiudi</button>
          <LingueSwitch lingue={lingue} lang={lang} setLang={setLang} />
        </div>
      )}
    </div>
  )
}
