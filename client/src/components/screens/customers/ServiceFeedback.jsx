import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from '../../ui/select'
import { Textarea } from '../../ui/textarea'
import { TableRow, TableCell } from '../../ui/table'
import StarRating from '../../ui/star-rating'
import UniversalDisplay from '../../ui/universal-display'
import ViewToggle from '../../ui/ViewToggle'
import { useGetCompletedServices } from '../../../query/queries/serviceQueries'
import { useGetMyFeedbacks, useSubmitFeedbackMutation } from '../../../query/queries/feedbackQueries'
import { QueryClient } from '@tanstack/react-query'

export default function ServiceFeedback() {

  const [selectedService, setSelectedService] = useState('')
  const [rating, setRating] = useState(0)
  const [comments, setComments] = useState('')

  const [view, setView] = useState(() => window.localStorage.getItem('feedback-view') || 'grid');

  // Extract data from API response wrapper
  const { data: feedbackResponse, isLoading } = useGetMyFeedbacks();
  const feedbacks = feedbackResponse?.data;

  const { data: serviceResponse, isLoading: isServiceLoading } = useGetCompletedServices();
  const completedServices = serviceResponse?.data;

  const submitFeedbackMutation = useSubmitFeedbackMutation();

  async function handleSubmit() {
    if (!selectedService) return alert('Please select a completed service')
    if (!rating) return alert('Please provide a rating')

    submitFeedbackMutation.mutate({
      serviceId: selectedService,
      rating,
      comments
    }, {
      onSuccess: () => {

        // toast is handled in the mutation
        setRating(0);
        setComments('');
        setSelectedService('');
      }
    });
  }

  function handleViewChange(newView) {
    setView(newView);
    window.localStorage.setItem('feedback-view', newView);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary/60 mb-3"></div>
        <span className="text-lg text-muted-foreground">Loading feedback...</span>
      </div>
    )
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
                    <SelectValue placeholder={completedServices?.length > 0 ? "Select a service" : "No services to review"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {isServiceLoading ? (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                      ) : (
                        <>
                          <SelectLabel>Recent Services</SelectLabel>
                          {completedServices?.filter(s => !s.hasFeedback).length > 0 ? (
                            completedServices.filter(s => !s.hasFeedback).map((s) => (
                              <SelectItem key={s.id} value={String(s.id)}>
                                {s.catalog.serviceName} — {String(s.createdOn)}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>No pending reviews</SelectItem>
                          )}
                        </>
                      )}
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
              <Textarea placeholder="Share your experience, what went well, and what could be improved..." value={comments} onChange={(e) => setComments(e.target.value)} rows={4} />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => { setRating(0); setComments(''); }}>Cancel</Button>
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
          { key: 'serviceName', title: 'Service' },
          { key: 'createdOn', title: 'Date' },
          { key: 'rating', title: 'Rating' },
          { key: 'comments', title: 'Comment' },
          { key: 'mechanicNote', title: 'Mechanic Note' },
        ]}
        perRow={3}
        renderCard={(f) => (
          <Card key={f.id} className="h-full">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-gray-500 mt-2">No past services found. Book a service to get started!</p>
                  <p className="text-sm text-muted-foreground">{String(f.createdOn)}</p>
                </div>
                <StarRating value={f.rating} readOnly size={16} />
              </div>
              <p className="text-sm mt-3 text-muted-foreground italic border-l-2 border-border pl-3">&quot;{f.comments}&quot;</p>
              {f.mechanicNote && (
                <div className="text-xs mt-3 bg-muted/50 p-2 rounded-md">
                  <p className="font-semibold">Mechanic's Notes:</p>
                  <p className="text-muted-foreground">{f.mechanicNote}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        renderRow={(f) => (
          <TableRow key={f.id}>
            <TableCell className="font-medium">{f.serviceName}</TableCell>
            <TableCell>{String(f.createdOn)}</TableCell>
            <TableCell><StarRating value={f.rating} readOnly size={16} /></TableCell>
            <TableCell>{f.comments}</TableCell>
            <TableCell>{f.mechanicNote}</TableCell>
          </TableRow>
        )}
      />
    </div>
  )
}
