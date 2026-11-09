import { useEffect, useRef, useState } from 'react'
import Anteprima from './Anteprima.jsx'
import Icona from './Icona.jsx'
import TabBolla from './TabBolla.jsx'
import Bandiera from './Bandiera.jsx'
import { LINGUE, lingueCliente, linguaIniziale } from './lingue.js'
import { NAV_STILI, NAV_EFFETTI, CATALOGO, LOGO_DIM, PALETTE, GRUPPI_PALETTE, GRUPPI_FONT, FONT, BOTTONI, RIEMPIMENTO, CARD, ANGOLI_CARD, ATMOSFERE } from './dati.js'
import { variabili, temaChiave, colorePrincipale } from './utils.js'
import { contrasto, coloriDaFile, coloriDaUrl, paletteDaLogo, fontSimili } from './colori.js'

const ICONE_FONT = { moderno: 'f-moderno', elegante: 'elegante', tech: 'tecnologico', classico: 'f-classico', deciso: 'f-deciso', caldo: 'f-caldo', leggero: 'f-leggero' }
const PASSI = [
  { id: 'logo', nome: 'Logo', icona: 'immagine' },
  { id: 'direzione', nome: 'Direzione', icona: 'atmosfera' },
  { id: 'colori', nome: 'Colori', icona: 'colori' },
  { id: 'font', nome: 'Font', icona: 'font' },
  { id: 'menu', nome: 'Menu', icona: 'menu' },
  { id: 'forma', nome: 'Forma', icona: 'bottoni' },
]
const tasto = (fn) => ({ role: 'button', tabIndex: 0, onClick: fn, onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn() } } })

// Componenti definiti fuori da Studio: restano gli stessi a ogni modifica (altrimenti il selettore dei colori si chiuderebbe).
function LingueSwitch({ lingue, lang, setLang, classe = '' }) {
  if (lingue.length < 2) return null
  return (
    <div className={'lingua-switch ' + classe} role="group" aria-label="Lingua dell'anteprima">
      {lingue.map((x) => {
        const l = LINGUE.find((y) => y.id === x.id)
        return (
          <button key={x.id} className={lang === x.id ? 'on' : ''} onClick={() => setLang(x.id)} aria-pressed={lang === x.id}>
            <Bandiera id={l.id} size={26} />{lang === x.id && <b>{l.nativo}</b>}
          </button>
        )
      })}
    </div>
  )
}

function BloccoColoreCliente({ s, palAttuale, imposta, togli, pocoContrasto, usaLogo }) {
  return (
    <>
      <div className={'marchio-sel' + (s.coloreMarchio ? ' on' : '')}>
        <label className="marchio-sel__corpo">
          <span className="marchio-sel__pallino" style={{ background: colorePrincipale(s, palAttuale) }} />
          <span className="marchio-sel__testo"><b>Colore del cliente</b><small>{s.coloreMarchio ? s.coloreMarchio.toUpperCase() : 'Tocca per sceglierlo'}</small></span>
          <input type="color" className="marchio-sel__input" aria-label="Colore del cliente" value={s.coloreMarchio || palAttuale.primary} onChange={(e) => imposta('coloreMarchio', e.target.value)} />
        </label>
        {s.coloreMarchio && <button className="marchio-sel__togli" onClick={togli}>Togli</button>}
      </div>
      {usaLogo && !s.coloreMarchio && <button className="secondario marchio-sel__usa" onClick={usaLogo}>Usa i colori del logo</button>}
      {pocoContrasto && <p className="aiuto marchio-sel__avviso">Questo colore si legge poco sullo sfondo.</p>}
    </>
  )
}

// Disegnino dello stile di barra in alto.
function MiniNav({ id }) {
  const v = [<i key="a" className="mn-v" />, <i key="b" className="mn-v" />]
  return (
    <span className={'mini-nav mini-nav--' + id} aria-hidden="true">
      {id === 'centrata' && <>{v}<i className="mn-logo" /><i className="mn-v" /><i className="mn-b" /></>}
      {id === 'panino' && <><i className="mn-logo" /><i className="mn-flex" /><i className="mn-burger"><u /><u /><u /></i></>}
      {id === 'pillola' && <span className="mn-pill"><i className="mn-logo" /><i className="mn-flex" />{v}<i className="mn-b" /></span>}
      {(id === 'classica' || id === 'trasparente' || id === 'piena') && <><i className="mn-logo" /><i className="mn-flex" />{v}<i className="mn-b" /></>}
    </span>
  )
}

