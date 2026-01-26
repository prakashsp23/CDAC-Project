import React, { useState } from "react";
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

export default function MechanicsPage() {
  const [mechanics, setMechanics] = useState([
    { id: 1, mechanicId: "MECH-001", name: "John Davis", email: "john.davis@carservice.com", phone: "+1 555 123-4567", status: "active", assignedJobs: 4 },
    { id: 2, mechanicId: "MECH-002", name: "Michael Torres", email: "michael.torres@carservice.com", phone: "+1 555 234-5678", status: "active", assignedJobs: 6 },
    { id: 3, mechanicId: "MECH-003", name: "David Chen", email: "david.chen@carservice.com", phone: "+91 2570297252", status: "active", assignedJobs: 3 },
    { id: 4, mechanicId: "MECH-004", name: "Robert Smith", email: "robert.smith@carservice.com", phone: "+1 555 456-7890", status: "inactive", assignedJobs: 0 },
  ]);

  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  // Derived counts
  const total = mechanics.length;
  const activeCount = mechanics.filter(m => m.status === "active").length;
  const totalAssigned = mechanics.reduce((s, m) => s + (m.assignedJobs || 0), 0);

  // Handlers
  function handleAdd(newMech) {
    const nextId = mechanics.length ? Math.max(...mechanics.map(m => m.id)) + 1 : 1;
    const mechanicId = `MECH-${String(nextId).padStart(3, "0")}`;
    setMechanics([{ id: nextId, mechanicId, assignedJobs: 0, status: "active", ...newMech }, ...mechanics]);
    setShowAdd(false);
  }

  function handleDeleteConfirmed(id) {
    setMechanics(mechanics.filter(m => m.id !== id));
    setToDelete(null);
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
                    >
                      Delete
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
