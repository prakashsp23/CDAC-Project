import { useState } from 'react';
import { Button } from '../../ui/button'
import { TableRow, TableCell } from '../../ui/table'
import UniversalDisplay from '../../ui/universal-display'
import {
  Droplets,
  Disc,
  Battery,
  Wrench,
  Activity,
} from 'lucide-react'
import ViewToggle from '../../ui/ViewToggle'
import ServiceDetailDialog from './components/ServiceDetailDialog';
import { useGetAllServiceCatalogs } from '../../../query/queries/serviceTypeQueries'
import { useGetAllVehicles } from '../../../query/queries/vehicleQueries'
import { bookService } from '../../../services/mockDataService';
import { toast } from 'sonner';

const iconMap = {
  'Basic Service': Droplets,
  'Oil Change': Droplets,
  'Full Service': Activity,
  'Brake Service': Disc,
  'AC Service': Wrench,
  'Battery Replacement': Battery,
};

export default function AllServicesPage() {
  const [viewLocal, setViewLocal] = useState(() => window.localStorage.getItem('univ_view') || 'grid');
  const [selectedService, setSelectedService] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // React Query hooks
  const { data: catalogData, isLoading: isLoadingCatalog } = useGetAllServiceCatalogs()
  const { data: vehiclesData, isLoading: isLoadingVehicles } = useGetAllVehicles()

  // Transform service catalog data
  const services = catalogData?.data?.map(s => ({
    id: s.id,
    name: s.serviceName,
    description: s.description,
    price: s.basePrice,
    coveredPoints: s.fullDetails ? s.fullDetails.split(', ') : [],
    Icon: iconMap[s.serviceName] || Wrench,
    value: s.id,
    createdOn: s.createdOn
  })).sort((a, b) => new Date(b.createdOn || 0) - new Date(a.createdOn || 0)) || []

  // Transform vehicles data
  const vehicles = vehiclesData?.data?.map(v => ({
    id: v.id,
    brand: v.brand,
    model: v.model,
    registration: v.regNumber,
    year: v.year
  })) || []

  const loading = isLoadingCatalog || isLoadingVehicles

  const handleBookingConfirm = async (bookingData) => {
    try {
      await bookService(bookingData);
      toast.success("Service booked successfully!");
      setIsDetailOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("Failed to book service");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary/60 mb-3"></div>
        <span className="text-lg text-muted-foreground">Loading services...</span>
      </div>
    )
  }

  if (catalogData?.error) {
    return <div className="p-8 text-destructive">Error loading services: {catalogData.error}</div>
  }

  return (
    <div className="p-6 w-[90%] mx-auto">

      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">All Services</h1>
          <p className="text-muted-foreground mt-1">Manage and explore all available car services.</p>
        </div>

        <ViewToggle view={viewLocal} onViewChange={setViewLocal} />
      </div>

      {/* Services Display Area */}
      <UniversalDisplay
        items={services}
        idKey="id"
        columns={[
          { key: 'icon', title: ' ' },
          { key: 'name', title: 'Service Name' },
          { key: 'description', title: 'Description' },
          { key: 'actions', title: 'Actions' },
        ]}
        perRow={3}
        view={viewLocal}
        showViewToggle={false} // We are using our own ViewToggle component
        onViewChange={setViewLocal} // This can be kept for other interactions if needed
        renderCard={(s) => {
          const Icon = s.Icon;
          return (
            <div className="p-0 h-full">
              <div className="rounded-lg shadow-sm border bg-card h-full flex flex-col text-left p-4 transition-all hover:shadow-md hover:border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 text-primary shrink-0 flex items-center justify-center bg-muted/50 rounded-lg">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="grow">
                    <h3 className="font-semibold text-md">{s.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <span className="text-lg font-bold text-card-foreground">₹{s.price.toFixed(2)}</span>
                  <Button size="sm" variant="ghost" onClick={() => { setSelectedService(s); setIsDetailOpen(true); }}>View Details</Button>
                </div>
              </div>
            </div>
          )
        }}
        renderRow={(s) => {
          const Icon = s.Icon;
          return (
            <TableRow key={s.id}>
              <TableCell className="w-16">
                <div className="w-10 h-10 text-primary flex items-center justify-center bg-muted/50 rounded-lg"><Icon className="w-6 h-6" /></div>
              </TableCell>
              <TableCell className="font-medium">{s.name}</TableCell>
              <TableCell className="text-muted-foreground">{s.description}</TableCell>
              <TableCell className="text-left">
                <Button size="sm" variant="ghost" onClick={() => { setSelectedService(s); setIsDetailOpen(true); }}>View Details</Button>
              </TableCell>
            </TableRow>
          )
        }}
      />

      {/* Service Detail Dialog */}
      <ServiceDetailDialog
        service={selectedService}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        vehicles={vehicles} // [NEW] Pass vehicles
        services={services.map(s => ({ id: s.value, name: s.name }))} // [NEW] Pass formatted services list
        onConfirm={handleBookingConfirm} // [NEW] Pass booking handler
      />
    </div>
  )
}
