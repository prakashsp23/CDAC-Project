import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'
import {
  Droplets,
  Disc,
  CarFront,
  Activity,
  Battery,
  Wrench,
  Sparkles
} from 'lucide-react'

import { useGetAllServiceCatalogs } from '../../../query/queries/serviceTypeQueries'
import { useGetAllVehicles } from '../../../query/queries/vehicleQueries'
import { useGetOngoingServices } from '../../../query/queries/serviceQueries'

// Status configuration
const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
  },
  ACCEPTED: {
    label: 'Accepted',
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  ONGOING: {
    label: 'In Progress',
    color: 'text-cyan-600 bg-cyan-50 border-cyan-200'
  },
  COMPLETED: {
    label: 'Completed',
    color: 'text-green-600 bg-green-50 border-green-200'
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'text-red-600 bg-red-50 border-red-200'
  }
}

const serviceToIconMap = {
  'Oil Change': Droplets,
  'Tire Rotation': Disc,
  'Exterior Detailing': Sparkles,
  'Brake Inspection': Disc,
  'Brake Service': Disc,
  'Brake Repair': Disc,
  'Battery Check': Battery,
  'Battery Replacement': Battery,
  'AC Service': Wrench,
  'Basic Service': Wrench,
  'Full Service': Activity,
};

function ServiceCard({ s }) {
  const Icon = s.Icon;
  return (
    <Card className="rounded-[14px]">
      <CardContent className="px-3 py-2">
        <div className="flex items-start gap-2">
          <div className="w-12 h-12 rounded-md bg-muted/50 border flex items-center justify-center text-primary">
            <Icon className="w-7 h-7" />
          </div>

          <div className="flex-1">
            <div className="text-sm font-medium text-card-foreground">{s.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.desc}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AppointmentCard({ a }) {
  const Icon = a.Icon;
  return (
    <Card className="rounded-[12px]">
      <CardContent className="px-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-md bg-muted/50 border flex items-center justify-center text-primary">
            {Icon && <Icon className="w-6 h-6" />}
          </div>
          <div>
            <div className="text-sm font-medium text-card-foreground">{a.service}</div>
            <div className="text-xs text-muted-foreground">{a.vehicle.brand} {a.vehicle.model}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-muted-foreground">{a.date}</div>
          <div className={`px-2 py-0.5 rounded-full text-xs border ${STATUS_CONFIG[a.status]?.color || 'border-input text-muted-foreground'}`}>
            {STATUS_CONFIG[a.status]?.label || a.status}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function VehicleCard({ v, onManage }) {
  return (
    <Card className="relative rounded-[12px]">
      <CardContent className="px-3">
        <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-card px-2 py-0.5 rounded">V{String(v.id).padStart(3, '0')}</div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-10 rounded-md bg-card border border-input flex items-center justify-center">
            <CarFront className="w-5 h-5 text-card-foreground" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-card-foreground">{v.brand} {v.model}</div>
            <div className="text-xs text-muted-foreground">{v.registration} • {v.year}</div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1" onClick={() => onManage(v)}>
              Manage
            </Button>

          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CustomerDashboard() {
  const navigate = useNavigate()

  // React Query Hooks
  const { data: serviceCatalogResponse, isLoading: isLoadingServices } = useGetAllServiceCatalogs();
  const services = serviceCatalogResponse?.data || [];

  const { data: vehiclesResponse, isLoading: isLoadingVehicles } = useGetAllVehicles();
  const vehicles = vehiclesResponse?.data || [];

  const { data: appointmentsResponse, isLoading: isLoadingAppointments } = useGetOngoingServices();
  const appointments = appointmentsResponse?.data || [];

  const isLoading = isLoadingServices || isLoadingVehicles || isLoadingAppointments;


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary/60 mb-3"></div>
        <span className="text-lg text-muted-foreground">Loading dashboard...</span>
      </div>
    )
  }

  return (
    <div className="py-6 px-8 w-[90%] mx-auto">
      {/* Services Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">✨ Our Available Services</h2>
          <Button onClick={() => navigate('/customers/AllServices')} variant="outline">Show More Services</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.slice(0, 6).map(s => {
            const Icon = serviceToIconMap[s.serviceName] || Wrench;
            return (
              <ServiceCard key={s.id} s={{ ...s, name: s.serviceName, desc: s.description, Icon: Icon }} />
            )
          })}
        </div>
      </section>

      {/* Ongoing Services */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">⏳ Your Ongoing Service Appointments</h2>
          <Button onClick={() => navigate('/customers/MyServices')} variant="outline">Show My Services</Button>
        </div>


        <div className="space-y-3">
          {appointments.length > 0 ? appointments.map(a => {
            const Icon = a.catalog?.serviceName ? (serviceToIconMap[a.catalog.serviceName] || Wrench) : Wrench;
            return (
              <AppointmentCard key={a.id} a={{
                ...a,
                service: a.catalog?.serviceName || 'Unknown Service',
                vehicle: a.vehicle,
                date: a.createdOn ? String(a.createdOn) : 'N/A',
                status: a.status,
                Icon: Icon
              }} />
            )
          }) : <p className="text-muted-foreground text-sm">No ongoing appointments.</p>}
        </div>
      </section>

      {/* Vehicles */}
      <section>
        <div className='flex'>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">🚗 Your Fleet</h2>
          </div>
          <div className="justify-end ml-auto">
            <button onClick={() => navigate('/customers/vehicles')} className="bg-black text-white rounded px-4 py-2">
              + Add Vehicle
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {vehicles.map(v => (
            <VehicleCard key={v.id} v={{
              id: v.id,
              brand: v.brand,
              model: v.model,
              registration: v.regNumber,
              year: v.year
            }} onManage={() => navigate('/customers/vehicles')} />
          ))}
        </div>
      </section>
    </div>
  )
}
