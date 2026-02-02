/* eslint-disable react/prop-types */
import { useState, useMemo } from 'react'
import { Button } from '../../ui/button'
import { TableRow, TableCell } from '../../ui/table'
import UniversalDisplay from '../../ui/universal-display'
import { useNavigate } from 'react-router-dom'
import ViewToggle from '../../ui/ViewToggle'
import { useGetMyServices } from '../../../query/queries/serviceQueries'
import { Car, Calendar, User, IndianRupee, ArrowRight, Wrench, Star } from 'lucide-react'
import { Card, CardContent } from '../../ui/card'
import FeedbackDialog from './components/FeedbackDialog'

// Status color coding for badge only
const STATUS_UI = {
  Pending: { label: 'Pending', class: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
  Accepted: { label: 'Accepted', class: 'bg-blue-50 text-blue-800 border-blue-200' },
  'In Progress': { label: 'In Progress', class: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
  Completed: { label: 'Completed', class: 'bg-green-50 text-green-800 border-green-200' },
  Cancelled: { label: 'Cancelled', class: 'bg-red-50 text-red-800 border-red-200' }
}

function StatusBadge({ status }) {
  const conf = STATUS_UI[status] || { label: status, class: 'bg-muted text-foreground border' }
  return (
    <span
      className={`inline-flex px-3 py-0.5 rounded-full border text-xs font-semibold min-w-[80px] items-center justify-center transition-colors ${conf.class}`}
      aria-label={`${conf.label} status`}
    >
      {conf.label}
    </span>
  )
}

export default function MyServicesPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')
  const [viewLocal, setViewLocal] = useState(() => window.localStorage.getItem('univ_view') || 'grid')

  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackService, setFeedbackService] = useState(null)

  const { data: servicesData, isLoading: loading, error: servicesError } = useGetMyServices()

  const services = useMemo(() => {
    if (!servicesData?.data) return []

    return servicesData.data.map(s => {
      // Safely format date
      let formattedDate = 'N/A'
      if (s.createdOn) {
        try {
          formattedDate = new Date(s.createdOn).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        } catch (err) {
          console.error('Invalid date format:', s.createdOn, err)
        }
      }

      // Map status safely
      const statusMap = {
        'PENDING': 'Pending',
        'ACCEPTED': 'Accepted',
        'ONGOING': 'In Progress',
        'COMPLETED': 'Completed',
        'CANCELLED': 'Cancelled'
      }

      // Format vehicle info safely
      const vehicleInfo = s.vehicle
        ? {
          brand: s.vehicle.brand || '',
          model: s.vehicle.model || '',
          regNumber: s.vehicle.regNumber || '',
          display: `${s.vehicle.brand || ''} ${s.vehicle.model || ''} (${s.vehicle.regNumber || 'N/A'})`
        }
        : null

      return {
        id: s.id,
        name: s.catalog?.serviceName || 'N/A',
        date: formattedDate,
        status: statusMap[s.status] || s.status,
        rawStatus: s.status,
        desc: s.catalog?.description || s.customerNotes || 'No description',
        vehicle: vehicleInfo,
        paymentStatus: s.paymentStatus,
        totalAmount: s.totalAmount,
        mechanic: s.mechanic,
        hasFeedback: s.hasFeedback
      }
    })
  }, [servicesData])

  const TABS = [
    { key: 'All', label: 'All', indicator: '' },
    { key: 'Ongoing', label: 'Ongoing', indicator: 'bg-cyan-100' },
    { key: 'Completed', label: 'Completed', indicator: 'bg-green-100' },
    { key: 'Cancelled', label: 'Cancelled', indicator: 'bg-red-100' }
  ]

  const counts = useMemo(() => {
    const c = { All: services.length, Ongoing: 0, Completed: 0, Cancelled: 0 }
    services.forEach(s => {
      if (['Pending', 'Accepted', 'In Progress'].includes(s.status)) c.Ongoing++
      if (s.status === 'Completed') c.Completed++
      if (s.status === 'Cancelled') c.Cancelled++
    })
    return c
  }, [services])

  const filtered = useMemo(() => {
    if (filter === 'All') return services
    if (filter === 'Ongoing') return services.filter(s => ['Pending', 'Accepted', 'In Progress'].includes(s.status))
    if (filter === 'Completed') return services.filter(s => s.status === 'Completed')
    if (filter === 'Cancelled') return services.filter(s => s.status === 'Cancelled')
    return services
  }, [filter, services])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary/60 mb-3"></div>
        <span className="text-lg text-muted-foreground">Loading services...</span>
      </div>
    )
  }

  if (servicesError) {
    return (
      <div className="max-w-lg mx-auto p-8 rounded border border-destructive/30 bg-destructive/5 text-destructive text-center shadow">
        <div className="font-semibold text-2xl mb-2">Oops!</div>
        <div className="text-lg font-mono">{servicesError.message}</div>
      </div>
    )
  }

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-8">
      {/* Header */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight leading-snug">My Services</h1>
          <p className="text-muted-foreground mt-2 text-base">
            See all your bookings and track status easily.
          </p>
        </div>
      </header>

      {/* Filter tabs and view toggle */}
      <nav className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between items-start sm:items-center mb-5">
        <div className="flex flex-wrap gap-2">
          {TABS.map(tab => {
            const selected = filter === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border transition-all outline-none  ${selected
                  ? `bg-background border-muted-foreground text-muted-foreground `
                  : 'bg-muted'
                  }`}
                aria-pressed={selected}
                aria-label={`Show ${tab.label} services`}
              >
                <span>{tab.label}</span>
                <span className="ml-2 inline-flex px-2 py-0.5 rounded-full text-xs font-semibold  border border-muted-foreground/30">{counts[tab.key] ?? 0}</span>
              </button>
            )
          })}
        </div>
        <ViewToggle view={viewLocal} onViewChange={setViewLocal} />
      </nav>

      <section>
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
          perRow={2}
          view={viewLocal}
          onViewChange={setViewLocal}
          showViewToggle={false} // Handled above
          renderCard={(s) => (
            <Card className="group hover:shadow-lg transition-all duration-300 border  overflow-hidden">
              <CardContent className="p-0">
                {/* Header Section */}
                <div className="p-5 pb-4 border-b bg-linear-to-br from-muted/30 to-background">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Wrench className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate">{s.name}</h3>
                        <p className="text-xs text-muted-foreground">Service ID: #{s.id}</p>
                      </div>
                    </div>
                    <StatusBadge status={s.status} />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{s.desc}</p>
                </div>

                {/* Details Section */}
                <div className="p-5 space-y-3">
                  {s.vehicle ? (
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Car className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground truncate">
                          {s.vehicle.brand} {s.vehicle.model}
                        </span>
                      </div>
                      <span className="text-muted-foreground shrink-0">{s.vehicle.regNumber}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <Car className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">N/A</span>
                    </div>
                  )}

                  {s.mechanic ? (
                    <div className="flex items-center gap-2 text-sm w-full">
                      <User className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="flex justify-between items-center flex-1 w-full gap-2">
                        <div className="text-muted-foreground font-medium truncate">
                          {s.mechanic.name || s.mechanic}
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap pl-3">
                          {s.mechanic.phoneNumber ? s.mechanic.phoneNumber : ''}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span>Mechanic not assigned yet</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center justify-between w-full gap-4 text-sm">
                      {s.totalAmount != null && (
                        <div className="flex items-center font-semibold ">
                          Base Amount:
                          <span className="pl-2 text-muted-foreground">
                            {/* {Number(s.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })} */}
                            {s.totalAmount}
                          </span>
                          <IndianRupee className="w-3 h-3 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{s.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-5 pb-5 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1  transition-colors"
                    onClick={() => navigate(`/customers/services/${s.id}`)}
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  {s.status === 'Completed' && !s.hasFeedback && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-dashed"
                      onClick={() => {
                        setFeedbackService(s)
                        setFeedbackOpen(true)
                      }}
                    >
                      <Star className="w-3 h-3 mr-2" />
                      Feedback
                    </Button>
                  )}

                </div>
              </CardContent>
            </Card>
          )}
          renderRow={(s) => (
            <TableRow key={s.id} className="hover:bg-muted! transition group">
              <TableCell className="font-medium">{s.name}</TableCell>
              <TableCell>
                <span className="whitespace-nowrap">{s.date}</span>
              </TableCell>
              <TableCell>
                <StatusBadge status={s.status} />
              </TableCell>
              <TableCell className="text-muted-foreground max-w-xs truncate">{s.desc}</TableCell>
              <TableCell className="text-muted-foreground">
                {s.vehicle ? s.vehicle.display : 'N/A'}
              </TableCell>
              <TableCell className="text-right flex items-center justify-end gap-2">
                {s.status === 'Completed' && !s.hasFeedback && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    title="Provide Feedback"
                    onClick={() => {
                      setFeedbackService(s)
                      setFeedbackOpen(true)
                    }}
                  >
                    <Star className="w-4 h-4 text-muted-foreground hover:text-yellow-500" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full hover:bg-accent"
                  onClick={() => navigate(`/customers/services/${s.id}`)}
                  aria-label={`View service for ${s.name}`}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          )}
          emptyContent={
            <div className="flex flex-col items-center text-center py-14">
              <span className="text-5xl mb-2">🫥</span>
              <span className="text-lg font-semibold text-card-foreground">No services found</span>
              <p className="text-sm text-muted-foreground mt-1">
                You haven&apos;t booked any services in this category yet.
              </p>
            </div>
          }
        />
      </section>

      <FeedbackDialog
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        service={feedbackService}
      />
    </main>
  )
}
