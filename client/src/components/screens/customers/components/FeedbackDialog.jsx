/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../ui/dialog'
import { Button } from '../../../ui/button'
import { Textarea } from '../../../ui/textarea'
import StarRating from '../../../ui/star-rating'
import { useSubmitFeedbackMutation } from '../../../../query/queries/feedbackQueries'

export default function FeedbackDialog({ open, onOpenChange, service }) {
    const [rating, setRating] = useState(0)
    const [comments, setComments] = useState('')
    const submitFeedbackMutation = useSubmitFeedbackMutation()

    function handleSubmit() {
        if (!service) return
        if (!rating) return

        submitFeedbackMutation.mutate({
            serviceId: service.id,
            rating,
            comments
        }, {
            onSuccess: () => {
                setRating(0)
                setComments('')
                onOpenChange(false)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Provide Feedback</DialogTitle>
                    <DialogDescription>
                        Rate your experience for {service?.name}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Rating</label>
                        <StarRating value={rating} onChange={setRating} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Comments</label>
                        <Textarea
                            placeholder="Tell us about your experience..."
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={!rating || submitFeedbackMutation.isPending}>
                        {submitFeedbackMutation.isPending ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
