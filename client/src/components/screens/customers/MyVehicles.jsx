import React, { useState, useEffect } from 'react'
import { CarFront } from 'lucide-react'
import { Card, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'
import { Dialog } from '../../ui/dialog'
import { TableRow, TableCell } from '../../ui/table'
import AddVehicle from './components/addVehicle';
import BookService from './components/BookService'
import UniversalDisplay from '../../ui/universal-display'
import ViewToggle from '../../ui/ViewToggle'
import { getUserVehicles, getServiceCatalog, addVehicle, deleteVehicle, bookService } from '../../../services/mockDataService'
import { toast } from 'sonner'

export default function MyVehicles() {
    const [vehicles, setVehicles] = useState([])
    const [openBooking, setOpenBooking] = useState(false)
    const [view, setView] = useState(() => window.localStorage.getItem('my-vehicles-view') || 'grid');
    const [serviceOptions, setServiceOptions] = useState([])
    const [loading, setLoading] = useState(true)

    const loadData = async () => {
        try {
            setLoading(true);
            const vehiclesData = await getUserVehicles(1);
            setVehicles(vehiclesData.map(v => ({
                id: v.car_id,
                brand: v.brand,
                model: v.model,
                registration: v.reg_number,
                year: v.year
            })));

            const servicesData = await getServiceCatalog();
            setServiceOptions(servicesData.map(s => ({
                id: s.catalog_id,
                name: s.service_name
            })));
        } catch (error) {
            console.error(error);
            toast.error("Failed to load vehicles.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [])

    async function handleAddVehicle(data) {
        try {
            // map form data to api data
            // Form gives: { brand, model, registration, year }
            await addVehicle({
                brand: data.brand,
                model: data.model,
                reg_number: data.registration,
                year: parseInt(data.year)
            });
            toast.success("Vehicle added successfully");
            loadData();
        } catch (e) {
            console.error(e);
            toast.error("Failed to add vehicle");
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
        try {
            await deleteVehicle(id);
            toast.success("Vehicle deleted");
            loadData();
        } catch (e) {
            console.error(e);
            toast.error("Failed to delete vehicle");
        }
    }

    async function handleConfirmBooking(data) {
        try {
            await bookService(data);
            toast.success('Booking confirmed');
            setOpenBooking(false)
        } catch (e) {
            console.error(e);
            toast.error("Booking failed");
        }
    }

    function handleViewChange(newView) {
        setView(newView);
        window.localStorage.setItem('my-vehicles-view', newView);
    }

    if (loading) return <div className="p-8">Loading vehicles...</div>;

    return (
        <div className="py-6 px-8 w-[90%] mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">My Vehicles</h1>
                    <p className="text-muted-foreground mt-1">Manage your registered vehicles.</p>
                </div>

                <div className="flex items-center gap-3">
                    <AddVehicle onAdd={handleAddVehicle} />
                    <Dialog open={openBooking} onOpenChange={setOpenBooking}>
                        <BookService
                            open={openBooking}
                            onOpenChange={setOpenBooking}
                            vehicles={vehicles}
                            services={serviceOptions}
                            onConfirm={handleConfirmBooking}
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
                        <CardContent className="px-4 flex flex-col flex-grow">
                            <div className="flex items-start gap-4 pt-4">
                                <div className="w-12 h-12 rounded-lg bg-muted/50 flex-shrink-0 flex items-center justify-center">
                                    <CarFront className="w-6 h-6 text-card-foreground" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-card-foreground">{v.brand} {v.model}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        <span>{v.registration}</span>
                                        <span className="mx-1">•</span>
                                        <span>{v.year}</span>
                                    </div>

                                </div>
                                <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">#{String(v.id).padStart(3, '0')}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-4 text-muted-foreground">
                                <div className="font-medium">Registration:</div>
                                <div className="text-right font-mono">{v.registration}</div>
                                <div className="font-medium">Year:</div>
                                <div className="text-right">{v.year}</div>
                            </div>
                            <div className="flex-grow" /> {/* Pushes buttons to the bottom */}
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
