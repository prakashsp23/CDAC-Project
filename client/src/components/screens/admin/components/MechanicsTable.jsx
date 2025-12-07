
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

export default function MechanicsTable({ data = [], onDelete }) {
  return (
    <Card>
      <CardContent className="p-0">
        <table className="w-full table-auto">
<thead className="bg-slate-50 dark:bg-slate-800 dark:text-slate-200">
            <tr>
              <th className="text-left px-4 py-3">Mechanic ID</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Assigned Jobs</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="px-4 py-3">
                  <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">{m.mechanicId}</span>
                </td>

                <td className="px-4 py-3">{m.name}</td>

                <td className="px-4 py-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2">
                  {m.email}
                  </span>
                </td>

                <td className="px-4 py-3 text-sm text-slate-600">{m.phone}</td>

                <td className="px-4 py-3">
                  {m.status === "active" ? (
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">Active</span>
                  ) : (
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">Inactive</span>
                  )}
                </td>

                <td className="px-4 py-3">{m.assignedJobs}</td>

                <td className="px-4 py-3">
                  <button
                    onClick={() => onDelete(m)}
                    className="text-red-600 hover:underline text-sm cursor-pointer  "
                    aria-label={`Delete ${m.name}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-slate-500">No mechanics found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
