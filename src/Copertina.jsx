import Icona from './Icona.jsx'

// Prima schermata dell'app: copertina con il pulsante per entrare.
export default function Copertina({ onEntra }) {
  return (
    <div className="copertina">
      <div className="cop-vetro glass">
        <div className="cop-logo" aria-hidden="true"><i /><i /><i /></div>
        <h1 className="cop-titolo">Scegli <em>Stile</em></h1>
        <p className="cop-sotto">Fai scegliere al cliente il suo stile</p>
        <div className="cop-chips" aria-hidden="true"><span>Colori</span><span>Font</span><span>Lingue</span><span>Layout</span></div>
        <button className="cop-btn" onClick={onEntra}>
          <span className="cop-btn__alone" aria-hidden="true" />
          Metti in moto la creatività <Icona nome="avanti" size={26} />
        </button>
      </div>
      <p className="cop-firma">salvatorelombardi.com</p>
    </div>
  )
}
