import { useStore } from '../../store/store'

export function ResetDataButton() {
  const resetToSeed = useStore((s) => s.resetToSeed)

  function handleClick() {
    if (confirm('Удалить все текущие данные и вернуть тестовый набор?')) {
      resetToSeed()
    }
  }

  return (
    <section className="settings-section">
      <h3>Сброс данных</h3>
      <p className="settings-section__hint">
        Удаляет все ремонты, материалы, комнаты и категории и заново заполняет приложение тестовыми данными.
      </p>
      <button type="button" className="button button--danger" onClick={handleClick}>
        Сбросить к тестовым данным
      </button>
    </section>
  )
}
