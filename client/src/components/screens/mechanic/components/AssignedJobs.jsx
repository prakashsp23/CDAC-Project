import { useState } from "react";
import { Card, CardContent } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Search, Filter, Calendar, Eye } from "lucide-react";
import { useGetMechanicAssignedJobs } from "../../../../query/queries/mechanicQueries";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function AssignedJobs() {
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();

  // Queries
  const { data: jobsList = [], isLoading } = useGetMechanicAssignedJobs();

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
          <div className="col-span-full flex flex-col items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary/60 mb-3"></div>
            <span className="text-lg text-muted-foreground">Loading assigned jobs...</span>
          </div>
        ) : filteredJobs.length === 0 ? (
          <p className="text-muted-foreground">No assigned jobs found.</p>
        ) : filteredJobs.map((job) => (
          <Card key={job.id} className="rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              {/* Status Header */}


              <div className="p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-semibold text-lg max-w-[200px] truncate" title={job.customerName}>{job.customerName}</h2>
                    <p className="text-xs text-muted-foreground">ID: #{job.id}</p>
                  </div>

                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${job.status === 'COMPLETED'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                    {job.status}
                  </span>
                </div>

                {/* Service Info */}
                <div className="bg-muted/30 p-3 rounded-lg mb-4">
                  <p className="font-medium text-sm text-primary mb-1">{job.serviceName}</p>
                  <div className="flex items-center text-xs text-muted-foreground gap-2">
                    <Calendar className="w-3 h-3" />
                    {job.createdOn ? format(new Date(job.createdOn), 'PPP') : 'N/A'}
                  </div>
                </div>

                {/* Vehicle */}
                <div className="flex justify-between items-end text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wide">Vehicle</p>
                    <p className="font-medium">{job.carBrand} {job.carModel}</p>
                  </div>
                  <span className="bg-muted px-2 py-1 text-xs rounded font-mono text-muted-foreground">
                    {job.carPlate}
                  </span>
                </div>

                {/* Action Button */}
                <div className="mt-5 pt-4 border-t">
                  <Button
                    className="w-full gap-2"
                    onClick={() => navigate(`/mechanic/service/${job.id}`)}
                  >
                    <Eye className="w-4 h-4" />
                    View Details & Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