function TileFont({ f, testo, on, onClick, i = 0 }) {
  return (
    <button style={{ '--i': i }} className={'opzione opzione--font' + (on ? ' on' : '')} onClick={onClick}>
      <span className="esempio-font" style={{ fontFamily: `'${f.titoli}', serif`, fontWeight: f.pesoTitoli }}>{testo}</span>
      <small>{f.titoli} · con {f.testi}</small>
    </button>
  )
}

export default function Studio({ cliente, onBack, onChange, onLogo }) {
  const s = cliente.stile
  const sRef = useRef(s)
  sRef.current = s
  const [passo, setPasso] = useState('logo')
  const [piena, setPiena] = useState(false) // anteprima a schermo intero
  const [lang, setLang] = useState(() => linguaIniziale(cliente))
  const lingue = lingueCliente(cliente)
  const pagina = useRef(null)
  const i = PASSI.findIndex((p) => p.id === passo)
  const vai = (id) => { setPasso(id); if (pagina.current) pagina.current.scrollTo(0, 0) }

  const imposta = (k, v) => onChange({ ...sRef.current, [k]: v })
  const palAttuale = PALETTE.find((p) => p.id === s.palette) || PALETTE[0]
  const [gruppoId, setGruppoId] = useState(() => (GRUPPI_PALETTE.find((g) => g.palette.some((p) => p.id === s.palette)) || GRUPPI_PALETTE[0]).id)
  const gruppo = GRUPPI_PALETTE.find((g) => g.id === gruppoId)
  const [gruppoFontId, setGruppoFontId] = useState(() => (GRUPPI_FONT.find((g) => g.font.some((f) => f.id === s.font)) || GRUPPI_FONT[0]).id)
  const gruppoFont = GRUPPI_FONT.find((g) => g.id === gruppoFontId)
  const tema = temaChiave(s)
  const [logo, setLogo] = useState(null) // colori trovati nel logo
  const [simili, setSimili] = useState(null) // font più vicini al logo: [{id, punti}] oppure null se non ancora cercati
  const [cerca, setCerca] = useState(0) // percentuale della ricerca dei font
  const vars = variabili(s)
  const pocoContrasto = !!s.coloreMarchio && contrasto(s.coloreMarchio, vars['--bg']) < 3
  const scegliTema = (t) => onChange({ ...sRef.current, temaModo: t === 'entrambi' ? 'entrambi' : 'solo', scuro: t === 'scuro' ? true : t === 'chiaro' ? false : sRef.current.scuro })
  const scegliPalette = (p) => onChange({ ...sRef.current, palette: p.id, coloreMarchio: '', coloreAccento: '', scuro: p.dark ? true : palAttuale?.dark ? false : sRef.current.scuro })
  const coloriLogo = logo && logo.colori.length > 0 ? logo.colori : null
  const applicaColoriLogo = () => {
    const c0 = coloriLogo[0], c1 = coloriLogo[1]
    onChange({ ...sRef.current, coloreMarchio: c0, coloreAccento: c1 && contrasto(c0, c1) > 1.2 ? c1 : '' })
  }
  const togliColori = () => onChange({ ...sRef.current, coloreMarchio: '', coloreAccento: '' })

  // Cerca i font più vicini al logo; se richiesto applica il primo.
  const cercaFont = async (url, applica) => {
    setCerca(1)
    try {
      const r = await fontSimili(url, [cliente.nome, cliente.nome.toUpperCase()], FONT, (n, t) => setCerca(Math.round((n / t) * 100)))
      setSimili(r)
      if (applica && r.length) onChange({ ...sRef.current, font: r[0].id })
    } catch { setSimili([]) }
    setCerca(0)
  }

  // Il logo salvato dà subito i suoi colori, anche dopo aver chiuso e riaperto l'app.
  useEffect(() => {
    if (cliente.logo && !logo) coloriDaUrl(cliente.logo).then((r) => setLogo({ colori: r.colori })).catch(() => {})
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (passo === 'font' && cliente.logo && simili === null && !cerca) cercaFont(cliente.logo, false)
  }, [passo]) // eslint-disable-line react-hooks/exhaustive-deps

  const [trascina, setTrascina] = useState(false) // un'immagine sta passando sopra al riquadro del logo
  const [stato, setStato] = useState('') // '', 'leggo' oppure il testo di un errore
  const elabora = async (f) => {
    setStato('leggo')
    try {
      const r = await coloriDaFile(f)
      setLogo({ colori: r.colori })
      if (r.anteprima && onLogo) onLogo(r.anteprima)
      // Dal logo partono subito: colore principale e secondo colore, la palette più vicina e i font più simili.
      const pal = paletteDaLogo(r.colori, PALETTE)
      const c0 = r.colori[0], c1 = r.colori[1]
      const lontano = c0 && c1 && contrasto(c0, c1) > 1.2
      onChange({ ...sRef.current, coloreMarchio: c0 || '', coloreAccento: lontano ? c1 : '', ...(pal ? { palette: pal.id, scuro: false } : {}) })
      if (pal) setGruppoId((GRUPPI_PALETTE.find((g) => g.palette.some((p) => p.id === pal.id)) || GRUPPI_PALETTE[0]).id)
      setStato('')
      if (r.anteprima) cercaFont(r.anteprima, true)
    } catch (err) {
      setLogo({ colori: [], errore: true })
      setStato('Non riesco a leggere questa foto (' + ((err && err.message) || 'errore') + "). Prova con un'altra, oppure salvala come JPG o PNG.")
    }
  }

  return (
    <div className="studio2 vista-entra">
      <header className="studio2__testa">
        <button className="indietro" onClick={onBack}><Icona nome="indietro" size={18} /> {cliente.nome}</button>
        <TabBolla voci={PASSI} attivo={passo} onScegli={vai} />
        <button className="secondario studio2__piena" onClick={() => setPiena(true)} aria-label="Anteprima a schermo intero"><Icona nome="schermo" size={20} /></button>
      </header>

      <div className="studio2__corpo">
        <aside className="studio2__comandi">
          <main className="studio2__pagina" ref={pagina}>
            {passo === 'logo' && (
              <section className="passo-pag">
                <h2 className="passo-pag__titolo">Il <em>logo</em></h2>
                <p className="passo-pag__testo">Dal logo trovo colori, palette e font simili. Poi cambi tutto come vuoi.</p>
                <div className={'logo-pagina' + (trascina ? ' trascina' : '')}
                  onDragOver={(e) => { e.preventDefault(); setTrascina(true) }} onDragLeave={() => setTrascina(false)}
                  onDrop={(e) => {
                    e.preventDefault(); setTrascina(false)
                    const f = [...((e.dataTransfer && e.dataTransfer.files) || [])].find((x) => x.type.indexOf('image/') === 0)
                    if (f) elabora(f)
                  }}>
                  {cliente.logo ? <img src={cliente.logo} alt="Logo del cliente" /> : <div className="logo-pagina__vuoto"><Icona nome="immagine" size={30} /></div>}
                  <div className="logo-pagina__azioni">
                    <b className="logo-pagina__grande">{cliente.logo ? 'Trascina qui un altro logo' : 'Trascina qui il logo'}</b>
                    <small>Foto a fianco dell'app (Split View): tieni premuto sul logo e trascinalo qui.</small>
                    {stato === 'leggo' && <small className="logo-stato">Leggo il logo…</small>}
                    {cerca > 0 && <small className="logo-stato">Cerco i font simili… {cerca}%</small>}
                    {stato && stato !== 'leggo' && <small className="logo-stato logo-stato--errore">{stato}</small>}
                  </div>
                </div>
                {cliente.logo && (
                  <>
                    <div className="campione-sel logo-dim" role="radiogroup" aria-label="Grandezza del logo nel sito">
                      <span className="logo-dim__titolo">Grandezza</span>
                      {LOGO_DIM.map((d) => (
                        <button key={d.id} role="radio" aria-checked={(s.logoDim || 'medio') === d.id} className={(s.logoDim || 'medio') === d.id ? 'on' : ''} onClick={() => imposta('logoDim', d.id)}>{d.nome}</button>
                      ))}
                    </div>
                    <button className="pericolo logo-pagina__togli" onClick={() => { if (onLogo) onLogo(''); setLogo(null); setStato(''); setSimili(null) }}>
                      <Icona nome="cestino" size={16} /> Togli il logo
                    </button>
                  </>
                )}
                {logo && logo.colori.length > 0 && (
                  <div className="logo-trovati">
                    <h4>Colori del logo</h4>
                    <div className="logo-colori__sw">
                      {logo.colori.map((c) => (
                        <button key={c} style={{ background: c }} className={s.coloreMarchio && s.coloreMarchio.toLowerCase() === c ? 'on' : ''} aria-label={'Usa ' + c} onClick={() => imposta('coloreMarchio', c)} />
                      ))}
                    </div>
                  </div>
                )}
                <BloccoColoreCliente s={s} palAttuale={palAttuale} imposta={imposta} togli={togliColori} pocoContrasto={pocoContrasto} usaLogo={coloriLogo ? applicaColoriLogo : null} />
              </section>
            )}

            {passo === 'direzione' && (
              <section className="passo-pag">
                <h2 className="passo-pag__titolo">Che <em>direzione</em>?</h2>
                <p className="passo-pag__testo">Solo un punto di partenza veloce. Rifinisci nei passi dopo.</p>
                <div className="direzioni">
                  {ATMOSFERE.map((a) => {
                    const pal = PALETTE.find((p) => p.id === a.set.palette)
                    return (
                      <div key={a.id} className="direzione glass" {...tasto(() => onChange({ ...sRef.current, ...a.set, coloreMarchio: '', coloreAccento: '' }))}>
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
                <h2 className="passo-pag__titolo"><em>Colori</em> e tema</h2>
                <BloccoColoreCliente s={s} palAttuale={palAttuale} imposta={imposta} togli={togliColori} pocoContrasto={pocoContrasto} usaLogo={coloriLogo ? applicaColoriLogo : null} />
                <div className="tema-sel" role="radiogroup" aria-label="Tema del sito">
                  <div className="tema-sel__righe">
                    {[['chiaro', 'Chiaro', 'sole'], ['scuro', 'Scuro', 'luna'], ['entrambi', 'Entrambi', 'tema']].map(([id, nome, icona]) => (
                      <button key={id} role="radio" aria-checked={tema === id} className={tema === id ? 'on' : ''} onClick={() => scegliTema(id)}>
                        <Icona nome={icona} size={16} />{nome}
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
                <h2 className="passo-pag__titolo">Il <em>font</em></h2>
                {cliente.logo && (
                  <div className="conf-logo"><img src={cliente.logo} alt="Logo del cliente" /></div>
                )}
                {cerca > 0 && <p className="aiuto">Cerco i font più simili al logo… {cerca}%</p>}
                {simili && simili.length > 0 && (
                  <>
                    <div className="gruppo-testa"><b>Simili al logo</b><span>Ordinati per somiglianza di forma: indicativi, scegli a occhio.</span></div>
                    <div className="lista">
                      {simili.slice(0, 5).map((r, k) => {
                        const f = FONT.find((x) => x.id === r.id)
                        return f ? <TileFont key={r.id} i={k} f={f} testo={cliente.nome} on={s.font === f.id} onClick={() => imposta('font', f.id)} /> : null
                      })}
                    </div>
                  </>
                )}
                {!cliente.logo && <p className="aiuto">Carica il logo nel primo passo e qui compaiono i font più simili.</p>}
                <TabBolla compatta voci={GRUPPI_FONT.map((g) => ({ id: g.id, nome: g.nome, icona: ICONE_FONT[g.id] }))} attivo={gruppoFont.id} onScegli={setGruppoFontId} />
                <div className="gruppo-testa" key={gruppoFont.id}><b>{gruppoFont.nome}</b><span>{gruppoFont.note}</span></div>
                <div className="lista" key={'f' + gruppoFont.id}>
                  {gruppoFont.font.map((f, k) => <TileFont key={f.id} i={k} f={f} testo={cliente.nome} on={s.font === f.id} onClick={() => imposta('font', f.id)} />)}
                </div>
              </section>
            )}

            {passo === 'menu' && (
              <section className="passo-pag">
                <h2 className="passo-pag__titolo">Il <em>menu</em></h2>
                {cliente.tipo === 'webapp' ? (
                  <p className="passo-pag__testo">Nelle web app il menu è la barra laterale a sinistra: non ci sono stili di barra in alto da scegliere.</p>
                ) : (
                  <>
                    <h4>Barra in alto</h4>
                    <div className="navs">
                      {NAV_STILI.map((n) => (
                        <button key={n.id} className={'nav-tile' + ((s.navStile || 'classica') === n.id ? ' on' : '')} onClick={() => imposta('navStile', n.id)}>
                          <MiniNav id={n.id} />
                          <b>{n.nome}</b>
                          <small>{n.desc}</small>
                        </button>
                      ))}
                    </div>
                    {cliente.tipo === 'landing' && <p className="aiuto">Nella landing page la barra trasparente diventa classica: sotto non c'è una foto.</p>}
                    <h4>Quando scorri la pagina</h4>
                    <div className="segmenti">
                      {NAV_EFFETTI.map((e) => (
                        <button key={e.id} className={(s.navEffetto || 'nessuno') === e.id ? 'on' : ''} onClick={() => imposta('navEffetto', e.id)}>{e.nome}</button>
                      ))}
                    </div>
                    <p className="aiuto">Per vedere l'effetto scorri l'anteprima.</p>
                    {cliente.tipo === 'ecommerce' && (
                      <>
                        <h4>Catalogo prodotti</h4>
                        <div className="segmenti">
                          {CATALOGO.map((c) => (
                            <button key={c.id} className={(s.catalogo || 'sopra') === c.id ? 'on' : ''} onClick={() => imposta('catalogo', c.id)}>{c.nome}</button>
                          ))}
                        </div>
                        <p className="aiuto">La barra laterale mostra categorie, prezzo e filtri accanto ai prodotti.</p>
                      </>
                    )}
                  </>
                )}
              </section>
            )}

            {passo === 'forma' && (
              <section className="passo-pag">
                <h2 className="passo-pag__titolo"><em>Forma</em></h2>
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
                <h4>Card · stile</h4>
                <div className="segmenti">
                  {CARD.map((c) => (
                    <button key={c.id} className={s.card === c.id ? 'on' : ''} onClick={() => imposta('card', c.id)}>{c.nome}</button>
                  ))}
                </div>
                <h4>Card · angoli</h4>
                <div className="segmenti">
                  {ANGOLI_CARD.map((a) => (
                    <button key={a.id} className={s.angoli === a.id ? 'on' : ''} onClick={() => imposta('angoli', a.id)}>{a.nome}</button>
                  ))}
                </div>
              </section>
            )}
          </main>

          <div className="nav-passi">
            <button className="secondario" disabled={i === 0} onClick={() => vai(PASSI[i - 1].id)} aria-label="Indietro"><Icona nome="indietro" size={18} /></button>
            <span className="nav-passi__n">{i + 1} / {PASSI.length}</span>
            {i < PASSI.length - 1
              ? <button className="primario" onClick={() => vai(PASSI[i + 1].id)}>Avanti <Icona nome="avanti" size={16} /></button>
              : <button className="primario" onClick={onBack}><Icona nome="check" size={16} /> Fatto</button>}
          </div>
        </aside>

        <section className="studio2__anteprima">
          <div className="sito" style={vars}>
            <Anteprima stile={s} cliente={cliente} lang={lang} onTema={() => imposta('scuro', !sRef.current.scuro)} />
          </div>
          <LingueSwitch lingue={lingue} lang={lang} setLang={setLang} />
        </section>
      </div>

      {piena && (
        <div className="anteprima-piena" style={vars}>
          <div className="sito sito--pieno">
            <Anteprima stile={s} cliente={cliente} lang={lang} onTema={() => imposta('scuro', !sRef.current.scuro)} />
          </div>
          <button className="piena-chiudi" onClick={() => setPiena(false)} aria-label="Chiudi l'anteprima"><Icona nome="x" size={20} /> Chiudi</button>
          <LingueSwitch lingue={lingue} lang={lang} setLang={setLang} />
        </div>
      )}
    </div>
  )
}
