import React from 'react'
import { createRoot } from 'react-dom/client'
import './fontsCss.js'
import '@fontsource/playfair-display/latin-600-italic.css'
import './stile.css'
import './anteprima.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<App />)

// iPad, app aperta dall'icona sulla Home: segno la modalità per applicare lo stile del fondo (vedi stile.css).
if (window.navigator.standalone === true) document.documentElement.classList.add('standalone')

// Dopo un aggiornamento manuale tolgo dall'indirizzo il parametro usato per scaricare la versione nuova.
if (window.location.search.indexOf('r=') !== -1) window.history.replaceState(null, '', window.location.pathname)

// Pagina in background: ferma le animazioni (risparmio batteria).
document.addEventListener('visibilitychange', () => document.documentElement.classList.toggle('pagina-nascosta', document.hidden))

// Funzionamento offline: il service worker salva l'app. Una nuova versione resta in attesa finché non tocchi Aggiorna.
function nuovaVersionePronta() {
  window.__nuovaVersione = true
  window.dispatchEvent(new Event('scegli-stile-aggiornamento'))
}
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).then((reg) => {
      window.__sw = reg
      if (reg.waiting && navigator.serviceWorker.controller) nuovaVersionePronta()
      reg.addEventListener('updatefound', () => {
        const nuovo = reg.installing
        if (nuovo) nuovo.addEventListener('statechange', () => { if (nuovo.state === 'installed' && navigator.serviceWorker.controller) nuovaVersionePronta() })
      })
    }).catch(() => {})
  })
}
