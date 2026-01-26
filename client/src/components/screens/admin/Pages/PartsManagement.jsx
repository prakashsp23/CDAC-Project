import React, { useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function PartsManagement() {
    const [filter, setFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Updated Mock Data (Simplified Schema)
    const [parts, setParts] = useState([
        {
            id: "PART-001",
            name: "Brake Pad",
            category: "Brake",
            description: "Standard front brake pads",
            price: 1200,
            stock: 25,
            status: "In Stock",
        },
        {
            id: "PART-002",
            name: "Engine Oil",
            category: "Engine",
            description: "Full synthetic 5W-30",
            price: 800,
            stock: 5,
            status: "In Stock", // Changed from Low Stock
        },
        {
            id: "PART-003",
            name: "Air Filter",
            category: "Engine",
            description: "High performance air filter",
            price: 500,
            stock: 0,
            status: "Out of Stock",
        },
        {
            id: "PART-004",
            name: "Spark Plug",
            category: "Ignition",
            description: "Iridium spark plugs",
            price: 300,
            stock: 50,
            status: "In Stock"
        },
        {
            id: "PART-005",
            name: "Battery 45Ah",
            category: "Electrical",
            description: "Maintenance free battery",
            price: 4500,
            stock: 2,
            status: "In Stock" // Changed from Low Stock
        },
    ]);

    // Modal State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPart, setEditingPart] = useState(null);

    // Form State (Simplified)
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        price: "",
        stock: "",
        status: "In Stock",
    });

    // Handle Opening Modal for Add
    const handleAddClick = () => {
        setEditingPart(null);
        setFormData({
            name: "",
            category: "",
            description: "",
            price: "",
            stock: "",
            status: "In Stock",
        });
        setIsDialogOpen(true);
    };

    // Handle Opening Modal for Edit
    const handleEditClick = (part) => {
        setEditingPart(part);
        setFormData({
            name: part.name,
            category: part.category,
            description: part.description || "",
            price: part.price,
            stock: part.stock,
            status: part.status,
        });
        setIsDialogOpen(true);
    };

    const handleSave = () => {
        // Mock save logic (Simplified)
        console.log("Saving part:", formData, "Mode:", editingPart ? "Edit" : "Add");

        if (editingPart) {
            // Mock Update
            setParts(prev => prev.map(p => p.id === editingPart.id ? { ...p, ...formData } : p));
        } else {
            // Mock Create
            const newPart = {
                id: `PART-00${parts.length + 1}`,
                ...formData
            };
            setParts(prev => [...prev, newPart]);
        }

        setIsDialogOpen(false);
    };

    const handleDelete = (id) => {
        // Mock delete
        setParts(prev => prev.filter(p => p.id !== id));
    };

    // Filter Logic
    const filteredParts = parts.filter(part => {
        const matchesStatus = filter === "All" || part.status === filter;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            part.name.toLowerCase().includes(searchLower) ||
            part.description?.toLowerCase().includes(searchLower) ||
            part.id.toLowerCase().includes(searchLower) ||
            part.category.toLowerCase().includes(searchLower);

        return matchesStatus && matchesSearch;
    });

    // Summary Metrics (Simplified)
    const totalParts = parts.length;
    // REMOVED: Low Stock Metric
    const outOfStock = parts.filter(p => p.status === "Out of Stock").length;
    const inventoryValue = parts.reduce((acc, curr) => acc + (curr.price * curr.stock), 0);

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
                        Manage spare parts inventory (Simplified Schema)
                    </p>
                </div>
                <Button onClick={handleAddClick}>+ Add Part</Button>
            </div>

            {/* SEARCH BAR */}
            <div className="max-w-md">
                <Input
                    placeholder="Search by name, ID, category or description"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white dark:bg-neutral-800"
                />
            </div>

            {/* SUMMARY CARDS (Simplified Grid) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-4">
                <div className={cardStyles} onClick={() => setFilter("All")}>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300">Total Parts</p>
                    <p className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-100">{totalParts}</p>
                </div>
                {/* REMOVED: Low Stock Card */}
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
                            <TableHead>Category</TableHead>
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
                                    <TableCell>{row.category}</TableCell>
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
                                <TableCell colSpan={7} className="text-center h-24 text-neutral-500">
                                    No parts found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ADD / EDIT DIALOG (Simplified) */}
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
                            <Label htmlFor="category" className="text-right">Category</Label>
                            <Input
                                id="category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        {/* ADDED: Description Field */}
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
                        {/* ADDED: Status Dropdown */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="In Stock">In Stock</SelectItem>
                                    <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
