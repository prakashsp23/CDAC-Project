import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ViewRequestDialog from "../components/ViewRequestDialog";
import AssignMechanicDialog from "../components/AssignMechanicDialog";
import RejectReasonDialog from "../components/RejectReasonDialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

import {
  useGetAllServices,
  useAcceptServiceMutation,
  useRejectServiceMutation,
  useAssignMechanicMutation,
} from "@/query/queries/serviceQueries";

export default function ServiceRequestsTable() {
  const [filter, setFilter] = useState("All");

  // Fetch all service requests using shared hook
  const { data: response, isLoading, isError } = useGetAllServices()
  const requests = response?.data || [];

  // Mutations
  const acceptMutation = useAcceptServiceMutation();
  const rejectMutation = useRejectServiceMutation();
  const assignMutation = useAssignMechanicMutation();

  const handleAccept = (serviceId) => {
    acceptMutation.mutate(serviceId);
  };

  const handleReject = (serviceId, reason) => {
    rejectMutation.mutate({ serviceId, reason });
  };

  const handleAssign = (serviceId, mechanicId) => {
    assignMutation.mutate({ serviceId, mechanicId });
  };

  const filteredRequests =
    filter === "All"
      ? requests
      : requests.filter((req) => req.status === filter);

  const filters = ["All", "PENDING", "ACCEPTED", "ONGOING", "COMPLETED", "CANCELLED"];

  const getStatusVariant = (status) => {
    switch (status) {
      case "COMPLETED":
        return "default";
      case "ONGOING":
        return "secondary";
      case "ACCEPTED":
        return "secondary";
      case "PENDING":
        return "warning";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const cardStyles = `p-4 rounded-xl border 
     bg-white dark:bg-neutral-800/60 
     border-neutral-300 dark:border-neutral-700
     shadow-sm hover:shadow-lg hover:-translate-y-1 transition cursor-pointer`;

  // Helper to safely get counts
  const getCount = (status) => requests.filter((r) => r.status === status).length;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load service requests. Please try again.
      </div>
    );
  }

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
        <div className={cardStyles} onClick={() => setFilter("PENDING")}>
          <p className="text-xs text-neutral-600 dark:text-neutral-300">
            Pending Requests
          </p>
          <p className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-100">
            {getCount("PENDING")}
          </p>
        </div>

        <div className={cardStyles} onClick={() => setFilter("ACCEPTED")}>
          <p className="text-xs text-neutral-600 dark:text-neutral-300">
             Accepted Requests
          </p>
          <p className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-100">
            {getCount("ACCEPTED")}
          </p>
        </div>

        <div className={cardStyles} onClick={() => setFilter("ONGOING")}>
          <p className="text-xs text-neutral-600 dark:text-neutral-300">
            Ongoing
          </p>
          <p className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-100">
            {getCount("ONGOING")}
          </p>
        </div>

        <div className={cardStyles} onClick={() => setFilter("COMPLETED")}>
          <p className="text-xs text-neutral-600 dark:text-neutral-300">
            Completed
          </p>
          <p className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-100">
            {getCount("COMPLETED")}
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
              <TableHead>Mechanic</TableHead>
              <TableHead>Parts Total</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredRequests.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={11} className="h-24 text-center">
                   No requests found.
                 </TableCell>
               </TableRow>
            ) : (
              filteredRequests.map((row) => (
                <TableRow
                  key={row.id}
                  className="dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                >
                  <TableCell>#{row.id}</TableCell>
                  <TableCell>{row.customerName || "Unknown"}</TableCell>
                  <TableCell>
                    {row.carBrand ? `${row.carBrand} ${row.carModel}` : "N/A"}
                  </TableCell>
                  <TableCell>{row.serviceName || "General"}</TableCell>

                  <TableCell>
                    <Badge
                      variant={getStatusVariant(row.status)}
                      className="px-2 py-1 text-xs"
                    >
                      {row.status}
                    </Badge>
                  </TableCell>

                  <TableCell>{row.mechanicName || "Unassigned"}</TableCell>
                  <TableCell>₹{row.partsTotal || 0}</TableCell>
                  <TableCell className="font-semibold text-green-600 dark:text-green-400">
                    ₹{row.totalAmount || 0}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {row.paymentStatus || "N/A"}
                    </Badge>
                  </TableCell>
                  {/* Format date if needed, assuming ISO string or similar */}
                  <TableCell>{row.createdAt || "N/A"}</TableCell>

                  <TableCell className="space-x-2">
                    {row.status === "PENDING" && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAccept(row.id)}
                          disabled={acceptMutation.isPending}
                        >
                          {acceptMutation.isPending ? "..." : "Accept"}
                        </Button>
                        <RejectReasonDialog 
                          onReject={(reason) => handleReject(row.id, reason)}
                          isPending={rejectMutation.isPending}
                        />
                      </div>
                    )}

                    {row.status === "ACCEPTED" && (
                      <div className="flex gap-2">
                        <ViewRequestDialog request={row} />
                        <AssignMechanicDialog
                          request={row}
                          onAssign={(mechanicId) => handleAssign(row.id, mechanicId)}
                          isPending={assignMutation.isPending}
                        />
                      </div>
                    )}

                    {["ONGOING", "COMPLETED", "CANCELLED"].includes(row.status) && (
                      <ViewRequestDialog request={row} />
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
