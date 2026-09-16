import { useState, type FormEvent } from 'react'
import { useStore } from '../../store/store'
import type { DraftMaterialRow } from '../../types'
import { today } from '../../utils/date'
import { Modal } from '../common/Modal'
import { MaterialSubForm } from './MaterialSubForm'

interface AddRepairFormProps {
  onClose: () => void
}

export function AddRepairForm({ onClose }: AddRepairFormProps) {
  const rooms = useStore((s) => s.rooms)
  const materialCategories = useStore((s) => s.materialCategories)
  const addRepair = useStore((s) => s.addRepair)

  const [date, setDate] = useState(today())
  const [roomId, setRoomId] = useState('')
  const [description, setDescription] = useState('')
  const [cost, setCost] = useState<number | undefined>(undefined)
  const [materials, setMaterials] = useState<DraftMaterialRow[]>([])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!roomId || !description || !date) return

    addRepair(
      { date, roomId, description, cost: cost ?? 0 },
      materials.map(({ _key, ...rest }) => rest),
    )
    onClose()
  }

  return (
    <Modal title="Новый ремонт" onClose={onClose}>
      <form className="repair-form" onSubmit={handleSubmit}>
        <div className="repair-form__grid">
          <label className="field">
            <span className="field__label">Дата</span>
            <input className="field__input" type="date" value={date} required onChange={(e) => setDate(e.target.value)} />
          </label>

          <label className="field">
            <span className="field__label">Комната</span>
            <select className="field__input" value={roomId} required onChange={(e) => setRoomId(e.target.value)}>
              <option value="">Выберите комнату</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field__label">Стоимость, €</span>
            <input
              className="field__input"
              type="number"
              min={0}
              value={cost ?? ''}
              onChange={(e) => setCost(e.target.value === '' ? undefined : Number(e.target.value))}
            />
          </label>
        </div>

        <label className="field">
          <span className="field__label">Описание</span>
          <textarea
            className="field__input field__input--textarea"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <MaterialSubForm materials={materials} categories={materialCategories} onChange={setMaterials} />

        {rooms.length === 0 && (
          <p className="empty-state empty-state--inline">
            Сначала добавьте хотя бы одну комнату в настройках.
          </p>
        )}

        <div className="repair-form__actions">
          <button type="button" className="button button--secondary" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="button button--primary" disabled={rooms.length === 0}>
            Сохранить
          </button>
        </div>
      </form>
    </Modal>
  )
}
