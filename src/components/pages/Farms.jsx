import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import FarmCard from "@/components/organisms/FarmCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { toast } from "react-toastify";

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    size: "",
    sizeUnit: "acres"
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [farmsData, cropsData] = await Promise.all([
        farmService.getAll(),
        cropService.getAll()
      ]);
      setFarms(farmsData);
      setCrops(cropsData);
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
      if (editingFarm) {
        await farmService.update(editingFarm.Id, {
          ...formData,
          size: parseFloat(formData.size)
        });
        toast.success("Farm updated successfully!");
      } else {
        await farmService.create({
          ...formData,
          size: parseFloat(formData.size)
        });
        toast.success("Farm created successfully!");
      }
      resetForm();
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

const handleEdit = (farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.Name,
      location: farm.location_c,
      size: farm.size_c.toString(),
      sizeUnit: farm.size_unit_c
    });
    setShowForm(true);
  };

  const handleDelete = async (farmId) => {
    if (!window.confirm("Are you sure you want to delete this farm?")) return;
    
    try {
      await farmService.delete(farmId);
      toast.success("Farm deleted successfully!");
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      size: "",
      sizeUnit: "acres"
    });
    setEditingFarm(null);
    setShowForm(false);
  };

const getCropsCount = (farmId) => {
    return crops.filter(crop => crop.farm_id_c === farmId).length;
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            Farm Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your farm locations and properties
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Farm
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold font-display">
                {editingFarm ? "Edit Farm" : "Add New Farm"}
              </h2>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Farm Name"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter farm name"
                required
              />

              <FormField
                label="Location"
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter farm location"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Size"
                  id="size"
                  type="number"
                  step="0.1"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="0.0"
                  required
                />

                <FormField
                  label="Unit"
                  id="sizeUnit"
                  type="select"
                  value={formData.sizeUnit}
                  onChange={(e) => setFormData({ ...formData, sizeUnit: e.target.value })}
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                  <option value="square feet">Square Feet</option>
                </FormField>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button type="button" variant="ghost" onClick={resetForm} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingFarm ? "Update Farm" : "Create Farm"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Farms Grid */}
      {farms.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {farms.map((farm) => (
            <FarmCard
              key={farm.Id}
              farm={farm}
              cropsCount={getCropsCount(farm.Id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      ) : (
        <Empty
          title="No farms found"
          message="Create your first farm to get started with crop management."
          actionLabel="Add Farm"
          onAction={() => setShowForm(true)}
          icon="MapPin"
        />
      )}
    </div>
  );
};

export default Farms;