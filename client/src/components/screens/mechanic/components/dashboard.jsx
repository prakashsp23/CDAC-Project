import React from "react";
import { Card, CardContent } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Timer, Wrench, CheckCircle, Tag, Clock } from "lucide-react";
import { useTheme } from "../../../theme-provider";

export default function Dashboard() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === "dark") setTheme("light")
    else setTheme("dark")
  }
  const stats = [
    {
      title: "Jobs Assigned",
      value: 4,
      icon: <Timer className="w-6 h-6 text-gray-700" />,
      iconBg: "bg-gray-100",
    },
    {
      title: "Jobs Completed",
      value: 15,
      icon: <CheckCircle className="w-6 h-6 text-green-700" />,
      iconBg: "bg-green-100",
    },
  ];

  const recentJobs = [
    {
      name: "Sarah Williams",
      id: "SRV-002",
      car: "Honda Accord 2021",
      plate: "XYZ-5678",
      task: "Engine Diagnostics",
      status: "In Progress",
      time: "08:30 AM",
    },
    {
      name: "Robert Brown",
      id: "SRV-003",
      car: "Ford F-150 2020",
      plate: "DEF-9012",
      task: "Brake System Inspection",
      status: "In Progress",
      time: "10:00 AM",
    },
    {
      name: "Robert Brown",
      id: "SRV-003",
      car: "Ford F-150 2020",
      plate: "DEF-9012",
      task: "Brake System Inspection",
      status: "In Progress",
      time: "10:00 AM",
    },
  ];

  return (
    <div className="py-6 px-8 w-[90%] mx-auto space-y-10">

      <div>
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, John!</h1>
          <p className="text-muted-foreground mt-1">Sunday, November 7, 2025</p>
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
        <Button size="sm" variant="ghost">View All →</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentJobs.map((job, index) => (
          <Card key={index} className="rounded-xl self-start">
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-sm">{job.name}</h3>
                  <p className="text-xs text-muted-foreground">{job.id}</p>
                </div>

                <span className="px-2 py-1 text-[10px] rounded-full font-medium bg-muted/50 text-muted-foreground">
                  {job.status}
                </span>
              </div>

              <p className="mt-3 text-sm text-muted-foreground">{job.car}</p>

              <span className="inline-block mt-2 bg-muted/50 text-xs px-2 py-1 rounded-md text-muted-foreground">
                {job.plate}
              </span>

              <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-muted/20">
                <Tag className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground truncate">{job.task}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
