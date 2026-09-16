import { useState } from 'react'
import { useStore } from '../../store/store'

export function RoomsEditor() {
  const rooms = useStore((s) => s.rooms)
  const addRoom = useStore((s) => s.addRoom)
  const removeRoom = useStore((s) => s.removeRoom)
  const [name, setName] = useState('')

  function handleAdd() {
    const trimmed = name.trim()
    if (!trimmed) return
    addRoom(trimmed)
    setName('')
  }

  return (
    <section className="settings-section">
      <h3>Комнаты</h3>
      <ul className="settings-list">
        {rooms.map((room) => (
          <li key={room.id} className="settings-list__item">
            <span>{room.name}</span>
            <button
              type="button"
              className="icon-button icon-button--danger"
              aria-label="Удалить комнату"
              onClick={() => removeRoom(room.id)}
            >
              ×
            </button>
          </li>
        ))}
        {rooms.length === 0 && <li className="empty-state empty-state--inline">Комнаты не добавлены</li>}
      </ul>
      <div className="settings-add-row">
        <input
          className="field__input"
          type="text"
          placeholder="Название комнаты"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button type="button" className="button button--secondary" onClick={handleAdd}>
          Добавить
        </button>
      </div>
    </section>
  )
}
