import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

// Dopo la build scrive dist/sw.js: l'elenco di tutti i file dell'app con la loro revisione, da salvare in anticipo.
// Foto e font si salvano in secondo piano; pagina, script, stili e PDF (jsPDF) sono "subito".
function serviceWorker() {
  let outDir = 'dist'
  return {
    name: 'scegli-stile-sw',
    apply: 'build',
    configResolved(c) { outDir = path.resolve(c.root, c.build.outDir) },
    closeBundle() {
      const tutti = []
      const visita = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
        const p = path.join(d, e.name)
        e.isDirectory() ? visita(p) : tutti.push(p)
      })
      visita(outDir)
      const escludi = (f) => f === 'sw.js' || f.endsWith('.woff') || f.endsWith('.txt') || f.endsWith('.map')
      const files = tutti
        .map((f) => path.relative(outDir, f).split(path.sep).join('/'))
        .filter((f) => !escludi(f))
        .sort()
        .map((f) => {
          const rev = crypto.createHash('md5').update(fs.readFileSync(path.join(outDir, f))).digest('hex').slice(0, 10)
          const subito = !(f.startsWith('img/') || f.endsWith('.woff2')) ? 1 : 0
          return [f, rev, subito]
        })
      const versione = crypto.createHash('md5').update(JSON.stringify(files)).digest('hex').slice(0, 10)
      const modello = fs.readFileSync(path.resolve('sw-template.js'), 'utf8')
      fs.writeFileSync(path.join(outDir, 'sw.js'), modello.split('__FILES__').join(JSON.stringify(files)).split('__VERSION__').join(versione))
      const mb = (files.reduce((t, [f]) => t + fs.statSync(path.join(outDir, f)).size, 0) / 1048576).toFixed(1)
      console.log(`sw.js: ${files.length} file, ${mb} MB, versione ${versione}`)
    },
  }
}

// base './' => funziona su GitHub Pages in qualsiasi sottocartella.
// target safari14 => compatibile con iPad Air 2 (iPadOS 15), più prudente di safari15.
export default defineConfig({
  base: './',
  plugins: [react(), serviceWorker()],
  build: { target: 'safari14', cssTarget: 'safari14' },
})
