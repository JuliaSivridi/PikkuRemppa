import { Fragment, useState } from 'react'
import { useStore } from '../../store/store'
import type { RepairWithMaterials } from '../../hooks/useRepairsWithMaterials'
import type { Material, MaterialCategory } from '../../types'
import { formatDate } from '../../utils/date'
import { formatCurrency, formatQuantity } from '../../utils/format'
import { Tag } from '../common/Tag'
import { ExternalLinkIcon } from '../common/ExternalLinkIcon'

interface RepairsTableProps {
  repairs: RepairWithMaterials[]
}

const EXECUTOR_LABEL: Record<string, string> = {
  self: 'Itse',
  service: 'Palveluntarjoaja',
}

function dynamicFieldValues(material: Material, category: MaterialCategory | undefined): string[] {
  if (!category) return []
  return category.fields.map((f) => material.fieldValues[f.key]).filter((v): v is string => Boolean(v))
}

function dynamicFieldsTitle(material: Material, category: MaterialCategory | undefined): string {
  if (!category) return ''
  return category.fields
    .filter((f) => material.fieldValues[f.key])
    .map((f) => `${f.label}: ${material.fieldValues[f.key]}`)
    .join('\n')
}

export function RepairsTable({ repairs }: RepairsTableProps) {
  const materialCategories = useStore((s) => s.materialCategories)
  const removeRepair = useStore((s) => s.removeRepair)
  const categoriesById = new Map(materialCategories.map((c) => [c.id, c]))
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setCollapsedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <table className="repairs-table">
      <thead>
        <tr>
          <th></th>
          <th>Päivämäärä</th>
          <th>Tilanne</th>
          <th>Prioriteetti</th>
          <th>Tekijä</th>
          <th>Kuvaus</th>
          <th>Yhteensä</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {repairs.map((repair) => {
          const collapsed = collapsedIds.has(repair.id)
          const hasMaterials = repair.materials.length > 0

          return (
            <Fragment key={repair.id}>
              <tr className="repairs-table__row">
                <td className="repairs-table__toggle-cell">
                  <button
                    type="button"
                    className="repairs-table__toggle"
                    onClick={() => toggle(repair.id)}
                    disabled={!hasMaterials}
                    aria-label={collapsed ? 'Näytä materiaalit' : 'Piilota materiaalit'}
                  >
                    {hasMaterials ? (collapsed ? '▸' : '▾') : ''}
                  </button>
                </td>
                <td>{formatDate(repair.date)}</td>
                <td>{repair.status && <Tag color={repair.statusColor}>{repair.status.name}</Tag>}</td>
                <td>{repair.priority && <Tag color={repair.priorityColor}>{repair.priority.name}</Tag>}</td>
                <td>{repair.executor && EXECUTOR_LABEL[repair.executor]}</td>
                <td className="repairs-table__description">
                  <div className="repairs-table__description-inner">
                    <Tag color={repair.roomColor}>{repair.room?.name ?? '—'}</Tag>
                    <span>{repair.description}</span>
                  </div>
                </td>
                <td className="repairs-table__total">{formatCurrency(repair.total)}</td>
                <td>
                  <button
                    type="button"
                    className="icon-button icon-button--danger"
                    aria-label="Poista remontti"
                    title="Poista remontti"
                    onClick={() => {
                      if (confirm('Poistetaanko tämä remontti ja siihen liittyvät materiaalit?')) removeRepair(repair.id)
                    }}
                  >
                    ×
                  </button>
                </td>
              </tr>

              {hasMaterials && !collapsed && (
                <tr className="repairs-table__materials-row">
                  <td colSpan={8}>
                    <table className="materials-table">
                      <thead>
                        <tr>
                          <th>Tyyppi</th>
                          <th>Nimi</th>
                          <th>Määrä</th>
                          <th>Hinta</th>
                        </tr>
                      </thead>
                      <tbody>
                        {repair.materials.map((m) => {
                          const category = categoriesById.get(m.categoryId)
                          return (
                            <tr key={m.id}>
                              <td>{category && <Tag>{category.name}</Tag>}</td>
                              <td className="materials-table__name">
                                <div className="materials-table__name-line">
                                  <span className="materials-table__name-text">{m.name}</span>
                                  {m.storeUrl && (
                                    <a
                                      href={m.storeUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      aria-label="Linkki tuotteeseen"
                                      title="Linkki tuotteeseen"
                                    >
                                      <ExternalLinkIcon />
                                    </a>
                                  )}
                                </div>
                                <div className="materials-table__fields" title={dynamicFieldsTitle(m, category)}>
                                  {dynamicFieldValues(m, category).join(' · ')}
                                </div>
                              </td>
                              <td className="materials-table__qty">{formatQuantity(m.quantity, m.unit)}</td>
                              <td className="materials-table__price">
                                {formatCurrency(m.price)}
                                {m.includeInTotal === false && (
                                  <span className="material-row__excluded"> (ei summassa)</span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </Fragment>
          )
        })}
      </tbody>
    </table>
  )
}
