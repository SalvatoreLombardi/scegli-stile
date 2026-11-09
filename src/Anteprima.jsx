import Foto from './Foto.jsx'
import Icona from './Icona.jsx'
import { trova } from './utils.js'
import { ATTIVITA } from './attivita.js'
import { contenuto, t } from './lingue.js'

const euro = (n, T) => (n === 0 ? (T('lang') === 'zh' ? '免费' : 'Gratis') : `${n} €`)

function Nav({ nome, voci, btn, carrello, T, tema, logo }) {
  return (
    <header className="p-nav">
      {logo ? <img className="p-logo p-logo--img" src={logo} alt={nome} /> : <strong className="p-logo">{nome}</strong>}
      <nav>{voci.map((v) => <span key={v}>{v}</span>)}</nav>
      {tema}
      {carrello && <span className="p-cart">{T('carrello')}<b>2</b></span>}
      <button className={btn + ' p-btn--sm'}>{carrello ? T('accedi') : T('contattaci')}</button>
    </header>
  )
}

function Hero({ a, btn, T }) {
  return (
    <section className="p-hero">
      <Foto att={a.id} nome="hero" className="p-hero__foto" />
      <div className="p-hero__velo" />
      <div className="p-hero__testo">
        <span className="p-badge">{a.badge}</span>
        <h1>{a.claim}</h1>
        <p>{a.sub}</p>
        <div className="p-row">
          <button className={btn}>{a.cta}</button>
          <button className="p-btn p-btn--vetro">{T('scopri')}</button>
        </div>
      </div>
    </section>
  )
}

