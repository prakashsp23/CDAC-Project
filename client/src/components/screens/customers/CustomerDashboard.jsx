import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'
import BookService from './components/BookService'
import iconData from '../../../assets/icon.json'

const iconMap = iconData.icons.reduce((acc, icon) => {
  acc[icon.id] = icon.svg;
  return acc;
}, {});

const serviceToIconMap = {
  'Oil Change': 'oil-change',
  'Tire Rotation': 'tire',
  'Exterior Detailing': 'car-wash',
  'Brake Inspection': 'brakes',
  'Brake Repair': 'brakes',
  'Battery Check': 'battery',
  'Battery Replacement': 'battery',
  'AC Service': 'wrench', // Using a generic wrench for AC
};

const SERVICES = [
  { id: 1, name: 'Oil Change', desc: 'Full synthetic oil with filter replacement' },
  { id: 2, name: 'Tire Rotation', desc: 'Rotate and balance tires' },
  { id: 3, name: 'Exterior Detailing', desc: 'Wash, wax and polish' },
  { id: 4, name: 'Brake Inspection', desc: 'Full brake system check' },
  { id: 5, name: 'Battery Check', desc: 'Battery test and replacement' },
  { id: 6, 'name': 'AC Service', 'desc': 'Recharge and sanitize AC' },
].map(s => ({ ...s, svg: iconMap[serviceToIconMap[s.name]] }));

const VEHICLES = [
  { id: 1, brand: 'Honda', model: 'CRV', registration: 'AB12CD3456', year: '2022' },
  { id: 2, brand: 'Toyota', model: 'Corolla', registration: 'XY98ZT7654', year: '2020' },
]

const APPOINTMENTS = [
  { id: 1, service: 'Brake Repair', car: '2022 Honda CRV', date: '2025-11-20', status: 'in-progress' },
  { id: 2, service: 'Oil Change', car: '2020 Toyota Corolla', date: '2025-11-18', status: 'awaiting-approval' },
  { id: 3, service: 'Battery Replacement', car: '2022 Honda CRV', date: '2025-11-10', status: 'completed' },
].map(a => ({ ...a, svg: iconMap[serviceToIconMap[a.service]] }));

const SvgIcon = ({ svgString, ...props }) => {
  return <div {...props} dangerouslySetInnerHTML={{ __html: svgString }} />;
};

function ServiceCard({ s, onBook }) {
  return (
    <Card className="rounded-[14px]">
      <CardContent className="px-3 py-2">
        <div className="flex items-start gap-2"> {/* reduced gap */}
          <div className="w-12 h-12 rounded-md bg-muted/50 border flex items-center justify-center text-primary">
            {s.svg ? <SvgIcon svgString={s.svg} className="w-7 h-7" /> : <div className="w-7 h-7 bg-muted rounded-sm" />}
          </div>

          <div className="flex-1">
            <div className="text-sm font-medium text-card-foreground">{s.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.desc}</div>
          </div>

          <div className="ml-2 flex-shrink-0"> {/* reduced margin */}
            <Button size="sm" variant="default" onClick={() => onBook && onBook({ serviceName: s.name })}>
              Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AppointmentCard({ a }) {
  const statusLabel = a.status === 'in-progress' ? 'In Progress' : a.status === 'awaiting-approval' ? 'Awaiting Approval' : 'Completed'
  return (
    <Card className="rounded-[12px]">
      <CardContent className="px-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-md bg-muted/50 border flex items-center justify-center text-primary">
            {a.svg ? <SvgIcon svgString={a.svg} className="w-6 h-6" /> : <div className="w-6 h-6 bg-muted rounded-sm" />}
          </div>
          <div>
            <div className="text-sm font-medium text-card-foreground">{a.service}</div>
            <div className="text-xs text-muted-foreground">{a.car}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-muted-foreground">{a.date}</div>
          <div className="px-2 py-0.5 rounded-full text-xs border border-input text-muted-foreground">{statusLabel}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function VehicleCard({ v, onManage, onBook }) {
  return (
    <Card className="relative rounded-[12px]">
      <CardContent className="px-3">
        <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-card px-2 py-0.5 rounded">V{String(v.id).padStart(3, '0')}</div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-10 rounded-md bg-card border border-input flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-card-foreground">
              <path d="M3 13l2-4h14l2 4v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
            <Button size="sm" variant="default" onClick={() => onBook && onBook({ vehicleId: v.id })}>
              Book
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CustomerDashboard() {
  const navigate = useNavigate()
  const [openBooking, setOpenBooking] = useState(false)
  const [bookingDefaults, setBookingDefaults] = useState({ vehicleId: null, serviceName: null })

  return (
    <div className="py-6 px-8 w-[90%] mx-auto"> {/* page width constrained to 90% */}
      {/* Services Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">✨ Our Available Services</h2>
          <Button onClick={() => navigate('/customers/AllServices')} variant="outline">Show More Services</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.slice(0,6).map(s => (
            <ServiceCard key={s.id} s={s} onBook={({ serviceName }) => { setBookingDefaults({ serviceName, vehicleId: null }); setOpenBooking(true) }} />
          ))}
        </div>
      </section>

      {/* Ongoing Services */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">⏳ Your Ongoing Service Appointments</h2>
          <Button onClick={() => navigate('/customers/MyServices')} variant="outline">Show My Services</Button>
        </div>


        {/* <div className="space-y-3 max-h-60 overflow-auto"> */}
        <div className="space-y-3">
          {APPOINTMENTS.map(a => (
            <AppointmentCard key={a.id} a={a} />
          ))}
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
            {VEHICLES.map(v => (
              <VehicleCard key={v.id} v={v} onManage={() => navigate('/customers/vehicles')} onBook={({ vehicleId }) => { setBookingDefaults({ vehicleId, serviceName: null }); setOpenBooking(true) }} />
            ))}
          </div>
         
      </section>
      {/* Booking modal used by dashboard */}
      <BookService
        open={openBooking}
        onOpenChange={setOpenBooking}
        vehicles={VEHICLES}
        services={SERVICES.map(s => ({ id: s.name.toLowerCase().replace(/\s+/g, '-'), name: s.name }))}
        defaultVehicleId={bookingDefaults.vehicleId}
        defaultServiceName={bookingDefaults.serviceName}
        onConfirm={(data) => {
          // TODO: call API to create booking; for now log
          console.log('Dashboard booking:', data)
        }}
      />
    </div>
  )
}
