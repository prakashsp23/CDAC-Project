import React, { useState } from "react";
import { Card, CardContent } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Search, Filter, Calendar } from "lucide-react";
import UpdateServiceModal from "./UpdateServiceModal";

export default function AssignedJobs() {
  const initialJobs = [
    {
      id: "SRV-001",
      customer: "Michael Johnson",
      car: "Toyota Camry 2022",
      plate: "ABC-1234",
      service: "Oil Change & Filter Replacement",
      start: "09:00 AM",
      expected: "11:00 AM",
      status: "Pending",
      note: "",
    },
    {
      id: "SRV-002",
      customer: "Sarah Williams",
      car: "Honda Accord 2021",
      plate: "XYZ-5678",
      service: "Engine Diagnostics",
      start: "08:30 AM",
      expected: "12:30 PM",
      status: "In Progress",
      note: "Initial diagnostic shows possible sensor malfunction",
    },
    {
      id: "SRV-003",
      customer: "Emily Davis",
      car: "Ford Focus 2020",
      plate: "DEF-7890",
      service: "Brake Pad Replacement",
      start: "10:00 AM",
      expected: "01:00 PM",
      status: "Pending",
      note: "",
    },
  ];

  const [jobsList, setJobsList] = useState(initialJobs);
  const [filterStatus, setFilterStatus] = useState("All");

  const [selectedJob, setSelectedJob] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // draft notes (saved only when Update is clicked)
  const [noteDrafts, setNoteDrafts] = useState({});

  const handleJobUpdate = (updatedJob) => {
    const updatedList = jobsList.map((job) =>
      job.id === updatedJob.id ? updatedJob : job
    );
    setJobsList(updatedList);
  };

  const filteredJobs =
    filterStatus === "All"
      ? jobsList
      : jobsList.filter((job) => job.status === filterStatus);

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
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="rounded-xl">
            <CardContent className="p-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-lg">{job.customer}</h2>
                  <p className="text-xs text-muted-foreground">{job.id}</p>
                </div>

                <span className="px-3 py-1 text-xs rounded-full bg-muted/50">
                  {job.status}
                </span>
              </div>

              {/* Vehicle */}
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">{job.car}</p>
                <span className="inline-block mt-2 bg-muted/50 px-3 py-1 text-xs rounded-md">
                  {job.plate}
                </span>
              </div>

              {/* Service */}
              <div className="mt-4 bg-muted/20 p-3 rounded-lg">
                <p className="text-sm font-medium">{job.service}</p>
              </div>

              {/* Time */}
              <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Start: {job.start}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Expected: {job.expected}
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
                    onClick={() => {
                      handleJobUpdate({
                        ...job,
                        note: noteDrafts[job.id] ?? job.note,
                      });

                      setNoteDrafts({
                        ...noteDrafts,
                        [job.id]: undefined,
                      });
                    }}
                  >
                    Update
                  </Button>
                </div>

                <textarea
                  placeholder="e.g. Oil filter replaced, diagnostics completed..."
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-muted/50"
                  value={noteDrafts[job.id] ?? job.note}
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
                    setSelectedJob(job);
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
