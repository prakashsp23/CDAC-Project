import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from '../../ui/select'
import { Textarea } from '../../ui/textarea'
import { TableRow, TableCell } from '../../ui/table'
import StarRating from '../../ui/star-rating'
import UniversalDisplay from '../../ui/universal-display'
import { toast } from 'sonner'
import ViewToggle from '../../ui/ViewToggle'
import { getUserFeedbacks, getCompletedServicesForFeedback, submitFeedback } from '../../../services/mockDataService'

export default function ServiceFeedback() {
  const [completedServices, setCompletedServices] = useState([])
  const [feedbacks, setFeedbacks] = useState([])

  const [selectedService, setSelectedService] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)

  const [view, setView] = useState(() => window.localStorage.getItem('feedback-view') || 'grid');

  const loadData = async () => {
    try {
      setLoading(true);
      const servicesData = await getCompletedServicesForFeedback(1);
      setCompletedServices(servicesData);

      if (servicesData.length > 0 && !selectedService) {
        setSelectedService(String(servicesData[0].id));
      }

      const feedbacksData = await getUserFeedbacks(1);
      setFeedbacks(feedbacksData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load feedback data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit() {
    if (!selectedService) return alert('Please select a completed service')
    if (!rating) return alert('Please provide a rating')

    try {
      await submitFeedback({
        serviceId: selectedService,
        rating,
        comment
      });
      toast.success("Feedback recorded successfully");

      setRating(0);
      setComment('');
      setSelectedService('');

      loadData(); // Reload to update lists
    } catch (e) {
      console.error(e);
      toast.error("Failed to submit feedback");
    }
  }

  function handleViewChange(newView) {
    setView(newView);
    window.localStorage.setItem('feedback-view', newView);
  }

  if (loading) return <div className="p-8">Loading feedback...</div>;

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
                    <SelectValue placeholder={completedServices.length > 0 ? "Select a service" : "No services to review"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Recent Services</SelectLabel>
                      {completedServices.length > 0 ? completedServices.map(s => (
                        <SelectItem key={s.id} value={String(s.id)}>{s.name} — {s.date}</SelectItem>
                      )) : <SelectItem value="none" disabled>No pending reviews</SelectItem>}
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
              <Button variant="ghost" onClick={() => { setRating(0); setComment(''); }}>Cancel</Button>
              <Button onClick={handleSubmit} className="bg-black text-white" disabled={!selectedService || completedServices.length === 0}>Submit Feedback</Button>
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
