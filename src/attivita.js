// Contenuti dell'anteprima per ogni attività. Le foto stanno in public/img/<id>/ (hero.jpg, g1..g6.jpg).
// imgServ = foto per le 3 card dei servizi, imgProd = foto dei 4 prodotti dell'e-commerce.
const S = ['g1', 'g2', 'g3']
const P = ['g1', 'g2', 'g3', 'g4']

export const ATTIVITA = [
  {
    id: 'ottica', nome: 'Ottica', palette: 'cloud-dancer', azienda: 'Ottica Visione',
    claim: 'Guarda il mondo con stile', sub: 'Montature selezionate, lenti su misura e controllo della vista direttamente in negozio.',
    cta: 'Prenota una visita', badge: 'Controllo vista gratuito',
    serv: [['Esame della vista', 'Controlli completi con strumenti di ultima generazione.'], ['Montature di tendenza', 'Le migliori collezioni, dal classico al fashion.'], ['Lenti su misura', 'Progressive, per schermi e fotocromatiche.']],
    imgServ: ['g1', 'g2', 'g3'], imgProd: ['g3', 'g4', 'g5', 'g6'],
    prodotti: [['Round Metal', 129], ['Aviator Gold', 149], ['Square Black', 119], ['Cat Eye Tortoise', 139]],
    categorie: ['Da vista', 'Da sole', 'Lenti a contatto'], app: 'Appuntamenti',
  },
  {
    id: 'ristorante', nome: 'Ristorante / Pizzeria', palette: 'terracotta-mare', azienda: 'Trattoria Aurora',
    claim: 'Il sapore della Puglia, a tavola', sub: 'Ingredienti del territorio, ricette di famiglia e un forno a legna acceso ogni sera.',
    cta: 'Prenota un tavolo', badge: 'Cucina tipica pugliese',
    serv: [['Menù alla carta', 'Antipasti, primi e secondi di stagione.'], ['Pizza al forno a legna', 'Impasto a lunga lievitazione.'], ['Eventi e cerimonie', 'Sale riservate per le tue occasioni.']],
    imgServ: S, imgProd: P,
    prodotti: [['Orecchiette alle cime di rapa', 12], ['Pizza margherita DOP', 9], ['Tiramisù della casa', 6], ['Calice di Primitivo', 5]],
    categorie: ['Antipasti', 'Primi', 'Dolci'], app: 'Prenotazioni',
  },
  {
    id: 'bnb', nome: 'B&B / Hotel', palette: 'blu-egeo', azienda: 'Casa Levante',
    claim: 'Una pausa nel cuore della Puglia', sub: 'Camere luminose, colazione con prodotti locali e il mare a pochi minuti.',
    cta: 'Controlla le date', badge: 'Prenota diretto, risparmia',
    serv: [['Camere', 'Spazi curati con ogni comfort.'], ['Colazione', 'Dolce e salato, tutto del territorio.'], ['Esperienze', 'Tour, degustazioni e giri in bici.']],
    imgServ: S, imgProd: P,
    prodotti: [['Camera Doppia', 95], ['Suite Terrazza', 140], ['Camera Famiglia', 120], ['Pacchetto Romantico', 180]],
    categorie: ['Camere', 'Pacchetti', 'Esperienze'], app: 'Camere',
  },
  {
    id: 'parrucchiere', nome: 'Parrucchiere / Estetica', palette: 'bordeaux-champagne', azienda: 'Studio Bellezza',
    claim: 'Il tuo stile, il tuo momento', sub: 'Tagli, colore e trattamenti con prodotti professionali. Prenota in un attimo.',
    cta: 'Prenota il tuo posto', badge: 'Su appuntamento',
    serv: [['Taglio e piega', 'Uomo, donna e bambino.'], ['Colore e meches', 'Tonalità su misura per te.'], ['Trattamenti viso', 'Cura e benessere della pelle.']],
    imgServ: S, imgProd: P,
    prodotti: [['Shampoo Riparatore', 18], ['Maschera Nutriente', 22], ['Olio Lucidante', 19], ['Crema Viso Idratante', 28]],
    categorie: ['Capelli', 'Viso', 'Corpo'], app: 'Appuntamenti',
  },
  {
    id: 'studio-medico', nome: 'Studio medico / Dentista', palette: 'nebbia', azienda: 'Studio Medico Salute',
    claim: 'La tua salute, in mani esperte', sub: 'Professionisti attenti, strumenti moderni e un ambiente accogliente.',
    cta: 'Prenota una visita', badge: 'Prima visita senza attese',
    serv: [['Visite specialistiche', 'Diagnosi chiare e percorsi su misura.'], ['Prevenzione', 'Controlli periodici e consigli.'], ['Trattamenti', 'Terapie con tecnologie avanzate.']],
    imgServ: S, imgProd: P,
    prodotti: [['Visita di controllo', 60], ['Pulizia professionale', 70], ['Sbiancamento', 250], ['Check-up completo', 120]],
    categorie: ['Visite', 'Terapie', 'Prevenzione'], app: 'Visite',
  },
  {
    id: 'palestra', nome: 'Palestra / Fitness', palette: 'arancio-pop', azienda: 'Power Gym',
    claim: 'Allenati. Supera i tuoi limiti.', sub: 'Sala pesi, corsi di gruppo e personal trainer per ogni obiettivo.',
    cta: 'Prova gratuita', badge: 'Primo ingresso gratis',
    serv: [['Sala attrezzi', 'Macchinari nuovi e area pesi libera.'], ['Corsi di gruppo', 'Dal funzionale allo yoga.'], ['Personal training', 'Un piano costruito su di te.']],
    imgServ: S, imgProd: P,
    prodotti: [['Abbonamento mensile', 45], ['Abbonamento annuale', 390], ['10 ingressi', 60], ['Sessione personal', 35]],
    categorie: ['Abbonamenti', 'Corsi', 'Personal'], app: 'Corsi',
  },
  {
    id: 'abbigliamento', nome: 'Abbigliamento / Boutique', palette: 'avorio-oro', azienda: 'Atelier Moda',
    claim: 'Vesti il tuo carattere', sub: 'Capi selezionati, nuove collezioni ogni stagione e consulenza di stile.',
    cta: 'Scopri la collezione', badge: 'Nuova collezione',
    serv: [['Donna', 'Capi e accessori per ogni occasione.'], ['Uomo', 'Eleganza quotidiana e cerimonia.'], ['Accessori', 'Borse, scarpe e dettagli.']],
    imgServ: S, imgProd: P,
    prodotti: [['Giacca in lino', 139], ['Abito midi', 119], ['Sneaker bianche', 89], ['Borsa in pelle', 159]],
    categorie: ['Donna', 'Uomo', 'Accessori'], app: 'Ordini',
  },
  {
    id: 'officina', nome: 'Officina / Auto', palette: 'grafite-ambra', azienda: 'Autofficina Rossi',
    claim: 'La tua auto, sempre in forma', sub: 'Tagliandi, diagnosi e riparazioni con ricambi di qualità e preventivi chiari.',
    cta: 'Richiedi un preventivo', badge: 'Preventivo in giornata',
    serv: [['Tagliando', 'Controlli completi, anche a km zero.'], ['Diagnosi', 'Strumenti aggiornati per ogni marca.'], ['Gomme e freni', 'Sicurezza prima di tutto.']],
    imgServ: S, imgProd: P,
    prodotti: [['Tagliando completo', 149], ['Cambio gomme', 40], ['Revisione', 79], ['Sanificazione abitacolo', 35]],
    categorie: ['Manutenzione', 'Gomme', 'Carrozzeria'], app: 'Interventi',
  },
  {
    id: 'arredamento', nome: 'Arredamento / Interni', palette: 'sabbia-chiara', azienda: 'Spazio Casa',
    claim: 'Progettiamo il tuo spazio ideale', sub: 'Dal progetto alla consegna: arredi su misura, ristrutturazioni e consulenza.',
    cta: 'Richiedi un sopralluogo', badge: 'Progetto 3D incluso',
    serv: [['Progettazione', 'Idee e rendering prima di iniziare.'], ['Arredi su misura', 'Cucine, armadi e living.'], ['Ristrutturazioni', 'Cantiere seguito passo dopo passo.']],
    imgServ: S, imgProd: P,
    prodotti: [['Divano 3 posti', 890], ['Tavolo in rovere', 640], ['Lampada da terra', 140], ['Libreria modulare', 520]],
    categorie: ['Living', 'Cucine', 'Illuminazione'], app: 'Progetti',
  },
  {
    id: 'studio-professionale', nome: 'Studio professionale', palette: 'navy-oro', azienda: 'Studio Associato Bianchi',
    claim: 'Competenza e chiarezza al tuo fianco', sub: 'Consulenza fiscale, legale e aziendale per professionisti e imprese del territorio.',
    cta: 'Fissa una consulenza', badge: 'Primo incontro gratuito',
    serv: [['Consulenza', 'Soluzioni su misura per la tua situazione.'], ['Pratiche e adempimenti', 'Scadenze sempre sotto controllo.'], ['Assistenza continua', 'Un referente sempre raggiungibile.']],
    imgServ: S, imgProd: P,
    prodotti: [['Consulenza iniziale', 0], ['Pacchetto start-up', 450], ['Assistenza annuale', 900], ['Pratica singola', 150]],
    categorie: ['Fisco', 'Lavoro', 'Società'], app: 'Pratiche',
  },
  {
    id: 'pasticceria', nome: 'Pasticceria / Panificio', palette: 'latte', azienda: 'Dolce Forno',
    claim: 'Fatto a mano, ogni mattina', sub: 'Dolci, pane e lievitati preparati con ingredienti genuini e tanta passione.',
    cta: 'Ordina ora', badge: 'Sfornato ogni giorno',
    serv: [['Pasticceria', 'Torte, mignon e monoporzioni.'], ['Forno', 'Pane e focacce appena sfornati.'], ['Torte su ordinazione', 'Per compleanni e cerimonie.']],
    imgServ: S, imgProd: P,
    prodotti: [['Torta della nonna', 24], ['Box cornetti x6', 9], ['Pane di grano arso', 4], ['Biscotti artigianali', 8]],
    categorie: ['Dolci', 'Pane', 'Cerimonie'], app: 'Ordini',
  },
  {
    id: 'cantina', nome: 'Cantina / Azienda agricola', palette: 'ulivo', azienda: 'Masseria del Sole',
    claim: 'La terra di Puglia in una bottiglia', sub: 'Vino e olio extravergine da produzione propria, dal campo alla tua tavola.',
    cta: 'Scopri i prodotti', badge: 'Spedizione in tutta Italia',
    serv: [['I nostri vini', 'Rossi e bianchi del territorio.'], ['Olio extravergine', 'Spremuto a freddo.'], ['Visite e degustazioni', 'Vieni a conoscere la masseria.']],
    imgServ: S, imgProd: P,
    prodotti: [['Primitivo 2021', 14], ['Olio EVO 0,5 L', 12], ['Negroamaro rosato', 11], ['Box degustazione', 49]],
    categorie: ['Vini', 'Olio', 'Regali'], app: 'Ordini',
  },
  {
    id: 'generico', nome: 'Altra attività', palette: 'carta', azienda: 'La Tua Azienda',
    claim: 'Un sito che racconta davvero il tuo lavoro', sub: 'Qualità, passione e attenzione ai dettagli. Scopri come possiamo aiutarti a crescere.',
    cta: 'Contattaci', badge: 'Dal 1998 in Puglia',
    serv: [['Consulenza', 'Ascoltiamo le tue esigenze.'], ['Realizzazione', 'Tempi chiari e certi.'], ['Assistenza', 'Al tuo fianco anche dopo.']],
    imgServ: S, imgProd: P,
    prodotti: [['Prodotto uno', 29], ['Prodotto due', 39], ['Prodotto tre', 49], ['Prodotto quattro', 59]],
    categorie: ['Categoria A', 'Categoria B', 'Categoria C'], app: 'Attività',
  },
]

