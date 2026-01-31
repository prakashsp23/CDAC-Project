import React, { useState } from "react";
import { X, Package } from "lucide-react";
import { Button } from "../../../ui/button";

export default function UpdateServiceModal({ job, isOpen, onClose, onUpdate }) {
  if (!isOpen || !job) return null;

  const [status, setStatus] = useState(job.status);
  const [selectedParts, setSelectedParts] = useState([]);

  // Demo parts data - replace with actual data from API when ready
  const availableParts = [
    { id: 1, name: "Engine Oil (5L)", cost: 45.00, stockQuantity: 25 },
    { id: 2, name: "Oil Filter", cost: 12.50, stockQuantity: 50 },
    { id: 3, name: "Spark Plugs", cost: 8.75, stockQuantity: 100 },
    { id: 4, name: "Air Filter", cost: 15.00, stockQuantity: 45 },
    { id: 5, name: "Brake Pads", cost: 35.00, stockQuantity: 30 },
    { id: 6, name: "Battery", cost: 85.00, stockQuantity: 15 },
  ];

  const handleAddPart = (partId) => {
    const part = availableParts.find(p => p.id === partId);
    if (part && !selectedParts.find(p => p.id === part.id)) {
      setSelectedParts([...selectedParts, { ...part, quantity: 1 }]);
    }
  };

  const handleRemovePart = (partId) => {
    setSelectedParts(selectedParts.filter(p => p.id !== partId));
  };

  const handleQuantityChange = (partId, quantity) => {
    if (quantity > 0) {
      setSelectedParts(selectedParts.map(p =>
        p.id === partId ? { ...p, quantity } : p
      ));
    }
  };

  const partsTotalCost = selectedParts.reduce((sum, part) => sum + (part.cost * part.quantity), 0);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-card text-card-foreground w-full max-w-2xl rounded-xl shadow-lg p-6 relative my-8">

        <button className="absolute right-4 top-4" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Update Service Progress</h2>

        {/* Job Details */}
        <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-lg mb-4">
          <div>
            <p className="text-xs text-gray-500">Job ID</p>
            <p className="font-semibold">{job.id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Customer</p>
            <p className="font-semibold">{job.customer}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Vehicle</p>
            <p className="font-semibold">{job.car}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Plate Number</p>
            <span className="py-1 bg-muted-200 rounded text-sm">
              {job.plate}
            </span>
          </div>
        </div>

        {/* Service Requested */}
        <p className="text-xs text-gray-500 mb-1">Service Requested</p>
        <input
          value={job.service}
          readOnly
          className="w-full border bg-muted/50 rounded-lg px-3 py-2 mb-4"
        />

        {/* Job Status */}
        <p className="text-xs text-gray-500 mb-1">Update Job Status</p>
        <select
          className="w-full border rounded-lg px-3 py-2 mb-4 bg-muted/50"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        {/* Parts Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Parts Used</h3>
          </div>

          {/* Add Parts Dropdown */}
          <div className="mb-4">
            <label className="text-xs text-gray-500 mb-1 block">Add Part</label>
            <select
              className="w-full border rounded-lg px-3 py-2 bg-muted/50"
              onChange={(e) => {
                if (e.target.value) {
                  handleAddPart(Number(e.target.value));
                  e.target.value = "";
                }
              }}
            >
              <option value="">-- Select a part --</option>
              {availableParts.map(part => (
                <option key={part.id} value={part.id}>
                  {part.name} - ${part.cost.toFixed(2)} (Stock: {part.stockQuantity})
                </option>
              ))}
            </select>
          </div>

          {/* Selected Parts Table */}
          {selectedParts.length > 0 ? (
            <div className="overflow-x-auto border rounded-lg mb-3">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="text-left p-3 font-semibold">Part Name</th>
                    <th className="text-center p-3 font-semibold">Stock</th>
                    <th className="text-center p-3 font-semibold">Qty</th>
                    <th className="text-right p-3 font-semibold">Unit Cost</th>
                    <th className="text-right p-3 font-semibold">Total</th>
                    <th className="text-center p-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedParts.map((part) => (
                    <tr key={part.id} className="border-b hover:bg-muted/20 transition">
                      <td className="p-3">{part.name}</td>
                      <td className="p-3 text-center text-muted-foreground">{part.stockQuantity}</td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          min="1"
                          value={part.quantity}
                          onChange={(e) => handleQuantityChange(part.id, Number(e.target.value))}
                          className="w-12 px-2 py-1 border rounded text-center bg-muted/50"
                        />
                      </td>
                      <td className="p-3 text-right">${part.cost.toFixed(2)}</td>
                      <td className="p-3 text-right font-medium">
                        ${(part.cost * part.quantity).toFixed(2)}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleRemovePart(part.id)}
                          className="text-red-500 hover:text-red-700 font-medium"
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
            <div className="bg-muted/50 p-4 rounded-lg text-center text-muted-foreground mb-3">
              <p>No parts added yet</p>
            </div>
          )}

          {selectedParts.length > 0 && (
            <div className="flex justify-end bg-muted/20 p-3 rounded-lg">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total Parts Cost</p>
                <p className="text-lg font-bold">${partsTotalCost.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>

          <Button
            onClick={() => {
              const updated = {
                ...job,
                status: status,
                parts: selectedParts,
              };
              onUpdate(updated);
              onClose();
            }}
          >
            Update Service
          </Button>
        </div>
      </div>
    </div>
  );
}
