import React, { useEffect, useState, useMemo } from 'react'
import { Button } from '../../ui/button'
import { TableRow, TableCell } from '../../ui/table'
import UniversalDisplay from '../../ui/universal-display'
import { useNavigate } from 'react-router-dom'
import ViewToggle from '../../ui/ViewToggle'
import { getUserServiceHistory } from '../../../services/mockDataService'
import { toast } from 'sonner'

export default function MyServicesPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')
  const [viewLocal, setViewLocal] = useState(() => window.localStorage.getItem('univ_view') || 'grid')
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const history = await getUserServiceHistory(1);
        setServices(history.map(s => ({
          id: s.service_id,
          name: s.service_name,
          date: s.created_at ? s.created_at.split('T')[0] : 'N/A',
          status: s.status === 'ONGOING' ? 'In Progress' : (s.status === 'REQUESTED' ? 'Pending' : (s.status === 'COMPLETED' ? 'Completed' : 'Cancelled')),
          desc: s.description,
          car: s.car_details
        })));
      } catch (e) {
        console.error(e);
        toast.error("Failed to load service history");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const counts = useMemo(() => {
    const c = { All: services.length, Ongoing: 0, Completed: 0, Cancelled: 0 }
    services.forEach(s => {
      if (s.status === 'In Progress' || s.status === 'Pending' || s.status === 'Awaiting Approval') c.Ongoing++
      if (s.status === 'Completed') c.Completed++
      if (s.status === 'Cancelled') c.Cancelled++
    })
    return c
  }, [services])

  const filtered = useMemo(() => {
    if (filter === 'All') return services
    if (filter === 'Ongoing') return services.filter(s => s.status === 'In Progress' || s.status === 'Pending' || s.status === 'Awaiting Approval')
    if (filter === 'Completed') return services.filter(s => s.status === 'Completed')
    if (filter === 'Cancelled') return services.filter(s => s.status === 'Cancelled')
    return services
  }, [filter, services])

  if (loading) return <div className="p-8">Loading history...</div>;

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
          {['All', 'Ongoing', 'Completed', 'Cancelled'].map(key => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`text-sm inline-flex items-center gap-2 px-3 py-1 rounded-md font-medium transition-colors ${filter === key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
              <span>{key}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === key ? 'bg-primary-foreground/20' : 'bg-background'}`}>{counts[key] ?? 0}</span>
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
