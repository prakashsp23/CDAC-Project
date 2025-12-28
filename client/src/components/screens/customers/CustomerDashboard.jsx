import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'
import BookService from './components/BookService'
import {
  Droplets,
  Disc,
  CarFront,
  Activity,
  Battery,
  Wrench,
  Sparkles
} from 'lucide-react'
import { toast } from 'sonner'
import { getServiceCatalog, getUserVehicles, getUserAppointments, bookService } from '../../../services/mockDataService'

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

function ServiceCard({ s, onBook }) {
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

          <div className="ml-2 flex-shrink-0">
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
  const statusLabel = a.status === 'ONGOING' ? 'In Progress' : a.status === 'REQUESTED' ? 'Requested' : 'Completed'
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

  const [services, setServices] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true);
      const [catalogData, vehiclesData, apptsData] = await Promise.all([
        getServiceCatalog(),
        getUserVehicles(1),
        getUserAppointments(1)
      ]);

      setServices(catalogData.map(s => ({
        id: s.catalog_id,
        name: s.service_name,
        desc: s.description,
        Icon: serviceToIconMap[s.service_name] || Wrench
      })));

      setVehicles(vehiclesData.map(v => ({
        id: v.car_id,
        brand: v.brand,
        model: v.model,
        registration: v.reg_number,
        year: v.year
      })));

      setAppointments(apptsData.map(a => ({
        id: a.service_id,
        service: a.service_name,
        car: a.car_details,
        date: a.created_at ? a.created_at.split('T')[0] : 'N/A',
        status: a.status,
        Icon: serviceToIconMap[a.service_name] || Wrench
      })));
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to connect to server. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBooking = async (data) => {
    // data: { vehicleId, serviceName }
    try {
      await bookService(data);
      toast.success("Service booked successfully!");
      setOpenBooking(false);
      loadData(); // Refresh appointments
    } catch (e) {
      console.error(e);
      toast.error("Failed to book service.");
    }
  };

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="py-6 px-8 w-[90%] mx-auto">
      {/* Services Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">✨ Our Available Services</h2>
          <Button onClick={() => navigate('/customers/AllServices')} variant="outline">Show More Services</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.slice(0, 6).map(s => (
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


        <div className="space-y-3">
          {appointments.length > 0 ? appointments.map(a => (
            <AppointmentCard key={a.id} a={a} />
          )) : <p className="text-muted-foreground text-sm">No ongoing appointments.</p>}
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
            <VehicleCard key={v.id} v={v} onManage={() => navigate('/customers/vehicles')} onBook={({ vehicleId }) => { setBookingDefaults({ vehicleId, serviceName: null }); setOpenBooking(true) }} />
          ))}
        </div>
      </section>

      {/* Booking modal used by dashboard */}
      <BookService
        open={openBooking}
        onOpenChange={setOpenBooking}
        vehicles={vehicles}
        services={services}
        defaultVehicleId={bookingDefaults.vehicleId}
        defaultServiceName={bookingDefaults.serviceName}
        onConfirm={handleBooking}
      />
    </div>
  )
}