function Servizi({ a, cardCls, T }) {
  return (
    <section className="p-sezione">
      <h2>{T('nostriServizi')}</h2>
      <div className="p-griglia">
        {a.serv.map(([titolo, d], i) => (
          <article className={cardCls + ' p-card--img'} key={i}>
            <Foto att={a.id} nome={a.imgServ[i]} className="p-card__foto" />
            <div className="p-card__corpo">
              <h3>{titolo}</h3>
              <p>{d}</p>
              <a className="p-link">{T('scopri')} →</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Contatti({ cardCls, btn, T }) {
  return (
    <section className="p-sezione">
      <h2>{T('contatti')}</h2>
      <div className={cardCls + ' p-form'}>
        <label>{T('nome')}<input placeholder="Mario Rossi" readOnly /></label>
        <label>{T('email')}<input placeholder="mario@email.it" readOnly /></label>
        <label className="p-full">{T('messaggio')}<textarea rows="2" placeholder={T('scrivi')} readOnly /></label>
        <button className={btn + ' p-full'}>{T('invia')}</button>
      </div>
    </section>
  )
}

function Vetrina({ a, nome, btn, cardCls, T, tema, logo }) {
  return (
    <>
      <Nav nome={nome} voci={[T('home'), T('servizi'), T('chiSiamo'), T('contatti')]} btn={btn} T={T} tema={tema} logo={logo} />
      <Hero a={a} btn={btn} T={T} />
      <Servizi a={a} cardCls={cardCls} T={T} />
      <section className="p-sezione p-due">
        <Foto att={a.id} nome="g4" className="p-due__foto" />
        <div>
          <span className="p-eyebrow">{T('chiSiamo')}</span>
          <h2>{T('chiSiamoTitolo')}</h2>
          <p className="p-muted">{T('chiSiamoTesto')}</p>
          <div className="p-stats"><div><b>25</b><span>{T('anni')}</span></div><div><b>1.200</b><span>{T('clienti')}</span></div><div><b>4,9★</b><span>{T('recensioni')}</span></div></div>
        </div>
      </section>
      <section className="p-sezione">
        <h2>{T('galleria')}</h2>
        <div className="p-galleria">{['g5', 'g6', 'g1'].map((g) => <Foto key={g} att={a.id} nome={g} className="p-galleria__foto" />)}</div>
      </section>
      <Contatti cardCls={cardCls} btn={btn} T={T} />
    </>
  )
}

function Landing({ a, nome, btn, cardCls, T, tema, logo }) {
  return (
    <>
      <Nav nome={nome} voci={[]} btn={btn} T={T} tema={tema} logo={logo} />
      <section className="p-split">
        <div>
          <span className="p-badge">{a.badge}</span>
          <h1>{a.claim}</h1>
          <p className="p-muted">{a.sub}</p>
          <div className="p-check"><span>✓ {T('risposta')}</span><span>✓ {T('nessunImpegno')}</span></div>
        </div>
        <div className={cardCls + ' p-form p-form--stretto'}>
          <h3 className="p-full">{a.cta}</h3>
          <label className="p-full">{T('nome')}<input placeholder={T('tuoNome')} readOnly /></label>
          <label className="p-full">{T('telefono')}<input placeholder="333 000 0000" readOnly /></label>
          <button className={btn + ' p-full'}>{T('richiesta')}</button>
        </div>
      </section>
      <Foto att={a.id} nome="hero" className="p-banda" />
      <section className="p-sezione">
        <h2>{T('perche')}</h2>
        <div className="p-griglia">
          {a.serv.map(([titolo, d], i) => (
            <article className={cardCls} key={i}>
              <div className="p-icona">{i + 1}</div>
              <h3>{titolo}</h3><p>{d}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="p-sezione">
        <div className={cardCls + ' p-quote'}>
          <p>{T('quote')}</p>
          <span className="p-muted">{T('quoteAutore')}</span>
        </div>
      </section>
    </>
  )
}

function Ecommerce({ a, nome, btn, cardCls, T, tema, logo }) {
  return (
    <>
      <div className="p-promo">{T('promo')}</div>
      <Nav nome={nome} voci={a.categorie} btn={btn} carrello T={T} tema={tema} logo={logo} />
      <Hero a={a} btn={btn} T={T} />
      <section className="p-sezione">
        <h2>{T('piuVenduti')}</h2>
        <div className="p-prodotti">
          {a.prodotti.map(([n, p], i) => (
            <article className={cardCls + ' p-card--img p-prodotto'} key={i}>
              <Foto att={a.id} nome={a.imgProd[i]} className="p-card__foto p-card__foto--quad" />
              <div className="p-card__corpo">
                <h3>{n}</h3>
                <b className="p-prezzo">{euro(p, T)}</b>
                <button className={btn + ' p-btn--sm p-btn--blocco'}>{T('aggiungi')}</button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="p-sezione p-chips">
        {a.categorie.map((c) => <span key={c} className="p-chip">{c}</span>)}
      </section>
      <section className="p-sezione">
        <div className={cardCls + ' p-newsletter'}>
          <div><h3>{T('newsletter')}</h3><p className="p-muted">{T('newsletterSub')}</p></div>
          <button className={btn}>{T('iscrivimi')}</button>
        </div>
      </section>
    </>
  )
}

function WebApp({ a, nome, btn, cardCls, T, tema, logo }) {
  const righe = ['Giulia Marino', 'Luca Fabbri', 'Anna Greco', 'Paolo Neri'].map((n, i) => [['09:00', '10:30', '12:00', '15:30'][i], n])
  return (
    <div className="p-app">
      <aside className="p-app__lato">
        {logo ? <img className="p-logo p-logo--img" src={logo} alt={nome} /> : <strong className="p-logo">{nome}</strong>}
        {[T('panoramica'), a.app, T('clientiNav'), T('calendario'), T('impostazioni')].map((v, i) => <span key={i} className={i === 1 ? 'on' : ''}>{v}</span>)}
      </aside>
      <div className="p-app__main">
        <div className="p-app__testa">
          <div><span className="p-muted">{T('buongiorno')}</span><h2>{a.app} {T('diOggi')}</h2></div>
          <div className="p-row">{tema}<button className={btn + ' p-btn--sm'}>{T('nuovo')}</button></div>
        </div>
        <div className="p-kpi">
          {[[T('oggi'), '12'], [T('settimana'), '48'], [T('nuovi'), '+9']].map(([l, v]) => (
            <div className={cardCls} key={l}><span className="p-muted">{l}</span><b>{v}</b></div>
          ))}
        </div>
        <div className={cardCls + ' p-lista'}>
          {righe.map(([o, n], i) => (
            <div className="p-lista__riga" key={n}>
              <b>{o}</b><span>{n}</span>
              <em className={'p-stato' + (i === 1 ? ' p-stato--att' : '')}>{i === 1 ? T('attesa') : T('confermato')}</em>
            </div>
          ))}
        </div>
        <div className={cardCls + ' p-controlli'}>
          <label>{T('cerca').replace('…', '')}<input placeholder={T('cerca')} readOnly /></label>
          <label className="p-switch"><span>{T('notifiche')}</span><i /></label>
          <button className="p-btn p-btn--contorno p-btn--sm">{T('esporta')}</button>
        </div>
      </div>
    </div>
  )
}

function Kit({ cardCls, T }) {
  return (
    <section className="p-sezione p-kit">
      <h2>{T('bottoniTesti')}</h2>
      <div className="p-row p-row--wrap">
        <button className="p-btn p-btn--pieno">{T('principale')}</button>
        <button className="p-btn p-btn--contorno">{T('contorno')}</button>
        <button className="p-btn p-btn--tenue">{T('tenue')}</button>
        <button className="p-btn p-btn--accento">{T('secondario')}</button>
        <button className="p-btn p-btn--pieno p-btn--sm">{T('piccolo')}</button>
        <button className="p-btn p-btn--pieno p-btn--lg">{T('grande')}</button>
      </div>
      <div className={cardCls + ' p-testi'}>
        <h1>{T('titoloP')}</h1>
        <h2 className="p-h2">{T('titoloS')}</h2>
        <h3>{T('sottotitolo')}</h3>
        <p>{T('paragrafo')}</p>
        <p className="p-muted">{T('testoSec')} <a className="p-link">{T('link')}</a></p>
      </div>
    </section>
  )
}

export default function Anteprima({ stile, cliente, lang = 'it', onTema }) {
  const base = trova(ATTIVITA, cliente?.attivita || 'generico')
  const a = contenuto(base, lang)
  const nome = cliente?.nome || base.azienda
  const T = (k) => (k === 'lang' ? lang : t(lang, k))
  const btn = `p-btn p-btn--${stile.riempimento}`
  const cardCls = `p-card p-card--${stile.card}`
  const tipo = cliente?.tipo || 'vetrina'
  // Se il sito ha sia chiaro sia scuro, il visitatore trova un interruttore: qui si può provare toccandolo.
  const tema = stile.temaModo === 'entrambi'
    ? <button className="p-tema" onClick={onTema} aria-label="Cambia tema chiaro o scuro"><Icona nome={stile.scuro ? 'sole' : 'luna'} size={20} /></button>
    : null
  const P = { a, nome, btn, cardCls, T, tema, logo: cliente?.logo || '' }
  return (
    <div className="p-sito" lang={lang}>
      {tipo === 'vetrina' && <Vetrina {...P} />}
      {tipo === 'landing' && <Landing {...P} />}
      {tipo === 'ecommerce' && <Ecommerce {...P} />}
      {tipo === 'webapp' && <WebApp {...P} />}
      <Kit cardCls={cardCls} T={T} />
      <footer className="p-footer">© {nome} · {T('via')}</footer>
    </div>
  )
}
