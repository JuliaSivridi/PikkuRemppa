import { useStore } from '../../store/store'
import { SimpleListEditor } from '../common/SimpleListEditor'
import { RoomsEditor } from './RoomsEditor'
import { MaterialCategoriesEditor } from './MaterialCategoriesEditor'
import { ResetDataButton } from './ResetDataButton'

export function SettingsScreen() {
  const statuses = useStore((s) => s.statuses)
  const addStatus = useStore((s) => s.addStatus)
  const removeStatus = useStore((s) => s.removeStatus)

  const priorities = useStore((s) => s.priorities)
  const addPriority = useStore((s) => s.addPriority)
  const removePriority = useStore((s) => s.removePriority)

  return (
    <div className="settings-screen">
      <RoomsEditor />
      <SimpleListEditor
        title="Tilanteet"
        items={statuses}
        placeholder="Tilanteen nimi (esim. Käynnissä)"
        emptyLabel="Tilanteita ei ole lisätty"
        onAdd={addStatus}
        onRemove={removeStatus}
      />
      <SimpleListEditor
        title="Prioriteetit"
        items={priorities}
        placeholder="Prioriteetin nimi (esim. Korkea)"
        emptyLabel="Prioriteetteja ei ole lisätty"
        onAdd={addPriority}
        onRemove={removePriority}
      />
      <MaterialCategoriesEditor />
      <ResetDataButton />
    </div>
  )
}
