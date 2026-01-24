import React from "react";
import { useQuery } from "@tanstack/react-query";
import { MechanicApi } from "../../../../services/apiService";
import StarRating from "../../../ui/star-rating";
import { AlertCircle } from "lucide-react";

export default function WorkHistory() {
  const { data: workLogs = [], isLoading, error } = useQuery({
    queryKey: ["workHistory"],
    queryFn: MechanicApi.fetchWorkHistory,
  });

  if (isLoading) {
    return (
      <div className="py-6 px-8 w-[90%] mx-auto">
        <p className="text-center text-muted-foreground">Loading work history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 px-8 w-[90%] mx-auto">
        <p className="text-center text-red-500">Failed to load work history</p>
      </div>
    );
  }

  const averageRating = workLogs.length > 0 
    ? (workLogs.reduce((sum, job) => sum + (job.rating || 0), 0) / workLogs.filter(job => job.rating > 0).length).toFixed(1)
    : 0;

  return (
    <div className="py-6 px-8 w-[90%] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Work History</h1>
          <p className="text-muted-foreground text-sm">Review your completed service records</p>
        </div>

        <div className="flex items-center gap-6 text-sm whitespace-nowrap">
          <span>
            Average Rating: <span className="font-semibold">{averageRating} ⭐</span>
          </span>
          <span>
            Total Completed: <span className="font-semibold">{workLogs.length}</span>
          </span>
        </div>
      </div>

      {workLogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No completed services yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b bg-muted/20">
                <th className="text-left p-3">Service ID</th>
                <th className="text-left p-3">Vehicle</th>
                <th className="text-left p-3">Date Completed</th>
                <th className="text-left p-3">Rating</th>
                <th className="text-left p-3">Feedback</th>
              </tr>
            </thead>

            <tbody>
              {workLogs.map((job, index) => (
                <tr key={index} className="border-b hover:bg-muted/10 transition">
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-1 bg-muted/50 border rounded text-sm font-semibold">
                      {job.serviceId}
                    </span>
                  </td>

                  <td className="p-3">{job.vehicleName}</td>
                  <td className="p-3">{job.completionDate}</td>

                  <td className="p-3 whitespace-nowrap">
                    {job.rating > 0 ? (
                      <StarRating value={job.rating} readOnly={true} size={18} />
                    ) : (
                      <span className="text-xs text-muted-foreground">No rating</span>
                    )}
                  </td>

                  <td className="p-3">
                    {job.feedback ? (
                      <span>{job.feedback}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
