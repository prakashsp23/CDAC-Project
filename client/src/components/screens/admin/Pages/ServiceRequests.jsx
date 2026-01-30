import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ViewRequestDialog from "../components/ViewRequestDialog";
import AssignMechanicDialog from "../components/AssignMechanicDialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
export default function ServiceRequestsTable() {
  const [filter, setFilter] = useState("All");
  const [requests, setRequests] = useState([
    {
      id: "REQ101",
      customer: "Rohan Patil",
      model: "Honda City",
      issue: "Engine Noise",
      status: "New",
      mechanic: "Unassigned",
      date: "2025-01-20",
    },
    {
      id: "REQ102",
      customer: "Sneha Kulkarni",
      model: "Maruti Baleno",
      issue: "Brake Failure",
      status: "Pending",
      mechanic: "Unassigned",
      date: "2025-01-18",
    },
    {
      id: "REQ103",
      customer: "Aditya Deshmukh",
      model: "Hyundai i20",
      issue: "Battery Low",
      status: "Ongoing",
      mechanic: "Samir Khan",
      date: "2025-01-19",
    },
  ]);

  const handleAccept = (id) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? { ...req, status: "Pending", mechanic: "Unassigned" }
          : req
      )
    );
  };

  const handleReject = (id) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const handleAssign = (id, mechanicName) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? { ...req, mechanic: mechanicName, status: "Ongoing" }
          : req
      )
    );
  };

  const filteredRequests =
    filter === "All"
      ? requests
      : requests.filter((req) => req.status === filter);

  const filters = ["All", "New", "Pending", "Ongoing", "Completed"];

  const getStatusVariant = (status) => {
    if (status === "Completed") return "default";
    if (status === "Ongoing") return "secondary";
    return "outline";
  };

  const cardStyles = `p-4 rounded-xl border 
     bg-white dark:bg-neutral-800/60 
     border-neutral-300 dark:border-neutral-700
     shadow-sm hover:shadow-lg hover:-translate-y-1 transition cursor-pointer`;

  return (
    <div
      className="
      p-6 rounded-2xl space-y-6
      bg-white dark:bg-neutral-900
      text-gray-900 dark:text-neutral-200
    "
    >
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">Service Requests</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Manage and track all customer service requests.
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-4">
        <div className={cardStyles} onClick={() => setFilter("New")}>
          <p className="text-xs text-neutral-600 dark:text-neutral-300">
            New Requests
          </p>
          <p className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-100">
            {requests.filter((r) => r.status === "New").length}
          </p>
        </div>

        <div className={cardStyles} onClick={() => setFilter("Pending")}>
          <p className="text-xs text-neutral-600 dark:text-neutral-300">
            Pending
          </p>
          <p className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-100">
            {requests.filter((r) => r.status === "Pending").length}
          </p>
        </div>

        <div className={cardStyles} onClick={() => setFilter("Ongoing")}>
          <p className="text-xs text-neutral-600 dark:text-neutral-300">
            Ongoing
          </p>
          <p className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-100">
            {requests.filter((r) => r.status === "Ongoing").length}
          </p>
        </div>

        <div className={cardStyles} onClick={() => setFilter("Completed")}>
          <p className="text-xs text-neutral-600 dark:text-neutral-300">
            Completed
          </p>
          <p className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-100">
            {requests.filter((r) => r.status === "Completed").length}
          </p>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div
        className="
        flex gap-3 p-2 rounded-full w-fit
        bg-neutral-100 dark:bg-neutral-800
        border border-neutral-300 dark:border-neutral-700
      "
      >
        {filters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`
              px-4 py-1 rounded-full text-sm font-medium transition
              ${
                filter === item
                  ? "bg-white dark:bg-neutral-700 shadow"
                  : "opacity-60 hover:opacity-100"
              }
            `}
          >
            {item}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="rounded-xl border border-neutral-300 dark:border-neutral-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="dark:border-neutral-700">
              <TableHead>Request ID</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Car Model</TableHead>
              <TableHead>Issue Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned Mechanic</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredRequests.map((row) => (
              <TableRow
                key={row.id}
                className="dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.customer}</TableCell>
                <TableCell>{row.model}</TableCell>
                <TableCell>{row.issue}</TableCell>

                <TableCell>
                  <Badge
                    variant={getStatusVariant(row.status)}
                    className="px-2 py-1 text-xs"
                  >
                    {row.status}
                  </Badge>
                </TableCell>

                <TableCell>{row.mechanic}</TableCell>
                <TableCell>{row.date}</TableCell>

                <TableCell className="space-x-2">
                  {row.status === "New" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAccept(row.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(row.id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}

                  {row.status === "Pending" && (
                    <>
                      <ViewRequestDialog request={row} />
                      <AssignMechanicDialog
                        request={row}
                        onAssign={(mechanic) => handleAssign(row.id, mechanic)}
                      />
                    </>
                  )}

                  {["Ongoing", "Completed"].includes(row.status) && (
                    <ViewRequestDialog request={row} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
