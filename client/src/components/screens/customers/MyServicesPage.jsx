import React from 'react'
import { Button } from '../../ui/button'
import { TableRow, TableCell } from '../../ui/table'
import UniversalDisplay from '../../ui/universal-display'
import { useNavigate } from 'react-router-dom'
import ViewToggle from '../../ui/ViewToggle'

const SERVICES = [
  { id: 1, name: 'Oil Change' , date: '2025-11-20', status: 'Completed',desc:'Full synthetic oil with filter replacement',car:'2022 Honda CRV' },
  { id: 2, name: 'Tire Rotation', date: '2025-11-22', status: 'Pending',desc:'Rotate and balance tires',car:'2020 Toyota Corolla' },
  { id: 3, name: 'Brake Repair', date: '2025-11-25', status: 'In Progress', desc:'Brake system repair and replacement',car:'2021 Ford Escape' },
  { id: 4, name: 'Exterior Detailing', date: '2025-10-30', status: 'Completed', desc:'Wash, wax and polish',car:'2019 BMW X3' },
  { id: 5, name: 'Battery Check', date: '2025-11-10', status: 'Awaiting Approval', desc:'Battery test and replacement',car:'2018 Audi A4' },
  { id: 6, name: 'AC Service', date: '2025-11-12', status: 'Pending', desc:'Recharge and sanitize AC',car:'2017 Mercedes C-Class' },
]

export default function MyServicesPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = React.useState('All')
  const [viewLocal, setViewLocal] = React.useState(() => window.localStorage.getItem('univ_view') || 'grid')

  const counts = React.useMemo(() => {
    const c = { All: SERVICES.length, Ongoing: 0, Completed: 0, Cancelled: 0 }
    SERVICES.forEach(s => {
      if (s.status === 'In Progress' || s.status === 'Pending' || s.status === 'Awaiting Approval') c.Ongoing++
      if (s.status === 'Completed') c.Completed++
      if (s.status === 'Cancelled') c.Cancelled++
    })
    return c
  }, [])

  const filtered = React.useMemo(() => {
    if (filter === 'All') return SERVICES
    if (filter === 'Ongoing') return SERVICES.filter(s => s.status === 'In Progress' || s.status === 'Pending' || s.status === 'Awaiting Approval')
    if (filter === 'Completed') return SERVICES.filter(s => s.status === 'Completed')
    if (filter === 'Cancelled') return SERVICES.filter(s => s.status === 'Cancelled')
    return SERVICES
  }, [filter])

  return (
    <div className="p-6 w-[90%] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">My Services</h1>
          <p className="text-muted-foreground mt-1">View and manage your service history.</p>
        </div>
        <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {['All','Ongoing','Completed','Cancelled'].map(key => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`text-sm inline-flex items-center gap-2 px-3 py-1 rounded-md font-medium transition-colors ${filter===key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
              <span>{key}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter===key ? 'bg-primary-foreground/20' : 'bg-background'}`}>{counts[key] ?? 0}</span>
            </button>
          ))}
        </div>
        <ViewToggle view={viewLocal} onViewChange={setViewLocal} />
      </div>
      
      {/* Display Area */}
      <UniversalDisplay
        items={filtered}
        idKey="id"
        columns={[
          { key: 'name', title: 'Service Name' },
          { key: 'date', title: 'Date' },
          { key: 'status', title: 'Status' },
          { key: 'desc', title: 'Description' },
          { key: 'car', title: 'Associated Car' },
          { key: 'actions', title: 'Actions' },
        ]}
        perRow={3}
        view={viewLocal}
        onViewChange={setViewLocal}
        showViewToggle={false} // Handled outside
        renderCard={(s) => (
          <div className="p-0">
            <div className="rounded-lg shadow-sm border bg-card h-full flex flex-col">
              <div className="p-4 flex-grow">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-card-foreground">{s.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.desc}</div>
                    <div className="text-xs text-muted-foreground mt-2 font-medium">{s.car}</div>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">#{s.id}</div>
                </div>
              </div>
              <div className="border-t p-3 flex items-center justify-between">
                <span className="text-xs font-medium px-2 py-1 bg-secondary text-secondary-foreground rounded">{s.status}</span>
                <Button size="sm" variant="ghost" onClick={() => alert(`View details for ${s.name}`)}>View Details</Button>
              </div>
            </div>
          </div>
        )}
        renderRow={(s) => (
          <TableRow key={s.id}>
            <TableCell className="font-medium">{s.name}</TableCell>
            <TableCell>{s.date}</TableCell>
            <TableCell>
              <span className="text-xs font-medium px-2 py-1 bg-secondary text-secondary-foreground rounded">{s.status}</span>
            </TableCell>
            <TableCell className="text-muted-foreground">{s.desc}</TableCell>
            <TableCell className="text-muted-foreground">{s.car}</TableCell>
            <TableCell className="text-right">
              <Button size="sm" onClick={() => alert(`View details for ${s.name}`)} variant="ghost">View</Button>
            </TableCell>
          </TableRow>
        )}
      />
    </div>
  )
}
