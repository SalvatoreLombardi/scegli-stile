import { useState } from 'react'

export const urlFoto = (att, nome) => `${import.meta.env.BASE_URL}img/${att}/${nome}.jpg`

// Foto con sfondo sfumato di riserva se il file manca.
export default function Foto({ att, nome = 'hero', className = '', alt = '' }) {
  const [ko, setKo] = useState(false)
  return (
    <div className={'foto ' + className}>
      {!ko && <img src={urlFoto(att, nome)} alt={alt} loading="lazy" decoding="async" onError={() => setKo(true)} />}
    </div>
  )
}
