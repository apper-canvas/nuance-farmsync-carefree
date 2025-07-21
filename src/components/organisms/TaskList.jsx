import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const TaskList = ({ tasks, farms, crops, onComplete, onEdit, onDelete }) => {
  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId);
    return farm ? farm.name : "Unknown Farm";
  };

  const getCropName = (cropId) => {
    const crop = crops.find(c => c.Id === cropId);
    return crop ? crop.cropType : "General Task";
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  return (
    <div className="space-y-3">
      {sortedTasks.map((task, index) => (
        <motion.div
          key={task.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`card p-4 ${task.completed ? "opacity-75 bg-gray-50" : ""}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className="flex items-center pt-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => !task.completed && onComplete(task.Id)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                    {task.title}
                  </h4>
                  <StatusBadge status={task.priority} type="priority" />
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <ApperIcon name="MapPin" className="w-3 h-3 mr-1" />
                    {getFarmName(task.farmId)}
                  </span>
                  <span className="flex items-center">
                    <ApperIcon name="Wheat" className="w-3 h-3 mr-1" />
                    {getCropName(task.cropId)}
                  </span>
<span className="flex items-center">
                    <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                    {task.due_date_c ? (
                      `Due ${format(new Date(task.due_date_c), "MMM d, yyyy")}`
                    ) : (
                      "No due date"
                    )}
                  </span>
                </div>
              </div>
            </div>
            
            {!task.completed && (
              <div className="flex space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(task)}
                >
                  <ApperIcon name="Edit2" className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task.Id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TaskList;