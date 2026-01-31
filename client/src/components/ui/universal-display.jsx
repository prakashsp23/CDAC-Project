import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table'

/**
 * UniversalDisplay
 * Props:
 * - items: array of item objects
 * - idKey: string key to use as id (default 'id')
 * - columns: array of { key, title, render? } for table view
 * - renderCard: (item) => ReactNode : custom card renderer
 * - renderRow: (item) => ReactNode[] : custom row renderer
 * - defaultView: 'grid' | 'table'
 * - perRow: number (cards per row breakpoint)
 */
export default function UniversalDisplay({
  items = [],
  idKey = 'id',
  columns = [],
  renderCard = null,
  renderRow = null,
  defaultView = 'grid',
  perRow = 3,
  view: controlledView,
  onViewChange,
  showViewToggle = true,
}) {
  const [view, setView] = useState(defaultView)

  useEffect(() => {
    // keep view in localStorage so user preference persists across pages
    const saved = window.localStorage.getItem('univ_view')
    if (saved) setView(saved)
  }, [])

  useEffect(() => {
    window.localStorage.setItem('univ_view', view)
  }, [view])

  // determine the effective view (controlled or internal)
  const effectiveView = typeof controlledView === 'string' ? controlledView : view

  const setEffectiveView = (v) => {
    if (onViewChange) onViewChange(v)
    else setView(v)
  }

  // listen for external toggle events (simple decoupled integration)
  useEffect(() => {
    const handler = (e) => {
      const v = e?.detail
      if (v === 'grid' || v === 'table') setEffectiveView(v)
    }
    window.addEventListener('univ:viewchange', handler)
    return () => window.removeEventListener('univ:viewchange', handler)
  }, [])

  const GridRenderer = ({ item }) => {
    if (renderCard) return renderCard(item)

    // default card
    return (
      <Card className="rounded-[12px] shadow-sm border">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-card-foreground">{item.title || item.name || item.service || String(item[idKey])}</div>
              <div className="text-xs text-muted-foreground mt-1">{item.subtitle || item.desc || ''}</div>
            </div>
            <div className="text-xs text-muted-foreground bg-card px-2 py-0.5 rounded">{String(item[idKey])}</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const RowRenderer = ({ item }) => {
    if (renderRow) return renderRow(item)

    return (
      <TableRow key={item[idKey]}>
        {columns.length > 0 ? (
          columns.map(col => (
            <TableCell key={col.key}>{col.render ? col.render(item) : item[col.key]}</TableCell>
          ))
        ) : (
          <TableCell>{JSON.stringify(item)}</TableCell>
        )}
      </TableRow>
    )
  }

  return (
    <div>
      {effectiveView === 'grid' ? (
        <div className={`grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${perRow}`}>
          {items.map(item => (
            <GridRenderer key={item[idKey]} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-md shadow-sm border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow >
                {columns.length > 0 ? columns.map(col => (
                  <TableHead key={col.key} >{col.title}</TableHead>
                )) : <TableHead >Data</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(item => (
                <RowRenderer key={item[idKey]} item={item} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
