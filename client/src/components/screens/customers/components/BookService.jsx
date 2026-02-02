import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../ui/dialog'
import { Button } from '../../../ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../ui/select'
import { Textarea } from '../../../ui/textarea'
import { useCreateServiceMutation } from '../../../../query/queries/serviceQueries'

const DUMMY_VEHICLES = [];
const DUMMY_SERVICES = [];

// eslint-disable-next-line react/prop-types
export default function BookService({ open, onOpenChange, vehicles = DUMMY_VEHICLES, services = DUMMY_SERVICES, defaultVehicleId = null, defaultServiceName = null }) {
  const [form, setForm] = useState({ vehicleId: '', service: '', notes: '' })
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

    setForm({ vehicleId, service: serviceId, notes: '' })
  }, [open, defaultVehicleId, defaultServiceName, vehicles, services])

  function handleSubmit() {
    if (!form.vehicleId || !form.service) return

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
      customerNotes: form.notes.trim() || null
    }, {
      onSuccess: () => {
        setForm({ vehicleId: '', service: '', notes: '' })
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground">Select Vehicle</label>
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

            <div>
              <label className="text-sm text-muted-foreground">Select Service</label>
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
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Notes (Optional)</label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Any specific requirements or issues..."
              disabled={createServiceMutation.isPending}
            />
          </div>

          <div className="p-3 bg-muted rounded">
            <div className="text-sm text-muted-foreground">
              Your service request will be reviewed by our team and you&apos;ll be notified once approved.
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createServiceMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!form.vehicleId || !form.service || createServiceMutation.isPending}
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
      </DialogContent>
    </Dialog>
  )
}
