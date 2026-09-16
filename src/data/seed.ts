import type { Material, MaterialCategory, PersistedData, Repair, Room } from '../types'

const rooms: Room[] = [
  { id: 'room-kitchen', name: 'Кухня' },
  { id: 'room-bathroom', name: 'Ванная' },
  { id: 'room-living', name: 'Гостиная' },
  { id: 'room-hallway', name: 'Прихожая' },
]

const materialCategories: MaterialCategory[] = [
  {
    id: 'cat-boards',
    name: 'Доски',
    fields: [
      { key: 'model', label: 'Модель', type: 'text' },
      { key: 'size', label: 'Размеры', type: 'text' },
    ],
  },
  {
    id: 'cat-paint',
    name: 'Краска',
    fields: [
      { key: 'model', label: 'Название/модель', type: 'text' },
      { key: 'colorCode', label: 'Код цвета', type: 'text' },
    ],
  },
  {
    id: 'cat-fasteners',
    name: 'Крепёж',
    fields: [
      { key: 'model', label: 'Тип/модель', type: 'text' },
      { key: 'size', label: 'Размер', type: 'text' },
    ],
  },
  {
    id: 'cat-tiles',
    name: 'Плитка',
    fields: [
      { key: 'model', label: 'Коллекция/модель', type: 'text' },
      { key: 'size', label: 'Размер', type: 'text' },
    ],
  },
]

const repairs: Repair[] = [
  {
    id: 'repair-1',
    date: '2026-08-02',
    roomId: 'room-bathroom',
    description: 'Замена плитки на полу и покраска стен',
    cost: 640,
  },
  {
    id: 'repair-2',
    date: '2026-07-18',
    roomId: 'room-kitchen',
    description: 'Сборка и монтаж новых полок',
    cost: 210,
  },
  {
    id: 'repair-3',
    date: '2026-06-05',
    roomId: 'room-living',
    description: 'Покраска стен в гостиной',
    cost: 180,
  },
  {
    id: 'repair-4',
    date: '2026-05-20',
    roomId: 'room-hallway',
    description: 'Установка вешалки и полки для обуви',
    cost: 95,
  },
]

const materials: Material[] = [
  {
    id: 'material-1',
    repairId: 'repair-1',
    categoryId: 'cat-tiles',
    name: 'Керамогранит Como',
    quantity: 8,
    unit: 'м²',
    price: 240,
    storeUrl: 'https://www.k-rauta.fi/',
    fieldValues: { model: 'Como Grey', size: '30x60 см' },
  },
  {
    id: 'material-2',
    repairId: 'repair-1',
    categoryId: 'cat-paint',
    name: 'Краска влагостойкая',
    quantity: 2,
    unit: 'л',
    price: 45,
    storeUrl: 'https://www.stark-suomi.fi/',
    fieldValues: { model: 'Tikkurila Otex', colorCode: 'S 0502-Y' },
  },
  {
    id: 'material-3',
    repairId: 'repair-2',
    categoryId: 'cat-boards',
    name: 'Доска сосновая',
    quantity: 6,
    unit: 'шт',
    price: 54,
    fieldValues: { model: 'Сосна сорт AB', size: '20x200x2000 мм' },
  },
  {
    id: 'material-4',
    repairId: 'repair-2',
    categoryId: 'cat-fasteners',
    name: 'Саморезы по дереву',
    quantity: 1,
    unit: 'уп',
    price: 8,
    fieldValues: { model: 'Универсальные', size: '4x40 мм' },
  },
  {
    id: 'material-5',
    repairId: 'repair-3',
    categoryId: 'cat-paint',
    name: 'Краска интерьерная',
    quantity: 3,
    unit: 'л',
    price: 62,
    storeUrl: 'https://www.k-rauta.fi/',
    fieldValues: { model: 'Fresh Wind', colorCode: 'S 1502-B' },
  },
  {
    id: 'material-6',
    repairId: 'repair-4',
    categoryId: 'cat-fasteners',
    name: 'Дюбели',
    quantity: 1,
    unit: 'уп',
    price: 6,
    fieldValues: { model: 'Металлические', size: '8x40 мм' },
  },
]

export function buildSeedData(): PersistedData {
  return { version: 1, rooms, materialCategories, repairs, materials }
}
