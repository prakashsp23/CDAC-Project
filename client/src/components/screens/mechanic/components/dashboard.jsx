import React from "react";
import { Card, CardContent } from "../../../ui/card";
import { Timer, CheckCircle, Tag } from "lucide-react";
import { useTheme } from "../../../theme-provider";
import { useGetMechanicAssignedJobs, useGetMechanicWorkLogs } from "../../../../query/queries/mechanicQueries";
import { useGetCurrentUser } from "../../../../query/queries/userQueries";
import { format } from "date-fns";

export default function Dashboard() {
  const { theme, setTheme } = useTheme();

  // Queries
  const { data: user } = useGetCurrentUser();
  const { data: assignedJobs, isLoading: isLoadingJobs } = useGetMechanicAssignedJobs();
  const { data: workLogs, isLoading: isLoadingLogs } = useGetMechanicWorkLogs();

  const stats = [
    {
      title: "Jobs Assigned",
      value: assignedJobs?.length || 0,
      icon: <Timer className="w-6 h-6 text-gray-700" />,
      iconBg: "bg-gray-100",
    },
    {
      title: "Jobs Completed",
      value: workLogs?.length || 0,
      icon: <CheckCircle className="w-6 h-6 text-green-700" />,
      iconBg: "bg-green-100",
    },
  ];

  return (
    <div className="py-6 px-8 w-[90%] mx-auto space-y-10">

      <div>
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, {user?.name || 'Mechanic'}!</h1>
          <p className="text-muted-foreground mt-1">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <Card key={index} className="rounded-xl self-start">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-muted/50`}>{item.icon}</div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  <h2 className="text-2xl font-bold">{item.value}</h2>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Recent Active Jobs</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoadingJobs ? (
          <p className="text-muted-foreground">Loading jobs...</p>
        ) : assignedJobs?.length === 0 ? (
          <p className="text-muted-foreground">No active jobs assigned.</p>
        ) : (
          assignedJobs?.map((job, index) => (
            <Card key={index} className="rounded-xl self-start">
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-sm">{job.customerName}</h3>
                    <p className="text-xs text-muted-foreground">ID: {job.id}</p>
                  </div>

                  <span className="px-2 py-1 text-[10px] rounded-full font-medium bg-muted/50 text-muted-foreground">
                    {job.status}
                  </span>
                </div>

                <p className="mt-3 text-sm text-muted-foreground">{job.carBrand} {job.carModel}</p>

                <span className="inline-block mt-2 bg-muted/50 text-xs px-2 py-1 rounded-md text-muted-foreground">
                  {job.carPlate}
                </span>

                <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-muted/20">
                  <Tag className="w-3 h-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground truncate">{job.serviceName}</p>
                </div>

              </CardContent>
            </Card>
          ))
        )}
      </div>

    </div>
  );
}
