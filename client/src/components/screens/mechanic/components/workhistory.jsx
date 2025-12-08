import React from "react";
import StarRating from "../../../ui/star-rating";

export default function WorkHistory() {
  const completedJobs = [
    {
      jobId: "SRV-097",
      vehicle: "Honda Civic 2021 (XYZ-1111)",
      service: "Complete Engine Overhaul",
      date: "Nov 1, 2025",
      rating: 5,
      feedback: "Excellent work! Very professional and thorough.",
    },
    {
      jobId: "SRV-096",
      vehicle: "BMW 5 Series 2022 (ABC-2222)",
      service: "Transmission Repair",
      date: "Oct 30, 2025",
      rating: 5,
      feedback: "Fast and reliable service.",
    },
    {
      jobId: "SRV-095",
      vehicle: "Toyota RAV4 2020 (DEF-3333)",
      service: "Brake System Replacement",
      date: "Oct 28, 2025",
      rating: 4,
      feedback: "Good service, slight delay but quality work.",
    },
    {
      jobId: "SRV-094",
      vehicle: "Mazda CX-5 2023 (GHI-4444)",
      service: "Oil Change & Filter",
      date: "Oct 27, 2025",
      rating: 5,
      feedback: "Quick and efficient!",
    },
  ];

  return (
    <div className="py-6 px-8 w-[90%] mx-auto space-y-8">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Work History</h1>
          <p className="text-muted-foreground text-sm">Review your completed service records</p>
        </div>

          <div className="flex items-center gap-6 text-sm whitespace-nowrap">
          <span>
            Average Rating: <span className="font-semibold">4.8 ⭐</span>
          </span>
          <span>
            Total Completed: <span className="font-semibold">8</span>
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">

          <thead>
            <tr className="border-b bg-muted/20">
              <th className="text-left p-3">Job ID</th>
              <th className="text-left p-3">Vehicle</th>
              <th className="text-left p-3">Service Done</th>
              <th className="text-left p-3">Date Completed</th>
              <th className="text-left p-3">Rating</th>
              <th className="text-left p-3">Feedback</th>
            </tr>
          </thead>

          <tbody>
            {completedJobs.map((job, index) => (
              <tr key={index} className="border-b hover:bg-muted/10 transition">
                <td className="p-3 whitespace-nowrap">
                  <span className="px-2 py-1 bg-muted/50 border rounded text-sm font-semibold whitespace-nowrap">
                    {job.jobId}
                  </span>
                </td>

                <td className="p-3">{job.vehicle}</td>
                <td className="p-3">{job.service}</td>
                <td className="p-3">{job.date}</td>

                <td className="p-3 whitespace-nowrap">
                  <StarRating value={job.rating} readOnly={true} size={18} />
                </td>

                <td className="p-3">{job.feedback}</td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
