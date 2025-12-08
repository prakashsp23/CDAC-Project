import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../../ui/button";

export default function UpdateServiceModal({ job, isOpen, onClose, onUpdate }) {
  if (!isOpen || !job) return null;

  const [status, setStatus] = useState(job.status);
  const [notes, setNotes] = useState(job.note || "");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-card text-card-foreground w-full max-w-xl rounded-xl shadow-lg p-6 relative">

        <button className="absolute right-4 top-4" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Update Service Progress</h2>

        {/* Job Details */}
        <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-lg mb-4">
          <div>
            <p className="text-xs text-gray-500">Job ID</p>
            <p className="font-semibold">{job.id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Customer</p>
            <p className="font-semibold">{job.customer}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Vehicle</p>
            <p className="font-semibold">{job.car}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Plate Number</p>
            <span className="py-1 bg-muted-200 rounded text-sm">
              {job.plate}
            </span>
          </div>
        </div>

        {/* Service Requested */}
        <p className="text-xs text-gray-500 mb-1">Service Requested</p>
        <input
          value={job.service}
          readOnly
          className="w-full border bg-muted/50 rounded-lg px-3 py-2 mb-4"
        />

        {/* Job Status */}
        <p className="text-xs text-gray-500 mb-1">Update Job Status</p>
        <select
          className="w-full border rounded-lg px-3 py-2 mb-4 bg-muted/50"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        {/* Notes */}
        <p className="text-xs text-gray-500 mb-1">Service Notes / Updates</p>
        <textarea
          placeholder="e.g., Oil filter replaced, Engine diagnostics complete..."
          className="w-full border rounded-lg px-3 py-2 mb-3 h-24 bg-muted/50"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>

          <Button
            onClick={() => {
              const updated = {
                ...job,
                status: status,
                note: notes,
              };
              onUpdate(updated);
              onClose();
            }}
          >
            Update Service
          </Button>
        </div>
      </div>
    </div>
  );
}
