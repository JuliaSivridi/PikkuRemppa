import { RoomsEditor } from './RoomsEditor'
import { MaterialCategoriesEditor } from './MaterialCategoriesEditor'
import { ResetDataButton } from './ResetDataButton'

export function SettingsScreen() {
  return (
    <div className="settings-screen">
      <RoomsEditor />
      <MaterialCategoriesEditor />
      <ResetDataButton />
    </div>
  )
}
