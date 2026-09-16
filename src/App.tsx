import { useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import { ViewToggle, type View } from './components/layout/ViewToggle'
import { RepairsList } from './components/repairs/RepairsList'
import { MaterialsView } from './components/materials/MaterialsView'
import { SettingsScreen } from './components/settings/SettingsScreen'
import { AddRepairForm } from './components/forms/AddRepairForm'
import { Fab } from './components/common/Fab'

type Screen = 'main' | 'settings'

export default function App() {
  const [screen, setScreen] = useState<Screen>('main')
  const [view, setView] = useState<View>('repairs')
  const [showAddForm, setShowAddForm] = useState(false)

  return (
    <AppShell
      title="PikkuRemppa"
      headerRight={
        screen === 'main' ? (
          <button type="button" className="icon-button" aria-label="Asetukset" onClick={() => setScreen('settings')}>
            ⚙
          </button>
        ) : (
          <button type="button" className="button button--secondary" onClick={() => setScreen('main')}>
            ← Takaisin
          </button>
        )
      }
    >
      {screen === 'settings' ? (
        <SettingsScreen />
      ) : (
        <>
          <ViewToggle view={view} onChange={setView} />
          {view === 'repairs' ? <RepairsList /> : <MaterialsView />}
          {view === 'repairs' && <Fab onClick={() => setShowAddForm(true)} label="Lisää remontti" />}
        </>
      )}

      {showAddForm && <AddRepairForm onClose={() => setShowAddForm(false)} />}
    </AppShell>
  )
}
