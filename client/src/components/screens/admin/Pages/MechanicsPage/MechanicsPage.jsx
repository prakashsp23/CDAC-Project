import React, { useState } from "react";
import MechanicForm from "../../components/MechanicForm";
import ConfirmDelete from "../../components/ConfirmDelete";
import MechanicsTable from "../../components/MechanicsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {Button} from "@/components/ui/button"
export default function MechanicsPage() {

  const initial = [
    { id: 1, mechanicId: "MECH-001", name: "John Davis", email: "john.davis@carservice.com", phone: "+1 555 123-4567", status: "active", assignedJobs: 4 },
    { id: 2, mechanicId: "MECH-002", name: "Michael Torres", email: "michael.torres@carservice.com", phone: "+1 555 234-5678", status: "active", assignedJobs: 6 },
    { id: 3, mechanicId: "MECH-003", name: "David Chen", email: "david.chen@carservice.com", phone: "+91 2570297252", status: "active", assignedJobs: 3 },
    { id: 4, mechanicId: "MECH-004", name: "Robert Smith", email: "robert.smith@carservice.com", phone: "+1 555 456-7890", status: "inactive", assignedJobs: 0 },
  ];

  const [mechanics, setMechanics] = useState(initial);
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [toDelete, setToDelete] = useState(null); // mechanic object to delete

  // derived counts
  const total = mechanics.length;
  const activeCount = mechanics.filter(m => m.status === "active").length;
  const totalAssigned = mechanics.reduce((s, m) => s + (m.assignedJobs || 0), 0);

  // add new mechanic (simple - generates next id)
  function handleAdd(newMech) {
    const nextId = mechanics.length ? Math.max(...mechanics.map(m => m.id)) + 1 : 1;
    const mechanicId = `MECH-${String(nextId).padStart(3, "0")}`;
    setMechanics([{ id: nextId, mechanicId, assignedJobs: 0, status: "active", ...newMech }, ...mechanics]);
    setShowAdd(false);
  }

  // delete confirmed
  function handleDeleteConfirmed(id) {
    setMechanics(mechanics.filter(m => m.id !== id));
    setToDelete(null);
  }

  // client-side search
  const filtered = mechanics.filter(m =>
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.email.toLowerCase().includes(query.toLowerCase()) ||
    m.mechanicId.toLowerCase().includes(query.toLowerCase())
  );

  return (
 <div className="flex flex-col gap-6 px-8 py-6">
        {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Mechanics Management</h2>
        <p className="text-sm text-slate-500">Manage your service station mechanics</p>
      </div>

      {/* Search + Add button */}
      <div className="flex items-center justify-between gap-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search mechanics by name, email, or ID..."
          className="flex-1 max-w-lg rounded-lg border px-4 py-2 text-sm 
             bg-white dark:bg-slate-800 dark:border-slate-700 
             text-slate-900 dark:text-slate-200 
             placeholder:text-slate-500 dark:placeholder:text-slate-400"
        />
        <Button
          onClick={() => setShowAdd(true)}
        >
          + Add Mechanic
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="pb-2">


            <CardTitle className="text-sm">Total Mechanics</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-4 px-4 text-2xl font-semibold">
              {total}</CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="pb-2">

            <CardTitle className="text-sm">Active</CardTitle>
          </CardHeader>
         <CardContent className="pt-0 pb-4 px-4 text-2xl font-semibold">
{activeCount}</CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="pb-2">

            <CardTitle className="text-sm">Total Assigned Jobs</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-4 px-4 text-2xl font-semibold">
{totalAssigned}</CardContent>
        </Card>
      </div>


      {/* Table */}
      <MechanicsTable
        data={filtered}
        onDelete={(mechanic) => setToDelete(mechanic)}
      />
      {/* Add Mechanic dialog (shadcn controlled) */}
      <MechanicForm
        open={showAdd}
        onOpenChange={setShowAdd}
        onSave={handleAdd}
      />
      {/* Delete confirm modal */}
      <ConfirmDelete
        open={!!toDelete}
        onOpenChange={(open) => { if (!open) setToDelete(null); }}
        name={toDelete?.name}
        onConfirm={() => handleDeleteConfirmed(toDelete.id)}
      />

    </div>
  );
}
