import React, { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog'
import { Button } from '../../../ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../ui/select'
import { Calendar } from '../../../ui/calendar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '../../../ui/dropdown-menu'
import { Textarea } from '../../../ui/textarea'

function todayDateString() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const DUMMY_VEHICLES = [];
const DUMMY_SERVICES = [];

export default function BookService({ open, onOpenChange, vehicles = DUMMY_VEHICLES, services = DUMMY_SERVICES, defaultVehicleId = null, defaultServiceName = null, onConfirm }) {
  const [form, setForm] = useState({ vehicleId: defaultVehicleId || (vehicles[0]?.id ?? ''), service: '', date: '', notes: '' })

  useEffect(() => {
    // When the dialog opens or defaults change, prefill vehicle/service and reset date/notes.
    const vehicleId = defaultVehicleId || (vehicles[0]?.id ?? '')
    let serviceId = ''
    if (defaultServiceName) {
      const byId = services.find(s => s.id === defaultServiceName)
      if (byId) serviceId = byId.id
      else {
        const byName = services.find(s => String(s.name).toLowerCase() === String(defaultServiceName).toLowerCase())
        if (byName) serviceId = byName.id
      }
    }

    setForm({ vehicleId, service: serviceId || '', date: '', notes: '' })
  }, [open, defaultVehicleId, defaultServiceName, vehicles, services])

  function handleSubmit() {
    if (!form.date) return
    onConfirm?.(form)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Book a Service</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground">Select Vehicle</label>
              <Select value={String(form.vehicleId)} onValueChange={(v) => setForm(f => ({ ...f, vehicleId: Number(v) }))}>
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
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Date</label>
            <div className="mt-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full rounded-md border border-input px-3 py-2 bg-card text-card-foreground flex items-center justify-between">
                    <span>{form.date ? new Date(form.date).toLocaleDateString() : 'Select date'}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="p-0">
                  <div className="p-2 bg-popover text-popover-foreground rounded-md">
                    <Calendar
                      mode="single"
                      selected={form.date ? new Date(form.date) : undefined}
                      defaultMonth={form.date ? new Date(form.date) : new Date()}
                      onSelect={(d) => {
                        if (!d) return
                        const dd = new Date(d)
                        const yyyy = dd.getFullYear()
                        const mm = String(dd.getMonth() + 1).padStart(2, '0')
                        const day = String(dd.getDate()).padStart(2, '0')
                        const iso = `${yyyy}-${mm}-${day}`
                        setForm(f => ({ ...f, date: iso }))
                      }}
                      disabled={{ before: new Date(todayDateString()) }}
                    />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Notes</label>
            <Textarea value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>

          <div className="p-3 bg-muted rounded">
            <div className="text-sm text-muted-foreground">Choose a convenient date and provide any notes for the mechanic.</div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!form.date || !form.service} className="disabled:opacity-60">
              Confirm Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
