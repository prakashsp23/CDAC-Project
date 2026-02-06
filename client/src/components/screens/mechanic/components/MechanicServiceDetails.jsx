import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Calendar,
    User,
    Car,
    FileText,
    AlertCircle,
    Package,
    Save,
    Clock
} from "lucide-react";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Separator } from "../../../ui/separator";
import { useGetServiceById } from "../../../../query/queries/serviceQueries";
import { useGetAllParts } from "../../../../query/queries/partQueries";
import {
    useUpdateServiceExecutionMutation,
    useAddMechanicNoteMutation
} from "../../../../query/queries/mechanicQueries";
import { format } from "date-fns";

export default function MechanicServiceDetails() {
    const { serviceId } = useParams();
    const navigate = useNavigate();

    // State
    const [status, setStatus] = useState("");
    const [notes, setNotes] = useState("");
    const [selectedParts, setSelectedParts] = useState([]);

    // Queries
    const { data: serviceResponse, isLoading: isLoadingService, error: serviceError } = useGetServiceById(serviceId);
    const { data: partsDataResponse } = useGetAllParts();

    const service = serviceResponse?.data;
    const partsData = partsDataResponse?.data;
    // Mutations
    const updateMutation = useUpdateServiceExecutionMutation();
    const addNoteMutation = useAddMechanicNoteMutation();

    const availableParts = partsData || [];

    // Initialize state when data loads
    useEffect(() => {
        if (service) {
            setStatus(service.status);
            setNotes(service.mechanicNotes || "");

        }
    }, [service]);

    if (isLoadingService) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary/60 mb-3"></div>
                <span className="text-lg text-muted-foreground">Loading service details...</span>
            </div>
        );
    }
    if (serviceError) return <div className="p-8 text-center text-red-500">Error loading service details</div>;
    if (!service) return <div className="p-8 text-center">Service not found</div>;

    // Parts Logic
    const handleAddPart = (partId) => {
        const part = availableParts.find(p => p.id === partId);
        if (!part) return;

        const existingPart = selectedParts.find(p => p.id === partId);

        if (existingPart) {
            // If already in list, update quantity
            if (existingPart.quantity < part.stockQuantity) {
                setSelectedParts(selectedParts.map(p =>
                    p.id === partId ? { ...p, quantity: p.quantity + 1 } : p
                ));
            } else {
                // Optional: Notify user about stock limit
                // toast.error(`Max stock reached for ${part.partName}`);
            }
        } else {
            // Add new
            setSelectedParts([...selectedParts, { ...part, quantity: 1 }]);
        }
    };

    const handleRemovePart = (partId) => {
        setSelectedParts(selectedParts.filter(p => p.id !== partId));
    };

    const handleQuantityChange = (partId, quantity) => {
        const part = availableParts.find(p => p.id === partId);
        if (quantity > 0 && part && quantity <= part.stockQuantity) {
            setSelectedParts(selectedParts.map(p =>
                p.id === partId ? { ...p, quantity } : p
            ));
        }
    };

    const newPartsTotal = selectedParts.reduce((sum, part) => sum + (part.unitPrice * part.quantity), 0);

    // Update Handlers
    const handleUpdateService = () => {
        const payload = {
            serviceId: service.id,
            executionData: {
                status: status,
                parts: selectedParts.map(p => ({
                    id: p.id,
                    quantity: p.quantity
                }))
            }
        };

        updateMutation.mutate(payload, {
            onSuccess: () => {
                setSelectedParts([]); // Clear added parts on success
            }
        });
    };

    const handleSaveNote = () => {
        if (!notes.trim()) return;
        addNoteMutation.mutate({
            serviceId: service.id,
            noteData: notes
        });
    };

    return (
        <div className="container mx-auto py-6 max-w-5xl space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/mechanic/assigned-jobs")}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Service Details</h1>
                    <p className="text-muted-foreground flex items-center gap-2 text-sm">
                        Service ID: #{service.id}
                        <span className="mx-1">•</span>
                        <Calendar className="w-3 h-3" /> {service.createdOn ? format(new Date(service.createdOn), 'PPP') : 'N/A'}
                    </p>
                </div>
                <div className="ml-auto">
                    <Badge className={`text-sm px-3 py-1 ${status === 'COMPLETED' ? 'bg-green-500' : 'bg-blue-500'
                        }`}>
                        {status || service.status}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* LEFT COLUMN: Service Info & Customer */}
                <div className="space-y-6">
                    {/* Service Info */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-md font-medium flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" /> Service Request
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3">
                            <div>
                                <p className="text-muted-foreground text-xs">Service Type</p>
                                <p className="font-semibold">{service.catalog?.serviceName}</p>
                                <p className="text-muted-foreground">{service.catalog?.description}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-muted-foreground text-xs">Customer Issue / Notes</p>
                                <p className="italic text-muted-foreground">"{service.customerNotes || "No notes provided"}"</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vehicle & Customer */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-md font-medium flex items-center gap-2">
                                <Car className="w-4 h-4 text-primary" /> Vehicle & Customer
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-muted p-2 rounded-full">
                                    <Car className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-semibold">{service.vehicle?.brand} {service.vehicle?.model}</p>
                                    <Badge variant="outline" className="mt-1">{service.vehicle?.licenseNumber}</Badge>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <div className="bg-muted p-2 rounded-full">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-semibold">{service.customer?.name}</p>
                                    <p className="text-muted-foreground">{service.customer?.email}</p>
                                    <p className="text-muted-foreground">{service.customer?.phone}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>


                {/* RIGHT COLUMN: Execution & Parts & Notes */}
                <div className="md:col-span-2 space-y-6">

                    {/* Service Management (Status + Parts) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Service Management</CardTitle>
                            <CardDescription>Update status and manage parts</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Status Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold">Service Status</h3>
                                <div className="flex gap-4 items-center">
                                    <select
                                        className="flex-1 border rounded-lg px-3 py-2 bg-background"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="ONGOING">Ongoing</option>
                                        <option value="COMPLETED">Completed</option>
                                    </select>
                                    <Button onClick={handleUpdateService} disabled={updateMutation.isPending}>
                                        {updateMutation.isPending ? "Updating..." : "Update Status & Parts"}
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            {/* Parts Section */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <Package className="w-5 h-5 text-muted-foreground" />
                                    <h3 className="text-sm font-semibold">Parts Management</h3>
                                </div>

                                {/* Previously Used Parts */}
                                {service.usedParts && service.usedParts.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            Previously Used Parts
                                        </h4>
                                        <div className="border rounded-lg overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead className="bg-muted/50 border-b">
                                                    <tr>
                                                        <th className="text-left p-3 font-medium">Part Name</th>
                                                        <th className="text-center p-3 font-medium">Qty</th>
                                                        <th className="text-right p-3 font-medium">Unit Price</th>
                                                        <th className="text-right p-3 font-medium">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {service.usedParts.map((part) => (
                                                        <tr key={part.id} className="bg-muted/10">
                                                            <td className="p-3">{part.partName}</td>
                                                            <td className="p-3 text-center">{part.quantity}</td>
                                                            <td className="p-3 text-right">₹{part.priceAtTime?.toFixed(2)}</td>
                                                            <td className="p-3 text-right">₹{part.totalCost?.toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-muted/50 border-t font-medium">
                                                    <tr>
                                                        <td colSpan="3" className="p-3 text-right">Total Used:</td>
                                                        <td className="p-3 text-right">
                                                            ₹{service.usedParts.reduce((sum, p) => sum + p.totalCost, 0).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Add New Parts */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex justify-between items-center">
                                        Add New Parts
                                        {newPartsTotal > 0 && (
                                            <span className="text-primary normal-case">Total: ₹{newPartsTotal.toFixed(2)}</span>
                                        )}
                                    </h4>

                                    <div className="flex gap-4">
                                        <select
                                            className="flex-1 border rounded-lg px-3 py-2 text-sm bg-background"
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    handleAddPart(Number(e.target.value));
                                                    e.target.value = "";
                                                }
                                            }}
                                        >
                                            <option value="">Select a part to add...</option>
                                            {availableParts.map(part => (
                                                <option key={part.id} value={part.id} disabled={part.stockQuantity <= 0}>
                                                    {part.partName} - ₹{part.unitPrice?.toFixed(2)} ({part.stockQuantity > 0 ? `${part.stockQuantity} in stock` : 'Out of Stock'})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedParts.length > 0 ? (
                                        <div className="border rounded-lg overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead className="bg-muted/30 border-b">
                                                    <tr>
                                                        <th className="text-left p-2 font-medium">Part Name</th>
                                                        <th className="text-center p-2 font-medium">Qty</th>
                                                        <th className="text-right p-2 font-medium">Cost</th>
                                                        <th className="text-center p-2 font-medium">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {selectedParts.map((part) => (
                                                        <tr key={part.id}>
                                                            <td className="p-2">{part.partName}</td>
                                                            <td className="p-2 text-center">
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    max={part.stockQuantity}
                                                                    value={part.quantity}
                                                                    onChange={(e) => handleQuantityChange(part.id, Number(e.target.value))}
                                                                    className="w-16 px-2 py-1 border rounded text-center text-xs"
                                                                />
                                                            </td>
                                                            <td className="p-2 text-right">₹{(part.unitPrice * part.quantity).toFixed(2)}</td>
                                                            <td className="p-2 text-center">
                                                                <button
                                                                    onClick={() => handleRemovePart(part.id)}
                                                                    className="text-red-500 hover:text-red-700 text-xs font-medium"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 border-2 border-dashed rounded-lg bg-muted/20">
                                            <p className="text-sm text-muted-foreground">Select parts above to add them to this service</p>
                                        </div>
                                    )}

                                    <div className="bg-muted/30 p-3 rounded-lg flex items-start gap-2 text-xs text-muted-foreground">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <p>
                                            Parts are deducted from inventory immediately upon saving.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    {/* Mechanic Notes Section - Now Separate */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">My Notes</CardTitle>
                            <CardDescription>Private notes primarily for your reference</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <textarea
                                className="w-full min-h-[120px] border rounded-lg p-3 text-sm bg-muted/30 focus:bg-background transition-colors"
                                placeholder="Write your observation logic or work notes here..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <Button onClick={handleSaveNote} disabled={addNoteMutation.isPending} size="sm">
                                    <Save className="w-4 h-4 mr-2" />
                                    {addNoteMutation.isPending ? "Saving..." : "Save Note"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
