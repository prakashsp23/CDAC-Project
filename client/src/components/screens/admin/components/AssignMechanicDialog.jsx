import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Search, Wrench, User, Loader2 } from "lucide-react";
import { useGetMechanics } from "@/query/queries/userQueries";

export default function AssignMechanicDialog({ request, onAssign, isPending }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedMechanicId, setSelectedMechanicId] = useState(null);

  const { data: mechanics = [], isLoading, isError } = useGetMechanics();

  const filteredMechanics = mechanics.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          Assign
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          max-w-md p-3 rounded-xl space-y-1.5 
          max-h-[80vh] overflow-y-auto
          bg-white dark:bg-neutral-900
          border-gray-300 dark:border-neutral-800
          text-gray-900 dark:text-neutral-200
        "
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center gap-2">
          <Wrench className="w-4 h-4 text-blue-600" />
          <DialogTitle className="text-lg font-semibold">
            Assign Mechanic
          </DialogTitle>
        </DialogHeader>

        {/* Request Info */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg border bg-gray-50 dark:bg-neutral-900/70 dark:border-neutral-800">
            <p className="text-[10px] text-gray-500 dark:text-neutral-400">
              Request ID
            </p>
            <p className="text-sm font-medium">#{request.id}</p>
          </div>

          <div className="p-2 rounded-lg border bg-gray-50 dark:bg-neutral-900/70 dark:border-neutral-800">
            <p className="text-[10px] text-gray-500 dark:text-neutral-400">
              Current Mechanic
            </p>
            <p className="text-sm font-medium">
              {request.mechanicName || "Unassigned"}
            </p>
          </div>
        </div>

        <Separator className="dark:bg-neutral-800" />

        {/* Search Bar */}
        <div
          className="
          flex items-center gap-2 p-2 rounded-md border
          bg-gray-50 dark:bg-neutral-900/70
          border-gray-300 dark:border-neutral-800
        "
        >
          <Search className="w-4 h-4 text-gray-600 dark:text-neutral-400" />
          <input
            type="text"
            placeholder="Search mechanic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-sm text-gray-800 dark:text-neutral-200"
          />
        </div>

        <div className="flex items-center gap-1 mt-1">
          <User className="w-3 h-3 text-gray-600 dark:text-neutral-400" />
          <h3 className="font-semibold text-xs">Available Mechanics</h3>
        </div>

        {/* Mechanics List */}
        <div
          className="
            max-h-40 overflow-y-auto border rounded-md p-2 
            bg-gray-50 dark:bg-neutral-900
            border-gray-300 dark:border-neutral-800
            space-y-1
          "
        >
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          ) : isError ? (
            <p className="text-center text-red-500 text-xs py-2">
              Failed to load mechanics
            </p>
          ) : (
            <>
              {filteredMechanics.map((mech) => (
                <div
                  key={mech.mechanicId}
                  onClick={() => setSelectedMechanicId(mech.mechanicId)}
                  className={`
                    p-2 rounded-md cursor-pointer text-sm transition flex justify-between items-center
                    ${
                      selectedMechanicId === mech.mechanicId
                        ? "bg-blue-50 dark:bg-blue-900/40 border border-blue-600"
                        : "border border-gray-200 dark:border-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-800"
                    }
                  `}
                >
                  <span>{mech.name}</span>
                  <span className="text-[10px] text-gray-400">ID: {mech.mechanicId}</span>
                </div>
              ))}

              {filteredMechanics.length === 0 && (
                <p className="text-center text-gray-500 dark:text-neutral-400 text-xs py-2">
                  No mechanic found
                </p>
              )}
            </>
          )}
        </div>

        <p className="text-[11px] text-gray-500 dark:text-neutral-400">
          Status will update to <strong>Ongoing</strong> after assigning.
        </p>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-2">
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DialogClose>
          <Button
            size="sm"
            disabled={!selectedMechanicId || isPending}
            onClick={async () => {
              await onAssign(selectedMechanicId);
              setOpen(false); // Close dialog after assignment call
            }}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {isPending ? "Assigning..." : "Assign Mechanic"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
