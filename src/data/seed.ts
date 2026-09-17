import type { Material, MaterialCategory, PersistedData, Priority, Repair, Room, Status } from '../types'

const rooms: Room[] = [
  { id: 'room-keittio', name: 'Keittiö', colorIndex: 0 },
  { id: 'room-kylpyhuone', name: 'Kylpyhuone', colorIndex: 1 },
  { id: 'room-olohuone', name: 'Olohuone', colorIndex: 2 },
  { id: 'room-makuuhuone', name: 'Makuuhuone', colorIndex: 3 },
  { id: 'room-eteinen', name: 'Eteinen', colorIndex: 4 },
  { id: 'room-terassi', name: 'Terassi', colorIndex: 5 },
  { id: 'room-julkisivu', name: 'Julkisivu ja ulkoseinät', colorIndex: 6 },
  { id: 'room-vesikatto', name: 'Vesikatto', colorIndex: 7 },
  { id: 'room-varasto', name: 'Varasto', colorIndex: 8 },
]

const statuses: Status[] = [
  { id: 'status-dream', name: 'Haave' },
  { id: 'status-not-started', name: 'Ei aloitettu' },
  { id: 'status-in-progress', name: 'Käynnissä' },
  { id: 'status-done', name: 'Valmis' },
]

const priorities: Priority[] = [
  { id: 'priority-low', name: 'Matala' },
  { id: 'priority-medium', name: 'Keskitaso' },
  { id: 'priority-high', name: 'Korkea' },
]

const materialCategories: MaterialCategory[] = [
  {
    id: 'cat-lauta',
    name: 'Lauta',
    fields: [
      { key: 'puulaji', label: 'Puulaji', type: 'text' },
      { key: 'mitat', label: 'Mitat', type: 'text' },
      { key: 'pakkauskoko', label: 'Pakkauskoko', type: 'text' },
    ],
  },
  {
    id: 'cat-maali',
    name: 'Maali',
    fields: [
      { key: 'tuotesarja', label: 'Tuotesarja', type: 'text' },
      { key: 'kiiltoaste', label: 'Kiiltoaste', type: 'text' },
      { key: 'savy', label: 'Sävy / värikoodi', type: 'text' },
    ],
  },
  {
    id: 'cat-pohjamaali',
    name: 'Pohjamaali',
    fields: [
      { key: 'tuotesarja', label: 'Tuotesarja', type: 'text' },
      { key: 'kayttokohde', label: 'Käyttökohde', type: 'text' },
    ],
  },
  {
    id: 'cat-laatta',
    name: 'Laatta',
    fields: [
      { key: 'mallisto', label: 'Mallisto', type: 'text' },
      { key: 'koko', label: 'Koko', type: 'text' },
      { key: 'vari', label: 'Väri', type: 'text' },
    ],
  },
  {
    id: 'cat-tapetti',
    name: 'Tapetti',
    fields: [
      { key: 'mallisto', label: 'Mallisto / kokoelma', type: 'text' },
      { key: 'mitat', label: 'Leveys x pituus', type: 'text' },
    ],
  },
  {
    id: 'cat-lattiapaallyste',
    name: 'Lattiapäällyste',
    fields: [
      { key: 'malli', label: 'Malli', type: 'text' },
      { key: 'mitat', label: 'Mitat', type: 'text' },
    ],
  },
  {
    id: 'cat-kiinnikkeet',
    name: 'Kiinnikkeet',
    fields: [
      { key: 'tyyppi', label: 'Tyyppi', type: 'text' },
      { key: 'koko', label: 'Koko', type: 'text' },
    ],
  },
]

const repairs: Repair[] = [
  {
    id: 'repair-1',
    date: '2026-07-20',
    roomId: 'room-terassi',
    statusId: 'status-done',
    priorityId: 'priority-high',
    executor: 'self',
    description: 'Terassin laudoituksen uusiminen douglaskuusilaudalla',
    cost: 0,
  },
  {
    id: 'repair-2',
    date: '2026-03-10',
    roomId: 'room-kylpyhuone',
    statusId: 'status-done',
    priorityId: 'priority-high',
    executor: 'service',
    description: 'Kylpyhuoneen seinien laatoitus',
    cost: 735,
  },
  {
    id: 'repair-3',
    date: '2026-06-02',
    roomId: 'room-olohuone',
    statusId: 'status-done',
    priorityId: 'priority-medium',
    executor: 'self',
    description: 'Olohuoneen seinien pohjustus ja maalaus',
    cost: 0,
  },
  {
    id: 'repair-4',
    date: '2026-09-01',
    roomId: 'room-eteinen',
    statusId: 'status-in-progress',
    priorityId: 'priority-low',
    executor: 'self',
    description: 'Eteisen tapetointi',
    cost: 0,
  },
  {
    id: 'repair-5',
    date: '2026-09-16',
    roomId: 'room-julkisivu',
    statusId: 'status-not-started',
    priorityId: 'priority-high',
    executor: 'service',
    description: 'Julkisivun laudoituksen huoltomaalaus',
    cost: 0,
  },
  {
    id: 'repair-6',
    date: '2026-09-16',
    roomId: 'room-makuuhuone',
    statusId: 'status-dream',
    priorityId: 'priority-low',
    description: 'Makuuhuoneen lattian uusiminen vinyylilankulla',
    cost: 0,
  },
  {
    id: 'repair-7',
    date: '2025-05-15',
    roomId: 'room-vesikatto',
    statusId: 'status-done',
    priorityId: 'priority-high',
    executor: 'service',
    description: 'Vesikatteen huoltokäsittely',
    cost: 2900,
  },
]

