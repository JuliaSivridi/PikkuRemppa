import { useState, type FormEvent } from 'react'
import { useStore } from '../../store/store'
import type { DraftMaterialRow, Executor } from '../../types'
import { today } from '../../utils/date'
import { Modal } from '../common/Modal'
import { MaterialSubForm } from './MaterialSubForm'

interface AddRepairFormProps {
  onClose: () => void
}

function defaultStatusId(statuses: { id: string; name: string }[]): string {
  return statuses.find((s) => s.name === 'Ei aloitettu')?.id ?? statuses[0]?.id ?? ''
}

export function AddRepairForm({ onClose }: AddRepairFormProps) {
  const rooms = useStore((s) => s.rooms)
  const statuses = useStore((s) => s.statuses)
  const priorities = useStore((s) => s.priorities)
  const materialCategories = useStore((s) => s.materialCategories)
  const addRepair = useStore((s) => s.addRepair)

  const [date, setDate] = useState(today())
  const [roomId, setRoomId] = useState('')
  const [statusId, setStatusId] = useState(() => defaultStatusId(statuses))
  const [priorityId, setPriorityId] = useState('')
  const [executor, setExecutor] = useState<Executor | ''>('')
  const [description, setDescription] = useState('')
  const [cost, setCost] = useState<number | undefined>(undefined)
  const [materials, setMaterials] = useState<DraftMaterialRow[]>([])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!roomId || !statusId || !description || !date) return

    addRepair(
      {
        date,
        roomId,
        statusId,
        priorityId: priorityId || undefined,
        executor: executor || undefined,
        description,
        cost: cost ?? 0,
      },
      materials.map(({ _key, ...rest }) => rest),
    )
    onClose()
  }

  return (
    <Modal title="Uusi remontti" onClose={onClose}>
      <form className="repair-form" onSubmit={handleSubmit}>
        <div className="repair-form__grid">
          <label className="field">
            <span className="field__label">Päivämäärä</span>
            <input className="field__input" type="date" value={date} required onChange={(e) => setDate(e.target.value)} />
          </label>

          <label className="field">
            <span className="field__label">Kohde</span>
            <select className="field__input" value={roomId} required onChange={(e) => setRoomId(e.target.value)}>
              <option value="">Valitse kohde</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field__label">Työkustannus, €</span>
            <input
              className="field__input"
              type="number"
              min={0}
              step="any"
              value={cost ?? ''}
              onChange={(e) => setCost(e.target.value === '' ? undefined : Number(e.target.value))}
            />
            <span className="field__hint">Oma tai palveluntarjoajan työ, ilman materiaaleja</span>
          </label>

          <label className="field">
            <span className="field__label">Tilanne</span>
            <select className="field__input" value={statusId} required onChange={(e) => setStatusId(e.target.value)}>
              <option value="">Valitse tilanne</option>
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field__label">Prioriteetti</span>
            <select className="field__input" value={priorityId} onChange={(e) => setPriorityId(e.target.value)}>
              <option value="">—</option>
              {priorities.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field__label">Tekijä</span>
            <select
              className="field__input"
              value={executor}
              onChange={(e) => setExecutor(e.target.value as Executor | '')}
            >
              <option value="">—</option>
              <option value="self">Itse</option>
              <option value="service">Palveluntarjoaja</option>
            </select>
          </label>
        </div>

        <label className="field">
          <span className="field__label">Kuvaus</span>
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
            Lisää ensin vähintään yksi kohde asetuksissa.
          </p>
        )}

        <div className="repair-form__actions">
          <button type="button" className="button button--secondary" onClick={onClose}>
            Peruuta
          </button>
          <button type="submit" className="button button--primary" disabled={rooms.length === 0}>
            Tallenna
          </button>
        </div>
      </form>
    </Modal>
  )
}
