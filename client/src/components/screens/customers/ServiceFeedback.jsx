import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from '../../ui/select'
import { Textarea } from '../../ui/textarea'
import { TableRow, TableCell } from '../../ui/table'
import StarRating from '../../ui/star-rating'
import UniversalDisplay from '../../ui/universal-display'
import { toast } from 'sonner'
import ViewToggle from '../../ui/ViewToggle'

export default function ServiceFeedback() {
  // mock completed services (in a real app fetch from API)
  const completedServices = [
    { id: 'svc-1', name: 'Oil Change', date: '2025-11-20' },
    { id: 'svc-2', name: 'Brake Repair', date: '2025-11-18' },
    { id: 'svc-3', name: 'Exterior Detailing', date: '2025-10-30' },
  ]

  const [selectedService, setSelectedService] = useState(completedServices[0]?.id ?? '')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, service: 'Oil Change', date: '2025-11-20', rating: 5, comment: 'Quick and clean job', mechanicNotes: 'Changed oil and filter', images: [] },
    { id: 2, service: 'Brake Repair', date: '2025-11-18', rating: 4, comment: 'Good service but took longer than expected', mechanicNotes: 'Replaced brake pads', images: [] },
    { id: 3, service: 'Exterior Detailing', date: '2025-10-30', rating: 5, comment: 'My car looks brand new!', mechanicNotes: 'Full wash, wax and polish', images: [] },
  ])
  const [view, setView] = useState(() => window.localStorage.getItem('feedback-view') || 'grid');

  function submit() {
    if (!selectedService) return alert('Please select a completed service')
    if (!rating) return alert('Please provide a rating')

    const svc = completedServices.find(s => s.id === selectedService)
    const entry = {
      id: Date.now(),
      service: svc?.name || 'Service',
      date: svc?.date || new Date().toISOString().slice(0,10),
      rating,
      comment,
      mechanicNotes: '',
      images: [],
    }
    setFeedbacks(f => [entry, ...f])
    if(entry) toast.success("Feedback has been recorded!")
    // reset form
    setRating(0)
    setComment('')
    setSelectedService(completedServices[0]?.id ?? '')
  }

  function handleViewChange(newView) {
    setView(newView);
    window.localStorage.setItem('feedback-view', newView);
  }

  return (
    <div className="py-6 px-8 w-[90%] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Service Feedback</h1>
        <p className="text-muted-foreground mt-1">Share your experience and view your past feedback.</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Submit New Feedback</CardTitle>
          <CardDescription>Help us improve by sharing your experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground pb-2 block">Completed Service</label>
                <Select value={selectedService} onValueChange={v => setSelectedService(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Recent Services</SelectLabel>
                      {completedServices.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name} — {s.date}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground pb-2 block">Your Rating</label>
                <StarRating value={rating} onChange={setRating} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground pb-2 block">Your Feedback</label>
              <Textarea placeholder="Share your experience, what went well, and what could be improved..." value={comment} onChange={(e) => setComment(e.target.value)} rows={4} />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => { setRating(0); setComment(''); setSelectedService(completedServices[0]?.id ?? '') }}>Cancel</Button>
              <Button onClick={submit} className="bg-black text-white">Submit Feedback</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-4 mt-8">
        <h2 className="text-xl font-semibold">Your Feedback History</h2>
        <ViewToggle view={view} onViewChange={handleViewChange} />
      </div>
      
      <UniversalDisplay
        items={feedbacks}
        view={view}
        idKey="id"
        columns={[
          { key: 'service', title: 'Service' },
          { key: 'date', title: 'Date' },
          { key: 'rating', title: 'Rating' },
          { key: 'comment', title: 'Comment' },
          { key: 'mechanicNotes', title: 'Mechanic Notes' },
        ]}
        perRow={3}
        renderCard={(f) => (
          <Card key={f.id} className="h-full">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-card-foreground">{f.service}</p>
                  <p className="text-sm text-muted-foreground">{f.date}</p>
                </div>
                <StarRating value={f.rating} readOnly size={16} />
              </div>
              <p className="text-sm mt-3 text-muted-foreground italic border-l-2 border-border pl-3">"{f.comment}"</p>
              {f.mechanicNotes && (
                <div className="text-xs mt-3 bg-muted/50 p-2 rounded-md">
                  <p className="font-semibold">Mechanic's Notes:</p>
                  <p className="text-muted-foreground">{f.mechanicNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        renderRow={(f) => (
          <TableRow key={f.id}>
            <TableCell className="font-medium">{f.service}</TableCell>
            <TableCell>{f.date}</TableCell>
            <TableCell><StarRating value={f.rating} readOnly size={16} /></TableCell>
            <TableCell>{f.comment}</TableCell>
            <TableCell>{f.mechanicNotes}</TableCell>
          </TableRow>
        )}
      />
    </div>
  )
}