const materials: Material[] = [
  {
    id: 'material-1',
    repairId: 'repair-1',
    categoryId: 'cat-lauta',
    name: 'Terassilauta Douglaskuusi 28x145x5000 2kpl/pkt',
    quantity: 6,
    unit: 'pkt',
    price: 239.4,
    storeUrl: 'https://www.k-rauta.fi/tuote/terassilauta-douglaskuusi-28x145x5000-2kplpkt/6438356398474',
    fieldValues: { puulaji: 'Douglaskuusi', mitat: '28x145x5000 mm', pakkauskoko: '2 kpl/pkt' },
  },
  {
    id: 'material-2',
    repairId: 'repair-1',
    categoryId: 'cat-kiinnikkeet',
    name: 'Terassiruuvi RST',
    quantity: 1,
    unit: 'pkt (200 kpl)',
    price: 24.9,
    fieldValues: { tyyppi: 'Terassiruuvi, ruostumaton', koko: '5x70 mm' },
  },
  {
    id: 'material-3',
    repairId: 'repair-2',
    categoryId: 'cat-laatta',
    name: 'Seinälaatta Cello Lumi 20x40 valkoinen matta',
    quantity: 6,
    unit: 'm²',
    price: 119.4,
    storeUrl: 'https://www.k-rauta.fi/tuote/seinalaatta-cello-lumi-20x40-valkoinen-matta-12m/8690326060110',
    fieldValues: { mallisto: 'Cello Lumi', koko: '20x40 cm', vari: 'Valkoinen, matta' },
  },
  {
    id: 'material-4',
    repairId: 'repair-2',
    categoryId: 'cat-laatta',
    name: 'Seinälaatta Cello Reflex Lava Antrasiitti matta',
    quantity: 4,
    unit: 'm²',
    price: 95,
    storeUrl: 'https://www.k-rauta.fi/tuote/seinalaatta-cello-reflex-lava-antrasiitti-matta-12m/8690326058919',
    fieldValues: { mallisto: 'Cello Reflex Lava', koko: '20x40 cm', vari: 'Antrasiitti, matta' },
  },
  {
    id: 'material-5',
    repairId: 'repair-3',
    categoryId: 'cat-maali',
    name: 'Cello Feel Sisustusmaali täyshimmeä 0,9l',
    quantity: 2,
    unit: 'kpl (0,9 l)',
    price: 55.9,
    fieldValues: { tuotesarja: 'Cello Feel', kiiltoaste: 'Täyshimmeä', savy: 'PM1, sävytettävissä' },
  },
  {
    id: 'material-6',
    repairId: 'repair-3',
    categoryId: 'cat-pohjamaali',
    name: 'Cello Cristal Aqua Pohjamaali täyshimmeä 0,9l',
    quantity: 1,
    unit: 'kpl (0,9 l)',
    price: 29.95,
    fieldValues: { tuotesarja: 'Cello Cristal Aqua', kayttokohde: 'Sisäseinät, puu ja tasoite' },
  },
  {
    id: 'material-7',
    repairId: 'repair-4',
    categoryId: 'cat-tapetti',
    name: 'Kuitutapetti Boråstapeter Borosan Hem Sigrid',
    quantity: 3,
    unit: 'rll',
    price: 78.63,
    fieldValues: { mallisto: 'Borosan Hem – Sigrid 38726', mitat: '0,53 x 11,2 m' },
  },
  {
    id: 'material-8',
    repairId: 'repair-6',
    categoryId: 'cat-lattiapaallyste',
    name: 'Vinyylilankku Goodiy Fenix Kl33 Forest',
    fieldValues: { malli: 'Goodiy Fenix Kl33 Forest 7265IB', mitat: '2,579 m²/pkt' },
  },
]

export function buildSeedData(): PersistedData {
  return { version: 2, rooms, statuses, priorities, materialCategories, repairs, materials }
}
