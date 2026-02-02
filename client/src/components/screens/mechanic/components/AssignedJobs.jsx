import React, { useState } from "react";
import { Card, CardContent } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Search, Filter, Calendar } from "lucide-react";
import UpdateServiceModal from "./UpdateServiceModal";
import {
  useGetMechanicAssignedJobs,
  useUpdateServiceExecutionMutation,
  useAddMechanicNoteMutation
} from "../../../../query/queries/mechanicQueries";
import { format } from "date-fns";

export default function AssignedJobs() {
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [noteDrafts, setNoteDrafts] = useState({});

  // Queries & Mutations
  const { data: jobsList = [], isLoading } = useGetMechanicAssignedJobs();
  const updateMutation = useUpdateServiceExecutionMutation();
  const addNoteMutation = useAddMechanicNoteMutation();

  const handleJobUpdate = (updatedJob) => {
    const payload = {
      serviceId: updatedJob.id,
      executionData: {
        status: updatedJob.status,
        parts: updatedJob.parts.map(p => ({
          id: p.id,
          quantity: p.quantity
        }))
      }
    };

    updateMutation.mutate(payload, {
      onSuccess: () => {
        setOpenModal(false);
        setSelectedJob(null);
      }
    });
  };

  const saveNote = (jobId) => {
    const noteContent = noteDrafts[jobId] ?? jobsList.find(j => j.id === jobId)?.notes;
    if (!noteContent?.trim()) return;

    addNoteMutation.mutate({
      serviceId: jobId,
      noteData: noteContent
    }, {
      onSuccess: () => {
        setNoteDrafts(prev => {
          const newState = { ...prev };
          delete newState[jobId];
          return newState;
        });
      }
    });
  };

  const filteredJobs =
    filterStatus === "All"
      ? jobsList
      : jobsList.filter((job) => job.status === filterStatus.toUpperCase());

  return (
    <div className="py-6 px-8 w-[90%] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Assigned Jobs</h1>
        <p className="text-muted-foreground">
          Manage your current service requests
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="w-full md:w-1/2 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by customer, vehicle, or service type..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-input"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <select
            className="px-3 py-2 rounded-lg bg-muted/50 border border-input"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <p className="text-muted-foreground">Loading assigned jobs...</p>
        ) : filteredJobs.length === 0 ? (
          <p className="text-muted-foreground">No assigned jobs found.</p>
        ) : filteredJobs.map((job) => (
          <Card key={job.id} className="rounded-xl">
            <CardContent className="p-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-lg">{job.customerName}</h2>
                  <p className="text-xs text-muted-foreground">ID: {job.id}</p>
                </div>

                <span className="px-3 py-1 text-xs rounded-full bg-muted/50">
                  {job.status}
                </span>
              </div>

              {/* Vehicle */}
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">{job.carBrand} {job.carModel}</p>
                <span className="inline-block mt-2 bg-muted/50 px-3 py-1 text-xs rounded-md">
                  {job.carPlate}
                </span>
              </div>

              {/* Service */}
              <div className="mt-4 bg-muted/20 p-3 rounded-lg">
                <p className="text-sm font-medium">{job.serviceName}</p>
              </div>

              {/* Time */}
              <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Assigned: {job.createdOn ? format(new Date(job.createdOn), 'PPP') : 'N/A'}
                </div>
              </div>

              {/* ✅ Service Notes / Updates */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground">
                    Service Notes / Updates
                  </p>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => saveNote(job.id)}
                    disabled={!noteDrafts[job.id]}
                  >
                    Save Note
                  </Button>
                </div>

                <textarea
                  placeholder={job.notes || "e.g. Oil filter replaced, diagnostics completed..."}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-muted/50"
                  value={noteDrafts[job.id] ?? job.notes ?? ""}
                  onChange={(e) =>
                    setNoteDrafts({
                      ...noteDrafts,
                      [job.id]: e.target.value,
                    })
                  }
                />
              </div>

              {/* Button */}
              <div className="mt-5">
                <Button
                  className="w-full"
                  onClick={() => {
                    setSelectedJob({
                      id: job.id,
                      customer: job.customerName,
                      car: `${job.carBrand} ${job.carModel}`,
                      plate: job.carPlate,
                      service: job.serviceName,
                      status: job.status,
                    });
                    setOpenModal(true);
                  }}
                >
                  View / Update Service
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {openModal && (
        <UpdateServiceModal
          job={selectedJob}
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onUpdate={handleJobUpdate}
        />
      )}
    </div>
  );
}
