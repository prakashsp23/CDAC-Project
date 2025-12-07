import React, { useState } from "react"
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table"

import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue
} from "@/components/ui/select"

import { Card, CardContent } from "@/components/ui/card"
import StarRating from "@/components/ui/star-rating"
import UniversalDisplay from "@/components/ui/universal-display"
import ViewToggle from "@/components/ui/ViewToggle"

export default function FeedbackPage() {
  const [filter, setFilter] = useState("All")
  const [view, setView] = useState(
    () => window.localStorage.getItem("feedback-view") || "table"
  )

  const feedbackData = [
    {
      serviceId: "SRV101",
      customer: "Rohan Patil",
      mechanic: "Amit Sharma",
      serviceType: "Engine Repair",
      rating: 5,
      comment: "Excellent service!",
      date: "2025-01-21",
    },
    {
      serviceId: "SRV102",
      customer: "Sneha Kulkarni",
      mechanic: "Vikas More",
      serviceType: "Brake Check",
      rating: 3,
      comment: "Good but slow response...",
      date: "2025-01-20",
    },
    {
      serviceId: "SRV103",
      customer: "Aditya Deshmukh",
      mechanic: "Samir Khan",
      serviceType: "Battery Replacement",
      rating: 4,
      comment: "Quick service!",
      date: "2025-01-19",
    },
  ]

  const filteredData =
    filter === "All"
      ? feedbackData
      : feedbackData.filter((item) => item.rating === filter)

  const renderStars = (count) => (
    <StarRating value={count} readOnly size={16} />
  )

  const handleViewChange = (newView) => {
    setView(newView)
    window.localStorage.setItem("feedback-view", newView)
  }

  return (
    <div className="
      p-6 rounded-2xl space-y-8
      bg-white dark:bg-[#0d0d0d]
      text-gray-900 dark:text-gray-200
    ">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customer Feedback</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Review and analyze feedback submitted by customers.
          </p>
        </div>

        {/* VIEW SWITCHER */}
        <ViewToggle view={view} onViewChange={handleViewChange} />
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

        <div className="
          p-4 rounded-xl border
          bg-white dark:bg-[#161616]
          border-gray-300 dark:border-neutral-700
          shadow-sm hover:-translate-y-1 hover:shadow-lg transition
        ">
          <p className="text-xs text-gray-600 dark:text-gray-300">Total Feedback</p>
          <p className="text-2xl mt-1 font-bold">{feedbackData.length}</p>
        </div>

        <div className="
          p-4 rounded-xl border
          bg-white dark:bg-[#161616]
          border-gray-300 dark:border-neutral-700
          shadow-sm hover:-translate-y-1 hover:shadow-lg transition
        ">
          <p className="text-xs text-gray-600 dark:text-gray-300">5-Star</p>
          <p className="text-2xl mt-1 font-bold">
            {feedbackData.filter((f) => f.rating === 5).length}
          </p>
        </div>

        <div className="
          p-4 rounded-xl border
          bg-white dark:bg-[#161616]
          border-gray-300 dark:border-neutral-700
          shadow-sm hover:-translate-y-1 hover:shadow-lg transition
        ">
          <p className="text-xs text-gray-600 dark:text-gray-300">4-Star</p>
          <p className="text-2xl mt-1 font-bold">
            {feedbackData.filter((f) => f.rating === 4).length}
          </p>
        </div>

        <div className="
          p-4 rounded-xl border
          bg-white dark:bg-[#161616]
          border-gray-300 dark:border-neutral-700
          shadow-sm hover:-translate-y-1 hover:shadow-lg transition
        ">
          <p className="text-xs text-gray-600 dark:text-gray-300">3-Star & Below</p>
          <p className="text-2xl mt-1 font-bold">
            {feedbackData.filter((f) => f.rating <= 3).length}
          </p>
        </div>

      </div>

      {/* FILTER SELECT */}
      <div className="flex items-center gap-3">
        <Select
          onValueChange={(value) =>
            setFilter(value === "All" ? "All" : Number(value))
          }
        >
          <SelectTrigger
            className="
              w-[160px]
              bg-white dark:bg-[#161616]
              border border-gray-300 dark:border-gray-700
              text-gray-800 dark:text-gray-200
            "
          >
            <SelectValue placeholder="Filter Ratings" />
          </SelectTrigger>

          <SelectContent
            className="
              bg-white dark:bg-[#161616]
              text-gray-900 dark:text-gray-200
              border border-gray-300 dark:border-gray-700
            "
          >
            <SelectItem value="All">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* GRID / TABLE TOGGLE USING UniversalDisplay */}
      <UniversalDisplay
        items={filteredData}
        view={view}
        idKey="serviceId"
        perRow={3}
        columns={[
          { key: "serviceId", title: "Service ID" },
          { key: "customer", title: "Customer" },
          { key: "mechanic", title: "Mechanic" },
          { key: "serviceType", title: "Service Type" },
          { key: "rating", title: "Rating" },
          { key: "comment", title: "Comment" },
          { key: "date", title: "Date" },
        ]}
        renderCard={(row) => (
          <Card className="h-full">
            <CardContent className="p-4 space-y-2">
              <p className="font-semibold">{row.serviceId}</p>
              <p className="text-sm text-gray-400">{row.serviceType}</p>
              <StarRating value={row.rating} readOnly size={16} />
              <p className="text-sm italic text-muted-foreground">"{row.comment}"</p>
              <p className="text-xs text-gray-500">{row.date}</p>
            </CardContent>
          </Card>
        )}
        renderRow={(row) => (
          <TableRow key={row.serviceId}>
            <TableCell>{row.serviceId}</TableCell>
            <TableCell>{row.customer}</TableCell>
            <TableCell>{row.mechanic}</TableCell>
            <TableCell>{row.serviceType}</TableCell>
            <TableCell>{renderStars(row.rating)}</TableCell>
            <TableCell>{row.comment}</TableCell>
            <TableCell>{row.date}</TableCell>
          </TableRow>
        )}
      />
    </div>
  )
}
