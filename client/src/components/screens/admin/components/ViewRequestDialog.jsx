import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, CarFront, Wrench, Clock, FileText } from "lucide-react";

export default function ViewRequestDialog({ request }) {
  if (!request) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          max-w-md p-3 max-h-[75vh] overflow-y-auto rounded-xl
          bg-white dark:bg-neutral-900
          border border-gray-300 dark:border-neutral-800
          text-gray-900 dark:text-neutral-200
        "
      >
        <DialogHeader className="mb-2 flex flex-row items-center gap-2">
          <CarFront className="w-4 h-4 text-blue-600" />
          <DialogTitle className="text-lg font-semibold">
            Request Details
          </DialogTitle>
        </DialogHeader>

        {/* Header Info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-neutral-400">
              Request ID
            </p>
            <p className="font-medium">{request.id}</p>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {request.status}
            </Badge>
            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
              Medium
            </Badge>
          </div>
        </div>

        <Separator className="my-2 dark:bg-neutral-800" />

        {/* Customer Info */}
        <section className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-3 h-3" />
            <h3 className="font-semibold text-sm">Customer Information</h3>
          </div>

          <div className="p-3 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/70">
            <p className="text-[10px] text-gray-500 dark:text-neutral-400">
              Name
            </p>
            <p className="text-sm font-medium">{request.customer}</p>
          </div>
        </section>

        {/* Vehicle Info */}
        <section className="mt-3 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 mb-2">
            <CarFront className="w-3 h-3" />
            <h3 className="font-semibold text-sm">Vehicle Information</h3>
          </div>

          <div className="p-3 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/70">
            <p className="text-[10px] text-gray-500 dark:text-neutral-400">
              Car Model
            </p>
            <p className="text-sm font-medium">{request.model}</p>
          </div>
        </section>

        {/* Service Details */}
        <section className="mt-3">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-3 h-3" />
            <h3 className="font-semibold text-sm">Service Details</h3>
          </div>

          <div className="p-3 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/70 space-y-2">
            <div>
              <p className="text-[10px] text-gray-500 dark:text-neutral-400">
                Issue Type
              </p>
              <p className="text-sm font-medium">{request.issue}</p>
            </div>

            <div>
              <p className="text-[10px] text-gray-500 dark:text-neutral-400">
                Description
              </p>
              <p className="text-sm font-medium">
                Annual service check required.
              </p>
            </div>
          </div>
        </section>

        {/* Assignment */}
        <section className="mt-3">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="w-3 h-3" />
            <h3 className="font-semibold text-sm">Assignment Details</h3>
          </div>

          <div className="p-3 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/70 space-y-2">
            <div>
              <p className="text-[10px] text-gray-500 dark:text-neutral-400">
                Assigned Mechanic
              </p>
              <p className="text-sm font-medium">{request.mechanic}</p>
            </div>

            <div>
              <p className="text-[10px] text-gray-500 dark:text-neutral-400">
                Date Assigned
              </p>
              <p className="text-sm font-medium">{request.date}</p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="mt-3">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-3 h-3" />
            <h3 className="font-semibold text-sm">Timeline</h3>
          </div>

          <div className="p-3 rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/70">
            <p className="text-[10px] text-gray-500 dark:text-neutral-400">
              Request Created
            </p>
            <p className="text-sm font-medium">{request.date} • 09:00 AM</p>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}