export const TIPI = [
  { id: 'vetrina', nome: 'Sito vetrina', desc: 'Più pagine: chi sei, servizi, contatti' },
  { id: 'ecommerce', nome: 'E-commerce', desc: 'Catalogo, carrello e pagamenti online' },
  { id: 'webapp', nome: 'Web app', desc: 'Prenotazioni, area clienti, strumenti su misura' },
  { id: 'landing', nome: 'Landing page', desc: 'Una pagina per raccogliere contatti' },
]

// Prezzi di partenza dal listino (IVA esclusa). Solo per te: non vanno mostrati al cliente.
export const LISTINO = {
  vetrina: { da: 1200, nota: 'Sito vetrina su misura, fino a 6 pagine' },
  ecommerce: { da: 2000, nota: 'Negozio online: catalogo, carrello, pagamenti, ordini' },
  webapp: { da: null, nota: 'App mobile o Web App: sempre su preventivo' },
  landing: { da: 690, nota: 'Landing page (one page da 490 €)' },
}
export const RICORRENTI = 'Manutenzione 15–40 €/mese · Dominio, hosting ed email da 60 €/anno (dal secondo anno)'

// Domande del brief, prese dalle "Domande giuste" del listino.
const SCAD = { k: 'scadenza', q: 'Per quando serve?', t: 'testo' }
export const BRIEF = {
  vetrina: [
    { k: 'pagine', q: 'Quante pagine?', t: 'uno', o: ['Una sola', 'Da 3 a 5', 'Più di 5', 'Non è chiaro'] },
    { k: 'funzioni', q: 'Cosa deve avere?', t: 'multi', o: ['Modulo di contatto', 'Galleria foto', 'Notizie o blog', 'Mappa e orari', 'Più lingue'] },
    { k: 'foto', q: 'Foto', t: 'uno', o: ['Le ha', 'Da realizzare'] },
    { k: 'testi', q: 'Testi', t: 'uno', o: ['Li ha', 'Da scrivere'] },
    { k: 'logo', q: 'Logo', t: 'uno', o: ['Ce l\'ha', 'Da creare', 'Da rifare'] },
    { k: 'dominio', q: 'Dominio e hosting', t: 'uno', o: ['Già attivi', 'Da attivare'] },
    SCAD,
  ],
  landing: [
    { k: 'funzioni', q: 'Cosa deve avere?', t: 'multi', o: ['Modulo di contatto', 'Pulsante WhatsApp', 'Mappa e orari', 'Pixel per pubblicità'] },
    { k: 'foto', q: 'Foto', t: 'uno', o: ['Le ha', 'Da realizzare'] },
    { k: 'testi', q: 'Testi', t: 'uno', o: ['Li ha', 'Da scrivere'] },
    { k: 'logo', q: 'Logo', t: 'uno', o: ['Ce l\'ha', 'Da creare', 'Da rifare'] },
    { k: 'dominio', q: 'Dominio e hosting', t: 'uno', o: ['Già attivi', 'Da attivare'] },
    SCAD,
  ],
  ecommerce: [
    { k: 'prodotti', q: 'Quanti prodotti?', t: 'uno', o: ['Fino a 20', 'Da 20 a 100', 'Più di 100', 'Non è chiaro'] },
    { k: 'funzioni', q: 'Cosa deve avere?', t: 'multi', o: ['Pagamenti online', 'Spedizioni e corrieri', 'Codici sconto', 'Account per i clienti'] },
    { k: 'carica', q: 'Chi carica i prodotti?', t: 'uno', o: ['Il cliente', 'Io'] },
    { k: 'schede', q: 'Schede, foto e prezzi', t: 'uno', o: ['Pronti', 'Da creare'] },
    { k: 'pagamenti', q: 'Come incassa?', t: 'multi', o: ['Carta', 'PayPal', 'Bonifico', 'Contrassegno'] },
    SCAD,
  ],
  webapp: [
    { k: 'tipoapp', q: 'Che tipo di app?', t: 'uno', o: ['PWA (dal browser)', 'App per gli store', 'Da decidere col budget'] },
    { k: 'funzioni', q: 'Cosa deve fare?', t: 'multi', o: ['Prenotazioni', 'Area clienti', 'Notifiche', 'Pagamenti', 'Vetrina o catalogo'] },
    { k: 'login', q: 'Servono account e login?', t: 'uno', o: ['Sì', 'No'] },
    { k: 'gestione', q: 'Chi gestisce i contenuti?', t: 'uno', o: ['Il cliente', 'Io'] },
    { k: 'collegamenti', q: 'Deve collegarsi ad altro?', t: 'testo' },
    SCAD,
  ],
}
