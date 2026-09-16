import { useState } from 'react'
import { useStore } from '../../store/store'
import { roomColor } from '../../utils/colors'

export function RoomsEditor() {
  const rooms = useStore((s) => s.rooms)
  const addRoom = useStore((s) => s.addRoom)
  const removeRoom = useStore((s) => s.removeRoom)
  const cycleRoomColor = useStore((s) => s.cycleRoomColor)
  const [name, setName] = useState('')

  function handleAdd() {
    const trimmed = name.trim()
    if (!trimmed) return
    addRoom(trimmed)
    setName('')
  }

  return (
    <section className="settings-section">
      <h3>Kohteet</h3>
      <ul className="settings-list">
        {rooms.map((room) => {
          const color = roomColor(room.colorIndex)
          return (
            <li key={room.id} className="settings-list__item">
              <span className="settings-list__room">
                <button
                  type="button"
                  className="color-dot"
                  style={{ background: color.text }}
                  aria-label="Vaihda väri"
                  title="Vaihda väri"
                  onClick={() => cycleRoomColor(room.id)}
                />
                {room.name}
              </span>
              <button
                type="button"
                className="icon-button icon-button--danger"
                aria-label="Poista kohde"
                onClick={() => removeRoom(room.id)}
              >
                ×
              </button>
            </li>
          )
        })}
        {rooms.length === 0 && <li className="empty-state empty-state--inline">Kohteita ei ole lisätty</li>}
      </ul>
      <div className="settings-add-row">
        <input
          className="field__input"
          type="text"
          placeholder="Kohteen nimi (esim. Keittiö, Terassi)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button type="button" className="button button--secondary" onClick={handleAdd}>
          Lisää
        </button>
      </div>
    </section>
  )
}
