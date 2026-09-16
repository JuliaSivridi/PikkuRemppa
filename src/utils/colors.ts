export interface TagColor {
  bg: string
  text: string
}

// Rooms/kohteet: a muted, low-saturation palette spread evenly around the wheel.
// Kept deliberately dusty/desaturated so it never reads as the same "family"
// as the more vivid status/priority colors below, even where hues are close.
const ROOM_HUE_COUNT = 10
const ROOM_HUE_OFFSET = 18

export const ROOM_PALETTE: TagColor[] = Array.from({ length: ROOM_HUE_COUNT }, (_, i) => {
  const hue = Math.round((360 / ROOM_HUE_COUNT) * i + ROOM_HUE_OFFSET)
  return { bg: `hsl(${hue}, 28%, 91%)`, text: `hsl(${hue}, 32%, 30%)` }
})

export function roomColor(colorIndex: number | undefined): TagColor {
  const index = ((colorIndex ?? 0) % ROOM_PALETTE.length + ROOM_PALETTE.length) % ROOM_PALETTE.length
  return ROOM_PALETTE[index]
}

// Statuses: a fixed categorical set (cool/neutral tones), one per position in
// the configured status list. Cycles if the user adds more than 4.
export const STATUS_PALETTE: TagColor[] = [
  { bg: 'hsl(265, 40%, 92%)', text: 'hsl(265, 35%, 36%)' }, // e.g. "Haave" – aspirational
  { bg: 'hsl(30, 10%, 88%)', text: 'hsl(30, 10%, 34%)' }, // e.g. "Ei aloitettu" – neutral
  { bg: 'hsl(205, 55%, 91%)', text: 'hsl(205, 55%, 32%)' }, // e.g. "Käynnissä" – active
  { bg: 'hsl(150, 42%, 89%)', text: 'hsl(150, 45%, 27%)' }, // e.g. "Valmis" – done
]

export function statusColor(index: number): TagColor {
  return STATUS_PALETTE[index % STATUS_PALETTE.length]
}

// Priorities: a traffic-light severity gradient (green -> amber -> red) across
// however many priority levels are configured, so levels are never the same color.
export function priorityColor(index: number, total: number): TagColor {
  const t = total <= 1 ? 0 : index / (total - 1)
  const hue = Math.round(132 - t * 128) // 132 (green) -> 4 (red)
  return { bg: `hsl(${hue}, 58%, 90%)`, text: `hsl(${hue}, 55%, 30%)` }
}
