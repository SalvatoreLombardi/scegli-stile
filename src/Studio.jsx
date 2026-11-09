import { useState } from 'react'
import Anteprima from './Anteprima.jsx'
import Icona from './Icona.jsx'
import TabBolla from './TabBolla.jsx'
import Bandiera from './Bandiera.jsx'
import { LINGUE, lingueCliente, linguaIniziale } from './lingue.js'
import { PALETTE, GRUPPI_PALETTE, GRUPPI_FONT, FONT, BOTTONI, RIEMPIMENTO, CARD, ANGOLI_CARD, ATMOSFERE } from './dati.js'
import { variabili, temaChiave, colorePrincipale } from './utils.js'
import { contrasto, coloriDaFile } from './colori.js'

const ICONE_FONT = { moderno: 'f-moderno', elegante: 'elegante', tech: 'tecnologico', classico: 'f-classico', deciso: 'f-deciso', caldo: 'f-caldo', leggero: 'f-leggero' }
const SCHEDE = [['atmosfera', 'Stile'], ['colori', 'Colori'], ['font', 'Font'], ['bottoni', 'Bottoni'], ['card', 'Card']].map(([id, nome]) => ({ id, nome }))

export default function Studio({ cliente, onBack, onChange, onLogo }) {
  const s = cliente.stile
  const [scheda, setScheda] = useState('atmosfera')
  const [lang, setLang] = useState(() => linguaIniziale(cliente))
  const lingue = lingueCliente(cliente)
  const imposta = (k, v) => onChange({ ...s, [k]: v })
  const palAttuale = PALETTE.find((p) => p.id === s.palette)
  const [gruppoId, setGruppoId] = useState(() => (GRUPPI_PALETTE.find((g) => g.palette.some((p) => p.id === s.palette)) || GRUPPI_PALETTE[0]).id)
  const gruppo = GRUPPI_PALETTE.find((g) => g.id === gruppoId)
  const [gruppoFontId, setGruppoFontId] = useState(() => (GRUPPI_FONT.find((g) => g.font.some((f) => f.id === s.font)) || GRUPPI_FONT[0]).id)
  const gruppoFont = GRUPPI_FONT.find((g) => g.id === gruppoFontId)
  const tema = temaChiave(s)
  const [campione, setCampione] = useState('cliente') // nei font: scrivere il nome del cliente o il nome del font
  const [logo, setLogo] = useState(null) // colori trovati nella foto del logo (non viene salvata)
  const leggiLogo = async (e) => {
    const f = e.target.files && e.target.files[0]
    e.target.value = ''
    if (!f) return
    try {
      const r = await coloriDaFile(f)
      setLogo(r)
      if (r.anteprima && onLogo) onLogo(r.anteprima) // il logo si salva nel cliente: serve per il confronto dei font
    } catch { setLogo({ colori: [], anteprima: '', errore: true }) }
  }
  const vars = variabili(s)
  const pocoContrasto = !!s.coloreMarchio && contrasto(s.coloreMarchio, vars['--bg']) < 3
  const scegliTema = (t) => onChange({ ...s, temaModo: t === 'entrambi' ? 'entrambi' : 'solo', scuro: t === 'scuro' ? true : t === 'chiaro' ? false : s.scuro })
  const scegliPalette = (p) => onChange({ ...s, palette: p.id, scuro: p.dark ? true : palAttuale?.dark ? false : s.scuro })

  return (
    <div className="studio vista-entra">
      <aside className="barra glass">
        <div className="barra-testa">
          <button className="indietro" onClick={onBack}><Icona nome="indietro" size={18} /> {cliente.nome}</button>
        </div>

        <div className="tema-sel" role="radiogroup" aria-label="Tema del sito">
          <span className="tema-sel__titolo">Tema del sito</span>
          <div className="tema-sel__righe">
            {[['chiaro', 'Chiaro', 'sole'], ['scuro', 'Scuro', 'luna'], ['entrambi', 'Entrambi', 'tema']].map(([id, nome, icona]) => (
              <button key={id} role="radio" aria-checked={tema === id} className={tema === id ? 'on' : ''} onClick={() => scegliTema(id)}>
                <Icona nome={icona} size={17} />{nome}
              </button>
            ))}
          </div>
        </div>

        <TabBolla voci={SCHEDE} attivo={scheda} onScegli={setScheda} />

        <div className="pannello">
          {scheda === 'atmosfera' && (
            <>
              <h4>Punto di partenza</h4>
              <div className="lista">
                {ATMOSFERE.map((a) => (
                  <button key={a.id} className="opzione" onClick={() => onChange({ ...s, ...a.set })}>
                    <span className="opz-riga">
                      {a.nome}
                      <span className="mini-pal">{[PALETTE.find((p) => p.id === a.set.palette)].map((p) => <i key={p.id} style={{ background: p.primary }} />)}</span>
                    </span>
                    <small>{a.desc}</small>
                  </button>
                ))}
              </div>
              <p className="aiuto">Scegli un’atmosfera, poi rifinisci colori, font e forme nelle altre schede.</p>
            </>
          )}

          {scheda === 'colori' && (
            <>
              <div className={'marchio-sel' + (s.coloreMarchio ? ' on' : '')}>
                <label className="marchio-sel__corpo">
                  <span className="marchio-sel__pallino" style={{ background: colorePrincipale(s, palAttuale || PALETTE[0]) }} />
                  <span className="marchio-sel__testo"><b>Il colore del cliente</b><small>{s.coloreMarchio ? s.coloreMarchio.toUpperCase() : 'Tocca per scegliere il colore del suo logo'}</small></span>
                  <input type="color" className="marchio-sel__input" aria-label="Colore del cliente" value={s.coloreMarchio || (palAttuale || PALETTE[0]).primary} onChange={(e) => imposta('coloreMarchio', e.target.value)} />
                </label>
                {s.coloreMarchio && <button className="marchio-sel__togli" onClick={() => imposta('coloreMarchio', '')}>Togli</button>}
              </div>
              <label className="logo-btn">
                <Icona nome="immagine" size={18} /> Prendi il colore da una foto del logo
                <input type="file" accept="image/*" onChange={leggiLogo} />
              </label>
              {logo && (
                <div className="logo-colori">
                  {logo.anteprima && <img src={logo.anteprima} alt="Logo del cliente" />}
                  <div className="logo-colori__corpo">
                    {logo.colori.length > 0 ? (
                      <>
                        <span>Tocca il colore del suo logo</span>
                        <div className="logo-colori__sw">
                          {logo.colori.map((c) => (
                            <button key={c} style={{ background: c }} className={s.coloreMarchio && s.coloreMarchio.toLowerCase() === c ? 'on' : ''} aria-label={'Usa ' + c} onClick={() => imposta('coloreMarchio', c)} />
                          ))}
                        </div>
                      </>
                    ) : (
                      <span>{logo.errore ? 'Non riesco a leggere questa immagine.' : 'Non ho trovato colori: prova con una foto più nitida o con sfondo bianco.'}</span>
                    )}
                  </div>
                  <button className="logo-colori__x" onClick={() => setLogo(null)} aria-label="Chiudi">×</button>
                </div>
              )}
              {pocoContrasto && <p className="aiuto marchio-sel__avviso">Questo colore si legge poco sullo sfondo: link e bordi risulteranno deboli.</p>}
              <TabBolla compatta voci={GRUPPI_PALETTE.map((g) => ({ id: g.id, nome: g.nome, icona: g.icona }))} attivo={gruppo.id} onScegli={setGruppoId} />
              <div className="gruppo-testa" key={gruppo.id}><b>{gruppo.nome}</b><span>{gruppo.desc}</span></div>
              <div className="griglia-colori" key={'g' + gruppo.id}>
                {gruppo.palette.map((p, i) => (
                  <button key={p.id} style={{ '--i': i }} className={'colore' + (s.palette === p.id ? ' on' : '')} onClick={() => scegliPalette(p)}>
                    <span className="strisce"><i style={{ background: p.primary }} /><i style={{ background: p.accent }} /><i style={{ background: p.bg }} /><i style={{ background: p.text }} /></span>
                    {p.nome}
                  </button>
                ))}
              </div>
            </>
          )}

          {scheda === 'font' && (
            <>
              <div className="conf-logo">
                {cliente.logo ? (
                  <>
                    <img src={cliente.logo} alt="Logo del cliente" />
                    <label className="conf-logo__cambia">Cambia<input type="file" accept="image/*" onChange={leggiLogo} /></label>
                  </>
                ) : (
                  <label className="conf-logo__aggiungi"><Icona nome="immagine" size={18} /> Aggiungi il logo per confrontare<input type="file" accept="image/*" onChange={leggiLogo} /></label>
                )}
              </div>
              <div className="campione-sel" role="radiogroup" aria-label="Cosa scrivere nei font">
                <button role="radio" aria-checked={campione === 'cliente'} className={campione === 'cliente' ? 'on' : ''} onClick={() => setCampione('cliente')}>Nome del cliente</button>
                <button role="radio" aria-checked={campione === 'font'} className={campione === 'font' ? 'on' : ''} onClick={() => setCampione('font')}>Nome del font</button>
              </div>
              <TabBolla compatta voci={GRUPPI_FONT.map((g) => ({ id: g.id, nome: g.nome, icona: ICONE_FONT[g.id] }))} attivo={gruppoFont.id} onScegli={setGruppoFontId} />
              <div className="gruppo-testa" key={gruppoFont.id}><b>{gruppoFont.nome}</b><span>{gruppoFont.note}</span></div>
              <div className="lista" key={'f' + gruppoFont.id}>
                {gruppoFont.font.map((f, i) => (
                  <button key={f.id} style={{ '--i': i }} className={'opzione opzione--font' + (s.font === f.id ? ' on' : '')} onClick={() => imposta('font', f.id)}>
                    <span className="esempio-font" style={{ fontFamily: `'${f.titoli}', serif`, fontWeight: f.pesoTitoli }}>{campione === 'cliente' ? cliente.nome : f.titoli}</span>
                    <small style={campione === 'cliente' ? undefined : { fontFamily: `'${f.testi}', sans-serif` }}>{campione === 'cliente' ? `${f.titoli} · con ${f.testi}` : `con ${f.testi}: il tuo testo si legge così`}</small>
                  </button>
                ))}
              </div>
            </>
          )}

          {scheda === 'bottoni' && (
            <>
              <h4>Forma</h4>
              <div className="segmenti">
                {BOTTONI.map((b) => (
                  <button key={b.id} className={s.bottone === b.id ? 'on' : ''} onClick={() => imposta('bottone', b.id)}>
                    <i className="forma" style={{ borderRadius: b.raggio }} />{b.nome}
                  </button>
                ))}
              </div>
              <h4>Riempimento</h4>
              <div className="segmenti">
                {RIEMPIMENTO.map((r) => (
                  <button key={r.id} className={s.riempimento === r.id ? 'on' : ''} onClick={() => imposta('riempimento', r.id)}>{r.nome}</button>
                ))}
              </div>
            </>
          )}

          {scheda === 'card' && (
            <>
              <h4>Stile</h4>
              <div className="lista">
                {CARD.map((c) => (
                  <button key={c.id} className={'opzione' + (s.card === c.id ? ' on' : '')} onClick={() => imposta('card', c.id)}>
                    <span>{c.nome}</span><small>{c.note}</small>
                  </button>
                ))}
              </div>
              <h4>Angoli</h4>
              <div className="segmenti">
                {ANGOLI_CARD.map((a) => (
                  <button key={a.id} className={s.angoli === a.id ? 'on' : ''} onClick={() => imposta('angoli', a.id)}>{a.nome}</button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="barra-piede">
          <button className="primario" onClick={onBack}><Icona nome="check" size={18} /> Fatto</button>
        </div>
      </aside>

      <main className="schermo">
        <div className="sito" style={variabili(s)}>
          <Anteprima stile={s} cliente={cliente} lang={lang} onTema={() => imposta('scuro', !s.scuro)} />
        </div>
        {lingue.length > 1 && (
          <div className="lingua-switch" role="group" aria-label="Lingua dell'anteprima">
            {lingue.map((x) => {
              const l = LINGUE.find((y) => y.id === x.id)
              return (
                <button key={x.id} className={lang === x.id ? 'on' : ''} onClick={() => setLang(x.id)} aria-pressed={lang === x.id}>
                  <Bandiera id={l.id} size={30} />{lang === x.id && <b>{l.nativo}</b>}
                </button>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
