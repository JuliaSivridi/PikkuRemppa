import { useStore } from '../../store/store'

export function ResetDataButton() {
  const resetToSeed = useStore((s) => s.resetToSeed)

  function handleClick() {
    if (confirm('Poistetaanko kaikki nykyiset tiedot ja palautetaanko esimerkkitiedot?')) {
      resetToSeed()
    }
  }

  return (
    <section className="settings-section">
      <h3>Tietojen nollaus</h3>
      <p className="settings-section__hint">
        Poistaa kaikki remontit, materiaalit, kohteet ja kategoriat, ja täyttää sovelluksen uudelleen
        esimerkkitiedoilla.
      </p>
      <button type="button" className="button button--danger" onClick={handleClick}>
        Palauta esimerkkitiedot
      </button>
    </section>
  )
}
