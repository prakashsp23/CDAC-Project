import React, { useState } from 'react';
import { Card, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'
import { TableRow, TableCell } from '../../ui/table'
import UniversalDisplay from '../../ui/universal-display'
import iconData from '../../../assets/icon.json'
import ViewToggle from '../../ui/ViewToggle'
import ServiceDetailDialog from './components/ServiceDetailDialog';

// A simple component to render SVG strings safely
const SvgIcon = ({ svgString, ...props }) => {
  return <div {...props} dangerouslySetInnerHTML={{ __html: svgString }} />;
};

export const SERVICES = iconData.icons.map((icon, index) => ({
  id: index + 1,
  name: icon.name,
  description: {
    'oil-change': 'Full synthetic oil and filter replacement.',
    'tire': 'Rotation, balancing, and alignment services.',
    'battery': 'Complete battery health check and replacement.',
    'wrench': 'General repairs and maintenance by experts.',
    'car-wash': 'Exterior and interior cleaning and detailing.',
    'brakes': 'Brake pad replacement and system checks.',
    'diagnostics': 'Complete car diagnostics and error reporting.',
    'alignment': 'Precision wheel alignment for better handling.',
  }[icon.id] || 'Service description not available.',
  price: {
    'oil-change': 49.99,
    'tire': 79.99,
    'battery': 129.99,
    'wrench': 99.99,
    'car-wash': 29.99,
    'brakes': 149.99,
    'diagnostics': 89.99,
    'alignment': 69.99,
  }[icon.id] || 0,
  coveredPoints: {
    'oil-change': ['Up to 5 quarts of synthetic oil', 'New oil filter', 'Fluid top-off', 'Tire pressure check'],
    'tire': ['Tire rotation', 'Wheel balancing', 'Tire pressure check', 'Brake inspection'],
    'brakes': ['Brake pad replacement (front or rear)', 'Brake fluid check', 'Rotor inspection'],
    'diagnostics': ['OBD-II scan', 'Error code analysis', 'System performance check', 'Printed report'],
  }[icon.id] || ['Inspection of relevant components.'],
  svg: icon.svg,
}));

export default function AllServicesPage() {
  const [viewLocal, setViewLocal] = useState(() => window.localStorage.getItem('univ_view') || 'grid');
  const [selectedService, setSelectedService] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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
        items={SERVICES}
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
        renderCard={(s) => (
          <div className="p-0 h-full">
            <div className="rounded-lg shadow-sm border bg-card h-full flex flex-col text-left p-4 transition-all hover:shadow-md hover:border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 text-primary flex-shrink-0 flex items-center justify-center bg-muted/50 rounded-lg">
                  <SvgIcon svgString={s.svg} className="w-7 h-7" />
                </div>
                <div className="flex-grow">
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
        )}
        renderRow={(s) => (
          <TableRow key={s.id}>
            <TableCell className="w-16">
              <div className="w-10 h-10 text-primary flex items-center justify-center bg-muted/50 rounded-lg"><SvgIcon svgString={s.svg} className="w-6 h-6" /></div>
            </TableCell>
            <TableCell className="font-medium">{s.name}</TableCell>
            <TableCell className="text-muted-foreground">{s.description}</TableCell>
            <TableCell className="text-right">
              <Button size="sm" variant="ghost" onClick={() => { setSelectedService(s); setIsDetailOpen(true); }}>View Details</Button>
            </TableCell>
          </TableRow>
        )}
      />

      {/* Service Detail Dialog */}
      <ServiceDetailDialog
        service={selectedService}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  )
}
