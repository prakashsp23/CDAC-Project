import React, { useState } from 'react'
// navigation not needed here
import { Card, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'
import { Dialog } from '../../ui/dialog'
import { TableRow, TableCell } from '../../ui/table'
import AddVehicle from './components/addVehicle';
import BookService from './components/BookService'
import UniversalDisplay from '../../ui/universal-display'
import ViewToggle from '../../ui/ViewToggle'

const MOCK_VEHICLES = [
  { id: 1, brand: 'Honda', model: 'CRV', registration: 'AB12CD3456', year: '2022' },
  { id: 2, brand: 'Toyota', model: 'Corolla', registration: 'XY98ZT7654', year: '2020' },
]

const SERVICES = [
  { id: 'oil', name: 'Oil Change' },
  { id: 'brake', name: 'Brake Inspection' },
]

export default function MyVehicles() {
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES)
  const [openBooking, setOpenBooking] = useState(false)
  const [view, setView] = useState(() => window.localStorage.getItem('my-vehicles-view') || 'grid');

  function handleDelete(id) {
    setVehicles(v => v.filter(x => x.id !== id))
  }

  function handleConfirmBooking() {
    // placeholder - in real app call API
    setOpenBooking(false)
    alert('Booking confirmed')
  }

  function handleViewChange(newView) {
    setView(newView);
    window.localStorage.setItem('my-vehicles-view', newView);
  }

return (
    <div className="py-6 px-8 w-[90%] mx-auto">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-2xl font-semibold">My Vehicles</h1>
                <p className="text-muted-foreground mt-1">Manage your registered vehicles.</p>
            </div>

            <div className="flex items-center gap-3">
                <AddVehicle onAdd={(v) => setVehicles(vs => [...vs, { id: vs.length + 1, ...v }])} />
                <Dialog open={openBooking} onOpenChange={setOpenBooking}>
                    <BookService
                      open={openBooking}
                      onOpenChange={setOpenBooking}
                      vehicles={vehicles}
                      services={SERVICES}
                      onConfirm={(data) => {
                        console.log('booking', data)
                        handleConfirmBooking()
                      }}
                    />
                </Dialog>
                <ViewToggle view={view} onViewChange={handleViewChange} />
            </div>
        </div>

        <UniversalDisplay
            items={vehicles}
            idKey="id"
            view={view}
            onViewChange={handleViewChange}
            showViewToggle={false}
            perRow={3}
            columns={[
                { key: 'id', title: 'Vehicle ID' },
                { key: 'brand', title: 'Brand' },
                { key: 'model', title: 'Model' },
                { key: 'registration', title: 'Registration No.' },
                { key: 'year', title: 'Year' },
                { key: 'actions', title: 'Actions' },
            ]}
            renderCard={(v) => (
                 <Card key={v.id} className="flex flex-col transition-all hover:shadow-md hover:border-primary/20 h-full">
                    <CardContent className="p-4 flex flex-col flex-grow">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-muted/50 flex-shrink-0 flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" className="text-card-foreground"><path d="M3 13l2-4h14l2 4v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-card-foreground">{v.brand} {v.model}</div>
                                <div className="text-xs text-muted-foreground">{v.registration} • {v.year}</div>
                            </div>
                            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">#{String(v.id).padStart(3, '0')}</div>
                        </div>
                        <div className="flex-grow" />
                        <div className="flex items-center justify-end gap-2 mt-4">
                            <Button size="sm" onClick={() => setOpenBooking(true)}>Book Service</Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete(v.id)}>Delete</Button>
                        </div>
                    </CardContent>
                </Card>
            )}
            renderRow={(v) => (
                <TableRow key={v.id}>
                    <TableCell>#{String(v.id).padStart(3, '0')}</TableCell>
                    <TableCell className="font-medium">{v.brand}</TableCell>
                    <TableCell>{v.model}</TableCell>
                    <TableCell className="text-muted-foreground">{v.registration}</TableCell>
                    <TableCell className="text-muted-foreground">{v.year}</TableCell>
                    <TableCell className="text-left">
                        <div className="flex items-center justify-start gap-2">
                            <Button size="sm" onClick={() => setOpenBooking(true)}>Book Service</Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete(v.id)}>Delete</Button>
                        </div>
                    </TableCell>
                </TableRow>
            )}
        />
    </div>
)
}
