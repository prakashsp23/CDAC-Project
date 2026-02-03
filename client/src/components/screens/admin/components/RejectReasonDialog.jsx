import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Frown, Calendar } from "lucide-react";

export default function RejectReasonDialog({ onReject, isPending }) {
  const [reason, setReason] = useState("");
  const [rescheduledDate, setRescheduledDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reason.trim()) {
      onReject(reason, rescheduledDate);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Reject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Frown className="w-5 h-5 text-red-500" />
            <DialogTitle>Reject Service Request</DialogTitle>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter rejection reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="rescheduledDate"
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Reschedule Date (Optional)
              </Label>
              <Input
                id="rescheduledDate"
                type="date"
                value={rescheduledDate}
                onChange={(e) => setRescheduledDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
              <p className="text-xs text-neutral-500">
                Suggest an alternative date to the customer.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              variant="destructive"
              disabled={isPending || !reason.trim()}
            >
              {isPending ? "Rejecting..." : "Reject Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
