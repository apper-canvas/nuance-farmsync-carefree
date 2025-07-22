import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import TaskList from "@/components/organisms/TaskList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { toast } from "react-toastify";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [formData, setFormData] = useState({
    farmId: "",
    cropId: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium"
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [tasksData, farmsData, cropsData] = await Promise.all([
        taskService.getAll(),
        farmService.getAll(),
        cropService.getAll()
      ]);
      setTasks(tasksData);
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
      if (editingTask) {
        await taskService.update(editingTask.Id, formData);
        toast.success("Task updated successfully!");
      } else {
        await taskService.create(formData);
        toast.success("Task created successfully!");
      }
      resetForm();
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleComplete = async (taskId) => {
    try {
      await taskService.complete(taskId);
      toast.success("Task completed!");
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (task) => {
setEditingTask(task);
    setFormData({
      farmId: task.farm_id_c.toString(),
      cropId: task.crop_id_c ? task.crop_id_c.toString() : "",
      title: task.title_c,
      description: task.description_c,
      dueDate: task.due_date_c,
      priority: task.priority_c
    });
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await taskService.delete(taskId);
      toast.success("Task deleted successfully!");
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      farmId: "",
      cropId: "",
      title: "",
      description: "",
      dueDate: "",
      priority: "Medium"
    });
    setEditingTask(null);
    setShowForm(false);
  };

const filteredTasks = tasks.filter(task => {
    if (filterStatus === "pending") return !task.completed_c;
    if (filterStatus === "completed") return task.completed_c;
    return true;
  });

const farmCrops = crops.filter(crop => 
    formData.farmId ? crop.farm_id_c === parseInt(formData.farmId) : false
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            Task Management
          </h1>
          <p className="text-gray-600 mt-1">
            Schedule and track farming activities
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} disabled={farms.length === 0}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {farms.length === 0 && (
        <div className="card p-6 bg-yellow-50 border border-yellow-200">
          <div className="flex items-center">
            <ApperIcon name="AlertTriangle" className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="font-medium text-yellow-800">No farms available</p>
              <p className="text-sm text-yellow-700">Create a farm first before adding tasks.</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="text-sm text-gray-600">
          {filteredTasks.length} tasks
        </div>
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
            className="bg-white rounded-xl p-6 w-full max-w-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold font-display">
                {editingTask ? "Edit Task" : "Add New Task"}
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
                onChange={(e) => setFormData({ ...formData, farmId: e.target.value, cropId: "" })}
                required
              >
                <option value="">Select a farm</option>
                {farms.map((farm) => (
<option key={farm.Id} value={farm.Id}>
                    {farm.Name}
                  </option>
                ))}
              </FormField>

              <FormField
                label="Crop (Optional)"
                id="cropId"
                type="select"
                value={formData.cropId}
                onChange={(e) => setFormData({ ...formData, cropId: e.target.value })}
              >
                <option value="">General task</option>
{farmCrops.map((crop) => (
                  <option key={crop.Id} value={crop.Id}>
                    {crop.crop_type_c} - {crop.location_c}
                  </option>
                ))}
              </FormField>

              <FormField
                label="Task Title"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Water tomato plants"
                required
              />

              <FormField
                label="Description"
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed task description"
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Due Date"
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />

                <FormField
                  label="Priority"
                  id="priority"
                  type="select"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </FormField>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button type="button" variant="ghost" onClick={resetForm} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingTask ? "Update Task" : "Create Task"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Tasks List */}
      {filteredTasks.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TaskList
            tasks={filteredTasks}
            farms={farms}
            crops={crops}
            onComplete={handleComplete}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </motion.div>
      ) : (
        <Empty
          title="No tasks found"
          message="Create your first task to start organizing farm activities."
          actionLabel="Add Task"
          onAction={() => setShowForm(true)}
          icon="CheckSquare"
        />
      )}
    </div>
  );
};

export default Tasks;