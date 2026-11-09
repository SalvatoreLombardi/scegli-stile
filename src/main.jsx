import React from 'react'
import { createRoot } from 'react-dom/client'
import './fontsCss.js'
import '@fontsource/playfair-display/latin-600-italic.css'
import './stile.css'
import './anteprima.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<App />)
