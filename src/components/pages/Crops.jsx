import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import CropTable from "@/components/organisms/CropTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { cropService } from "@/services/api/cropService";
import { farmService } from "@/services/api/farmService";
import { toast } from "react-toastify";

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [formData, setFormData] = useState({
    farmId: "",
    cropType: "",
    plantingDate: "",
    expectedHarvest: "",
    quantity: "",
    unit: "plants",
    status: "Planted",
    location: ""
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [cropsData, farmsData] = await Promise.all([
        cropService.getAll(),
        farmService.getAll()
      ]);
      setCrops(cropsData);
      setFarms(farmsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCrop) {
        await cropService.update(editingCrop.Id, {
          ...formData,
          quantity: parseFloat(formData.quantity)
        });
        toast.success("Crop updated successfully!");
      } else {
        await cropService.create({
          ...formData,
          quantity: parseFloat(formData.quantity)
        });
        toast.success("Crop added successfully!");
      }
      resetForm();
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setFormData({
      farmId: crop.farmId.toString(),
      cropType: crop.cropType,
      plantingDate: crop.plantingDate,
      expectedHarvest: crop.expectedHarvest,
      quantity: crop.quantity.toString(),
      unit: crop.unit,
      status: crop.status,
      location: crop.location
    });
    setShowForm(true);
  };

  const handleDelete = async (cropId) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) return;
    
    try {
      await cropService.delete(cropId);
      toast.success("Crop deleted successfully!");
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      farmId: "",
      cropType: "",
      plantingDate: "",
      expectedHarvest: "",
      quantity: "",
      unit: "plants",
      status: "Planted",
      location: ""
    });
    setEditingCrop(null);
    setShowForm(false);
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            Crop Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track your planted crops and harvest schedules
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} disabled={farms.length === 0}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Crop
        </Button>
      </div>

      {farms.length === 0 && (
        <div className="card p-6 bg-yellow-50 border border-yellow-200">
          <div className="flex items-center">
            <ApperIcon name="AlertTriangle" className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="font-medium text-yellow-800">No farms available</p>
              <p className="text-sm text-yellow-700">Create a farm first before adding crops.</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 0 }}
            className="bg-white rounded-xl p-6 w-full max-w-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold font-display">
                {editingCrop ? "Edit Crop" : "Add New Crop"}
              </h2>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Farm"
                id="farmId"
                type="select"
                value={formData.farmId}
                onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
                required
              >
                <option value="">Select a farm</option>
                {farms.map((farm) => (
                  <option key={farm.Id} value={farm.Id}>
                    {farm.name}
                  </option>
                ))}
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Crop Type"
                  id="cropType"
                  value={formData.cropType}
                  onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                  placeholder="e.g., Tomatoes, Corn"
                  required
                />

                <FormField
                  label="Location"
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., North Field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Planting Date"
                  id="plantingDate"
                  type="date"
                  value={formData.plantingDate}
                  onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                  required
                />

                <FormField
                  label="Expected Harvest"
                  id="expectedHarvest"
                  type="date"
                  value={formData.expectedHarvest}
                  onChange={(e) => setFormData({ ...formData, expectedHarvest: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Quantity"
                  id="quantity"
                  type="number"
                  step="0.1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0"
                  required
                />

                <FormField
                  label="Unit"
                  id="unit"
                  type="select"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  <option value="plants">Plants</option>
                  <option value="acres">Acres</option>
                  <option value="trees">Trees</option>
                  <option value="rows">Rows</option>
                  <option value="kg">Kilograms</option>
                </FormField>
              </div>

              <FormField
                label="Status"
                id="status"
                type="select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Planted">Planted</option>
                <option value="Growing">Growing</option>
                <option value="Flowering">Flowering</option>
                <option value="Ready">Ready</option>
                <option value="Harvested">Harvested</option>
              </FormField>

              <div className="flex space-x-3 pt-4">
                <Button type="button" variant="ghost" onClick={resetForm} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingCrop ? "Update Crop" : "Add Crop"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Crops Table */}
      {crops.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CropTable
            crops={crops}
            farms={farms}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </motion.div>
      ) : (
        <Empty
          title="No crops found"
          message="Start tracking your crops by adding your first planting."
          actionLabel="Add Crop"
          onAction={() => setShowForm(true)}
          icon="Wheat"
        />
      )}
    </div>
  );
};

export default Crops;