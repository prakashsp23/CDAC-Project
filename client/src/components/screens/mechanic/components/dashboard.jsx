import React from "react";
import { Card } from "../../../ui/card";
import { Timer, Wrench, CheckCircle, Tag, Clock } from "lucide-react";

export default function Dashboard() {
  
  const stats = [
    {
      title: "Jobs Assigned",
      value: 4,
      icon: <Timer className="w-6 h-6 text-gray-700" />,
      iconBg: "bg-gray-100",
    },
    {
      title: "Jobs In Progress",
      value: 2,
      icon: <Wrench className="w-6 h-6 text-blue-700" />,
      iconBg: "bg-blue-100",
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
      name: "Michael Johnson",
      id: "SRV-001",
      car: "Toyota Camry 2022",
      plate: "ABC-1234",
      task: "Oil Change & Filter Replacement",
      status: "Pending",
      time: "09:00 AM",
    },
  ];

  return (
    <div className="p-8 space-y-10">

      <div>
        <h1 className="text-2xl font-semibold">Welcome back, John!</h1>
        <p className="text-gray-500 mt-1">Monday, November 3, 2025</p>
      </div>

  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <Card key={index} className="p-6 border shadow-sm rounded-xl bg-white">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${item.iconBg}`}>
                {item.icon}
              </div>
              <div>
                <p className="text-gray-500 text-sm">{item.title}</p>
                <h2 className="text-2xl font-bold">{item.value}</h2>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Recent Active Jobs</h2>
        <button className="text-blue-600 text-sm">View All →</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentJobs.map((job, index) => (
          <Card key={index} className="p-4 border shadow-sm rounded-xl bg-white">

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-sm">{job.name}</h3>
                <p className="text-gray-500 text-xs">{job.id}</p>
              </div>

              <span
                className={`px-2 py-1 text-[10px] rounded-full font-medium 
                  ${
                    job.status === "In Progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
              >
                {job.status}
              </span>
            </div>

            <p className="mt-3 text-gray-700 text-sm">{job.car}</p>

            <span className="inline-block mt-2 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">
              {job.plate}
            </span>

            <div className="flex items-center gap-2 mt-3 bg-gray-50 p-2 rounded-lg">
              <Tag className="w-3 h-3 text-gray-600" />
              <p className="text-xs text-gray-700 truncate">{job.task}</p>
            </div>

          </Card>
        ))}
      </div>
    </div>
  );
}
