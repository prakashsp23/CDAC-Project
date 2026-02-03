import { useEffect, useState, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../ui/dialog'
import { Button } from '../../../ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../ui/select'
import { Textarea } from '../../../ui/textarea'
import { Input } from '../../../ui/input'

import { useCreateServiceMutation } from '../../../../query/queries/serviceQueries'

const DUMMY_VEHICLES = [];
const DUMMY_SERVICES = [];

// eslint-disable-next-line react/prop-types
export default function BookService({ open, onOpenChange, vehicles = DUMMY_VEHICLES, services = DUMMY_SERVICES, defaultVehicleId = null, defaultServiceName = null }) {
  const [form, setForm] = useState({ vehicleId: '', service: '', bookingDate: '', notes: '' })
  const dateInputRef = useRef(null)
  const createServiceMutation = useCreateServiceMutation()

  useEffect(() => {
    // When the dialog opens or defaults change, prefill vehicle/service and reset notes.
    const vehicleId = defaultVehicleId || (vehicles[0]?.id ? String(vehicles[0].id) : '')
    let serviceId = ''
    if (defaultServiceName) {
      const byId = services.find(s => s.id === defaultServiceName)
      if (byId) serviceId = String(byId.id)
      else {
        const byName = services.find(s => String(s.name).toLowerCase() === String(defaultServiceName).toLowerCase())
        if (byName) serviceId = String(byName.id)
      }
    }

    setForm({ vehicleId, service: serviceId, bookingDate: '', notes: '' })
  }, [open, defaultVehicleId, defaultServiceName, vehicles, services])

  function handleSubmit() {
    if (!form.vehicleId || !form.service || !form.bookingDate) return

    const catalogId = parseInt(form.service)
    const carId = parseInt(form.vehicleId)

    // Validate parsed values
    if (isNaN(catalogId) || isNaN(carId)) {
      console.error('Invalid IDs:', { catalogId, carId, form })
      return
    }

    createServiceMutation.mutate({
      catalogId,
      carId,
      bookingDate: form.bookingDate,
      customerNotes: form.notes.trim() || null
    }, {
      onSuccess: () => {
        setForm({ vehicleId: '', service: '', bookingDate: '', notes: '' })
        onOpenChange(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Book a Service</DialogTitle>
          <DialogDescription>
            Schedule a service appointment for your vehicle
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Select Vehicle</label>
                <Select value={String(form.vehicleId)} onValueChange={(v) => setForm(f => ({ ...f, vehicleId: v }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map(v => (
                      <SelectItem key={v.id} value={String(v.id)}>{v.brand} {v.model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Select Service</label>
                <Select value={form.service} onValueChange={(v) => setForm(f => ({ ...f, service: v }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(s => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Booking Date</label>
                <Input
                  ref={dateInputRef}
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={form.bookingDate}
                  onChange={(e) => setForm(f => ({ ...f, bookingDate: e.target.value }))}
                  onClick={() => dateInputRef.current?.showPicker()}
                  disabled={createServiceMutation.isPending}
                  className="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden"
                />
              </div>
            </div>

            <div className="space-y-4 flex flex-col">

              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Notes (Optional)</label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Any specific requirements or issues..."
                  disabled={createServiceMutation.isPending}
                  className="resize-none min-h-[110px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={createServiceMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!form.vehicleId || !form.service || !form.bookingDate || createServiceMutation.isPending}
                >
                  {createServiceMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-muted rounded">
            <div className="text-sm text-muted-foreground">
              Your service request will be reviewed by our team and you&apos;ll be notified once approved.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
