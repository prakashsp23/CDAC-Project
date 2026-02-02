import React, { useState, useMemo } from "react";
import MechanicForm from "../../components/MechanicForm";
import ConfirmDelete from "../../components/ConfirmDelete";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useGetAllMechanics, useDeleteMechanicMutation } from "@/query/queries/adminQueries";
import { Loader2 } from "lucide-react";

export default function MechanicsPage() {
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  // React Query Hooks
  const { data: response, isLoading, isError } = useGetAllMechanics();
  const deleteMutation = useDeleteMechanicMutation();

  // Map Backend Data
  const mechanics = useMemo(() => {
    const rawMechanics = response?.data || [];
    return rawMechanics.map(m => ({
      id: m.id,
      mechanicId: `MECH-${String(m.id).padStart(3, "0")}`,
      name: m.name || "N/A",
      email: m.email || "N/A",
      phone: m.phone || "N/A",
      status: (m.status || "Inactive").toLowerCase(),
      assignedJobs: m.assignedJobs || 0
    }));
  }, [response]);

  // Derived counts
  const total = mechanics.length;
  const activeCount = mechanics.filter(m => m.status === "active").length;
  const totalAssigned = mechanics.reduce((s, m) => s + (m.assignedJobs || 0), 0);

  // Handlers
  function handleAdd(newMech) {
    // Skipping implementation as per request
    console.log("Add mechanic skip requested", newMech);
    setShowAdd(false);
  }

  function handleDeleteConfirmed(id) {
    deleteMutation.mutate(id, {
      onSuccess: () => setToDelete(null)
    });
  }

  // Filter
  const filtered = mechanics.filter(m =>
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.email.toLowerCase().includes(query.toLowerCase()) ||
    m.mechanicId.toLowerCase().includes(query.toLowerCase())
  );

  const cardStyles = `p-4 rounded-xl border 
     bg-white dark:bg-neutral-800 
     border-neutral-300 dark:border-neutral-700
     shadow-sm hover:shadow-lg hover:-translate-y-1 transition cursor-pointer`;

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
        Failed to load mechanics. Please try again.
      </div>
    );
  }

  return (
    <div className="
      p-6 rounded-2xl space-y-6
      bg-white dark:bg-neutral-900
      text-gray-900 dark:text-neutral-200
    ">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight">Mechanics Management</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Manage your service station mechanics
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)}>+ Add Mechanic</Button>
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-md">
        <Input
          placeholder="Search mechanics by name, email, or ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-white dark:bg-neutral-800"
        />
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
        <div className={cardStyles}>
          <p className="text-xs text-neutral-600 dark:text-neutral-300">Total Mechanics</p>
          <p className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-100">{total}</p>
        </div>
        <div className={cardStyles}>
          <p className="text-xs text-neutral-600 dark:text-neutral-300">Active Mechanics</p>
          <p className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-100">{activeCount}</p>
        </div>
        <div className={cardStyles}>
          <p className="text-xs text-neutral-600 dark:text-neutral-300">Assigned Jobs</p>
          <p className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-100">{totalAssigned}</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-xl border border-neutral-300 dark:border-neutral-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="dark:border-neutral-700">
              <TableHead>Mechanic ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned Jobs</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((m) => (
                <TableRow
                  key={m.id}
                  className="dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                >
                  <TableCell className="font-medium">{m.mechanicId}</TableCell>
                  <TableCell>{m.name}</TableCell>
                  <TableCell className="text-xs text-neutral-500">{m.email}</TableCell>
                  <TableCell className="text-xs">{m.phone}</TableCell>
                  <TableCell>
                    <Badge variant={m.status === "active" ? "default" : "destructive"}>
                      {m.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{m.assignedJobs}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setToDelete(m)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending && toDelete?.id === m.id ? "Delet..." : "Delete"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-neutral-500">
                  No mechanics found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* DIALOGS */}
      <MechanicForm
        open={showAdd}
        onOpenChange={setShowAdd}
        onSave={handleAdd}
      />
      <ConfirmDelete
        open={!!toDelete}
        onOpenChange={(open) => { if (!open) setToDelete(null); }}
        name={toDelete?.name}
        onConfirm={() => handleDeleteConfirmed(toDelete.id)}
      />
    </div>
  );
}
