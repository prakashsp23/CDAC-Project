import React, { useState, useMemo } from "react";
import { useGetAllParts, useCreatePartMutation, useUpdatePartMutation, useDeletePartMutation } from "@/query/queries/partQueries";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export default function PartsManagement() {
    const [filter, setFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // React Query Hooks
    const { data: response, isLoading, isError } = useGetAllParts();

    // DEBUG: Log raw response to debug data issues
    if (response) {
        console.log("Parts Management - Backend Response:", response);
    }

    const createMutation = useCreatePartMutation();
    const updateMutation = useUpdatePartMutation();
    const deleteMutation = useDeletePartMutation();

    // Map Backend Data
    const parts = useMemo(() => {
        const rawParts = response?.data || [];
        return rawParts.map(part => ({
            id: String(part.id), // Ensure ID is string for search
            name: part.partName || part.name || "N/A", // Handle DTO change (partName)
            description: part.description || "",
            price: part.unitPrice != null ? part.unitPrice : (part.price || 0), // Handle DTO change (unitPrice)
            stock: part.stockQuantity != null ? part.stockQuantity : (part.stock || 0), // Handle DTO change (stockQuantity)
            // Derive status
            status: part.status || ((part.stockQuantity || part.stock) > 0 ? "In Stock" : "Out of Stock")
        }));
    }, [response]);

    // Modal State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPart, setEditingPart] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
    });

    // Handle Opening Modal for Add
    const handleAddClick = () => {
        setEditingPart(null);
        setFormData({
            name: "",
            description: "",
            price: "",
            stock: "",
        });
        setIsDialogOpen(true);
    };

    // Handle Opening Modal for Edit
    const handleEditClick = (part) => {
        setEditingPart(part);
        setFormData({
            name: part.name,
            description: part.description || "",
            price: part.price,
            stock: part.stock,
        });
        setIsDialogOpen(true);
    };

    const handleSave = () => {
        const payload = {
            partName: formData.name, // Map to backend DTO
            description: formData.description,
            unitPrice: parseFloat(formData.price), // Map to backend DTO
            stockQuantity: parseInt(formData.stock) // Map to backend DTO
        };

        if (editingPart) {
            updateMutation.mutate({
                id: parseInt(editingPart.id), // Ensure ID is backend-friendly (number)
                partData: payload
            }, {
                onSuccess: () => setIsDialogOpen(false)
            });
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => setIsDialogOpen(false)
            });
        }
    };

    const handleDelete = (id) => {
        deleteMutation.mutate(parseInt(id)); // Ensure ID is backend-friendly (number)
    };

    const filteredParts = useMemo(() => {
        return parts.filter(part => {
            const matchesStatus = filter === "All" || part.status === filter;
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                (part.name || "").toLowerCase().includes(searchLower) ||
                (part.description || "").toLowerCase().includes(searchLower) ||
                String(part.id).toLowerCase().includes(searchLower);

            return matchesStatus && matchesSearch;
        });
    }, [parts, filter, searchQuery]);

    // Summary Metrics
    const totalParts = useMemo(() => parts.length, [parts]);
    const outOfStock = useMemo(() => parts.filter(p => p.status === "Out of Stock").length, [parts]);
    const inventoryValue = useMemo(() => parts.reduce((acc, curr) => acc + (curr.price * curr.stock), 0), [parts]);

    const getStatusVariant = (status) => {
        switch (status) {
            case "In Stock": return "default";
            case "Out of Stock": return "destructive";
            default: return "secondary"; // Fallback
        }
    };

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
                Failed to load parts. Please try again.
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
                    <h2 className="text-2xl font-bold tracking-tight">Parts Management</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Manage spare parts inventory
                    </p>
                </div>
                <Button onClick={handleAddClick}>+ Add Part</Button>
            </div>

            {/* SEARCH BAR */}
            <div className="max-w-md">
                <Input
                    placeholder="Search by name, ID, or description"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white dark:bg-neutral-800"
                />
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-4">
                <div className={cardStyles} onClick={() => setFilter("All")}>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300">Total Parts</p>
                    <p className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-100">{totalParts}</p>
                </div>
                <div className={cardStyles} onClick={() => setFilter("Out of Stock")}>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300">Out of Stock</p>
                    <p className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-100">{outOfStock}</p>
                </div>
                <div className={cardStyles}>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300">Inventory Value</p>
                    <p className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-100">₹{inventoryValue.toLocaleString()}</p>
                </div>
            </div>

            {/* PARTS TABLE */}
            <div className="rounded-xl border border-neutral-300 dark:border-neutral-700 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="dark:border-neutral-700">
                            <TableHead>Part ID</TableHead>
                            <TableHead>Part Name</TableHead>
                            <TableHead>Unit Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredParts.length > 0 ? (
                            filteredParts.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                                >
                                    <TableCell className="font-medium">{row.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{row.name}</span>
                                            <span className="text-xs text-neutral-500">{row.description}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>₹{row.price}</TableCell>
                                    <TableCell>{row.stock}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(row.status)}>
                                            {row.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEditClick(row)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(row.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-neutral-500">
                                    No parts found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ADD / EDIT DIALOG */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingPart ? "Edit Part" : "Add New Part"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Desc</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="stock" className="text-right">Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                            {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
