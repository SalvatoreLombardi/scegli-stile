import React from 'react'
import { createRoot } from 'react-dom/client'
import './fontsCss.js'
import '@fontsource/playfair-display/latin-600-italic.css'
import './stile.css'
import './anteprima.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<App />)

// iPad, app aperta dall'icona sulla Home: in orizzontale WebKit può calcolare male l'altezza e lasciare una striscia in fondo
// (difetto noto). Rimettere il viewport (togliere e rimettere viewport-fit) lo costringe a ricalcolare la finestra.
function ricalcolaViewport() {
  if (window.navigator.standalone !== true) return
  const m = document.querySelector('meta[name="viewport"]')
  if (!m) return
  const originale = m.getAttribute('content')
  m.setAttribute('content', originale.replace('viewport-fit=cover', 'viewport-fit=auto'))
  requestAnimationFrame(() => requestAnimationFrame(() => m.setAttribute('content', originale)))
}
window.addEventListener('load', () => setTimeout(ricalcolaViewport, 350))
window.addEventListener('orientationchange', () => setTimeout(ricalcolaViewport, 450))

// Dopo un aggiornamento manuale tolgo dall'indirizzo il parametro usato per scaricare la versione nuova.
if (window.location.search.indexOf('r=') !== -1) window.history.replaceState(null, '', window.location.pathname)
