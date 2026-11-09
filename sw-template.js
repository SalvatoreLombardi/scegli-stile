/* Service worker di Scegli Stile (generato a ogni build da vite.config.js: l'elenco dei file e la versione vengono inseriti dopo la build).
   - Salva in anticipo tutta l'app: pagina, script, stili, font, foto, icone (anche il pezzo di jsPDF per il PDF).
   - Ogni file è salvato con la sua "revisione": a un aggiornamento si scaricano solo i file cambiati.
   - La nuova versione resta in attesa finché non tocchi Aggiorna (nessun mescolamento tra vecchia e nuova versione). */
var VERSION = '__VERSION__'
var FILES = __FILES__ // [percorso relativo, revisione, serve subito (1/0)]
var CACHE = 'scegli-stile-files'
var SCOPE = self.registration.scope

function chiave(percorso, rev) { return new Request(new URL(percorso, SCOPE).href + '?rev=' + rev) }
var PER_PERCORSO = {}
FILES.forEach(function (f) { PER_PERCORSO[f[0]] = f })

function scarica(cache, f) {
  return fetch(new URL(f[0], SCOPE).href, { cache: 'no-cache' }).then(function (res) {
    if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + f[0])
    return cache.put(chiave(f[0], f[1]), res)
  })
}

// Scarica a gruppi di 6 per non intasare la rete; gli errori dei file "non urgenti" si ignorano (li riprova alla prima richiesta).
function inCoda(lista, fn) {
  var i = 0
  function lavoratore() {
    if (i >= lista.length) return Promise.resolve()
    var f = lista[i++]
    return fn(f).catch(function () {}).then(lavoratore)
  }
  var lavoratori = []
  for (var k = 0; k < 6; k++) lavoratori.push(lavoratore())
  return Promise.all(lavoratori)
}

function installa() {
  return caches.open(CACHE).then(function (cache) {
    return cache.keys().then(function (chiavi) {
      var presenti = {}
      chiavi.forEach(function (r) { presenti[r.url] = true })
      var daFare = FILES.filter(function (f) { return !presenti[chiave(f[0], f[1]).url] })
      var subito = daFare.filter(function (f) { return f[2] === 1 })
      var dopo = daFare.filter(function (f) { return f[2] !== 1 })
      // Prima il necessario: se manca qualcosa la nuova versione non si installa e resta quella vecchia.
      return Promise.all(subito.map(function (f) { return scarica(cache, f) })).then(function () {
        return inCoda(dopo, function (f) { return scarica(cache, f) })
      })
    })
  })
}

function pulisci() {
  return caches.open(CACHE).then(function (cache) {
    return cache.keys().then(function (chiavi) {
      var validi = {}
      FILES.forEach(function (f) { validi[chiave(f[0], f[1]).url] = true })
      return Promise.all(chiavi.filter(function (r) { return !validi[r.url] }).map(function (r) { return cache.delete(r) }))
    })
  })
}

self.addEventListener('install', function (e) { e.waitUntil(installa()) })
self.addEventListener('activate', function (e) { e.waitUntil(pulisci().then(function () { return self.clients.claim() })) })
self.addEventListener('message', function (e) { if (e.data === 'attiva') self.skipWaiting() })

self.addEventListener('fetch', function (e) {
  var req = e.request
  if (req.method !== 'GET') return
  var url = new URL(req.url)
  if (url.origin !== self.location.origin) return // link esterni (i miei siti) passano così come sono
  var base = new URL(SCOPE).pathname
  if (url.pathname.indexOf(base) !== 0) return
  var percorso = url.pathname.slice(base.length)
  if (percorso === '') percorso = 'index.html'
  var f = PER_PERCORSO[percorso]
  if (f) {
    e.respondWith(
      caches.open(CACHE).then(function (cache) {
        return cache.match(chiave(f[0], f[1])).then(function (hit) {
          if (hit) return hit
          return scarica(cache, f).then(function () { return cache.match(chiave(f[0], f[1])) }).catch(function () { return fetch(req) })
        })
      })
    )
    return
  }
  // File non in elenco: rete, e se manca la rete la copia salvata (ignorando i parametri dell'indirizzo)
  if (req.mode === 'navigate') {
    e.respondWith(caches.open(CACHE).then(function (cache) { return cache.match(chiave('index.html', PER_PERCORSO['index.html'][1])) }))
    return
  }
  e.respondWith(fetch(req).catch(function () { return caches.match(req, { ignoreSearch: true }) }))
})
