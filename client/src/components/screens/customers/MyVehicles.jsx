import { useState } from 'react'
import { CarFront, Trash2, Pencil, MoreVertical, Calendar } from 'lucide-react'
import { Card, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu'
import { TableRow, TableCell } from '../../ui/table'
import AddVehicle from './components/addVehicle'
import EditVehicle from './components/EditVehicle'
import BookService from './components/BookService'
import UniversalDisplay from '../../ui/universal-display'
import ViewToggle from '../../ui/ViewToggle'
import { useGetAllVehicles, useDeleteVehicleMutation } from '../../../query/queries/vehicleQueries'
import { useGetAllServiceCatalogs } from '../../../query/queries/serviceTypeQueries'

export default function MyVehicles() {
    const [openBooking, setOpenBooking] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [vehicleToDelete, setVehicleToDelete] = useState(null)
    const [view, setView] = useState(() => window.localStorage.getItem('my-vehicles-view') || 'grid')

    const { data: vehiclesData, isLoading: isLoadingVehicles, error: vehiclesError } = useGetAllVehicles()
    const { data: catalogsData, isLoading: isLoadingCatalogs } = useGetAllServiceCatalogs()
    const deleteVehicleMutation = useDeleteVehicleMutation()

    const vehicles = vehiclesData?.data?.map(v => ({
        id: v.id,
        brand: v.brand,
        model: v.model,
        registration: v.regNumber,
        year: v.year
    })) || []

    const serviceOptions = catalogsData?.data?.map(s => ({
        id: s.id,
        name: s.serviceName
    })) || []

    function handleDeleteClick(vehicle) {
        setVehicleToDelete(vehicle)
        setDeleteDialogOpen(true)
    }

    function confirmDelete() {
        if (vehicleToDelete) {
            deleteVehicleMutation.mutate(vehicleToDelete.id, {
                onSuccess: () => {
                    setDeleteDialogOpen(false)
                    setVehicleToDelete(null)
                }
            })
        }
    }

    function handleViewChange(newView) {
        setView(newView);
        window.localStorage.setItem('my-vehicles-view', newView);
    }

    if (isLoadingVehicles || isLoadingCatalogs) {
        return <div className="p-8">Loading vehicles...</div>
    }

    if (vehiclesError) {
        return <div className="p-8 text-destructive">Error: {vehiclesError.message}</div>
    }
    return (
        <div className="py-6 px-8 w-[90%] mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">My Vehicles</h1>
                    <p className="text-muted-foreground mt-1">Manage your registered vehicles</p>
                </div>

                <div className="flex items-center gap-3">
                    <AddVehicle />
                    <ViewToggle view={view} onViewChange={handleViewChange} />
                </div>
            </div>

            {vehicles.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <CarFront className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No vehicles yet</h3>
                        <p className="text-muted-foreground mb-4">Add your first vehicle to get started</p>
                        <AddVehicle />
                    </CardContent>
                </Card>
            ) : (
                <>
                    <Dialog open={openBooking} onOpenChange={setOpenBooking}>
                        <BookService
                            open={openBooking}
                            onOpenChange={setOpenBooking}
                            vehicles={vehicles}
                            services={serviceOptions}
                        />
                    </Dialog>

                    <UniversalDisplay
                        items={vehicles}
                        idKey="id"
                        view={view}
                        onViewChange={handleViewChange}
                        showViewToggle={false}
                        perRow={3}
                        columns={[
                            { key: 'id', title: 'ID' },
                            { key: 'brand', title: 'Brand' },
                            { key: 'model', title: 'Model' },
                            { key: 'registration', title: 'Registration' },
                            { key: 'year', title: 'Year' },
                            { key: 'actions', title: 'Actions' },
                        ]}
                        renderCard={(v) => (
                            <Card className="hover:shadow-md transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <CarFront className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold truncate">{v.brand} {v.model}</h3>
                                            <p className="text-sm text-muted-foreground font-mono">{v.registration}</p>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {/* <DropdownMenuItem onClick={() => setOpenBooking(true)}>
                                                    <Calendar className="mr-2 h-4 w-4" />
                                                    Book Service
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator /> */}
                                                <EditVehicle vehicle={v}>
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit Vehicle
                                                    </DropdownMenuItem>
                                                </EditVehicle>
                                                <DropdownMenuItem variant="destructive"
                                                    onClick={() => handleDeleteClick(v)}
                                                    // className="text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete Vehicle
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="space-y-2 text-sm mb-4">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Year</span>
                                            <span>{v.year}</span>
                                        </div>
                                    </div>
                                    <Button 
                                        className="w-full mt-4" 
                                        size="sm"
                                        onClick={() => setOpenBooking(true)}
                                    >
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Book Service
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                        renderRow={(v) => (
                            <TableRow>
                                <TableCell className="font-mono text-muted-foreground">#{v.id}</TableCell>
                                <TableCell className="font-medium">{v.brand}</TableCell>
                                <TableCell>{v.model}</TableCell>
                                <TableCell className="font-mono">{v.registration}</TableCell>
                                <TableCell>{v.year}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button 
                                            size="sm"
                                            onClick={() => setOpenBooking(true)}
                                        >
                                            {/* <Calendar className="w-3.5 h-3.5 mr-1.5" /> */}
                                            Book Service
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <EditVehicle vehicle={v}>
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                </EditVehicle>
                                                <DropdownMenuItem 
                                                    onClick={() => handleDeleteClick(v)}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    />
                </>
            )}

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Vehicle</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {vehicleToDelete?.brand} {vehicleToDelete?.model}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={deleteVehicleMutation.isPending}
                        >
                            {deleteVehicleMutation.isPending ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
