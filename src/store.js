import { useCallback, useEffect, useState } from 'react'
import { DEFAULT } from './dati.js'
import { ATTIVITA } from './attivita.js'

const CHIAVE = 'scegli-stile-clienti-v2'

const leggi = () => {
  try {
    const v = JSON.parse(localStorage.getItem(CHIAVE) || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

// Clienti salvati solo su questo dispositivo (localStorage).
export function useClienti() {
  const [clienti, setClienti] = useState(leggi)

  useEffect(() => {
    try { localStorage.setItem(CHIAVE, JSON.stringify(clienti)) } catch { /* modalità privata */ }
  }, [clienti])

  const crea = useCallback(({ nome, referente, attivita, tipo, lingue }) => {
    const att = ATTIVITA.find((a) => a.id === attivita) || ATTIVITA[0]
    const c = {
      id: Date.now().toString(36), nome, referente, attivita, tipo, lingue,
      creato: new Date().toISOString(),
      stile: { ...DEFAULT, palette: att.palette },
      brief: {}, note: '',
    }
    setClienti((l) => [c, ...l])
    return c.id
  }, [])

  const aggiorna = useCallback((id, patch) => {
    setClienti((l) => l.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }, [])

  const elimina = useCallback((id) => setClienti((l) => l.filter((c) => c.id !== id)), [])

  const importa = useCallback((testo) => {
    const v = JSON.parse(testo)
    if (!Array.isArray(v)) throw new Error('formato')
    setClienti(v)
  }, [])

  return { clienti, crea, aggiorna, elimina, importa }
}
