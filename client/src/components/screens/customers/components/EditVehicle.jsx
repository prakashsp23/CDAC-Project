import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil } from "lucide-react";
import { useUpdateVehicleMutation } from "@/query/queries/vehicleQueries";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const currentYear = new Date().getFullYear();

const vehicleSchema = z.object({
  brand: z.string().min(1, "Brand is required").max(50, "Too long"),
  model: z.string().min(1, "Model is required").max(50, "Too long"),
  registration: z
    .string()
    .min(1, "Registration is required")
    .min(6, "Must be at least 6 characters")
    .max(15, "Must be less than 15 characters")
    .transform(val => val.toUpperCase()),
  year: z.string()
    .min(1, "Year is required")
    .regex(/^\d{4}$/, "Enter a valid year")
    .refine((val) => {
      const year = parseInt(val);
      return year >= 1900 && year <= currentYear + 1;
    }, `Must be between 1900 and ${currentYear + 1}`),
});

export default function EditVehicle({ vehicle, children }) {
  const [open, setOpen] = useState(false);
  const updateVehicleMutation = useUpdateVehicleMutation();

  const form = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      brand: "",
      model: "",
      registration: "",
      year: "",
    },
  });

  // Reset form with vehicle data when dialog opens
  useEffect(() => {
    if (open && vehicle) {
      form.reset({
        brand: vehicle.brand,
        model: vehicle.model,
        registration: vehicle.registration,
        year: String(vehicle.year),
      });
    }
  }, [open, vehicle, form]);

  const onSubmit = (data) => {
    updateVehicleMutation.mutate({
      carId: vehicle.id,
      data: {
        brand: data.brand,
        model: data.model,
        regNumber: data.registration,
        year: parseInt(data.year)
      }
    }, {
      onSuccess: () => {
        setOpen(false);
      }
    });
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
          <DialogDescription>
            Update the details of your vehicle
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Toyota" 
                      {...field}
                      disabled={updateVehicleMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Camry" 
                      {...field}
                      disabled={updateVehicleMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="registration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ABC123" 
                      {...field}
                      disabled={updateVehicleMutation.isPending}
                      className="uppercase"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="2024" 
                      type="number"
                      {...field}
                      disabled={updateVehicleMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={updateVehicleMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={updateVehicleMutation.isPending}
              >
                {updateVehicleMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Vehicle"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
