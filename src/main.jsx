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
