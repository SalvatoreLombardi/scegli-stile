import React from 'react'
import { createRoot } from 'react-dom/client'
import './fontsCss.js'
import '@fontsource/playfair-display/latin-600-italic.css'
import './stile.css'
import './anteprima.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<App />)

// iPad: quando l'app è aperta dall'icona sulla Home (a schermo intero), in orizzontale l'area utile è più bassa
// dello schermo di circa 20 px e in fondo resta una striscia. Misuro la differenza e allungo l'app per coprirla.
function misuraSchermo() {
  const root = document.documentElement
  const standalone = window.navigator.standalone === true
  root.classList.toggle('standalone', standalone)
  if (!standalone) return
  const orizzontale = window.innerWidth > window.innerHeight
  const alto = orizzontale ? Math.min(screen.width, screen.height) : Math.max(screen.width, screen.height)
  root.style.setProperty('--gap', Math.max(0, Math.min(60, alto - window.innerHeight)) + 'px')
}
misuraSchermo()
window.addEventListener('resize', misuraSchermo)
window.addEventListener('orientationchange', () => setTimeout(misuraSchermo, 350))
