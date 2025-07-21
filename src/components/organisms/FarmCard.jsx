import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FarmCard = ({ farm, cropsCount = 0, onEdit, onDelete }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card p-6 bg-gradient-to-br from-white to-gray-50"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="MapPin" className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              {farm.name}
            </h3>
            <p className="text-sm text-gray-600">{farm.location}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(farm)}
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(farm.Id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-primary-50 rounded-lg">
          <p className="text-2xl font-bold text-primary-600 font-display">
            {farm.size}
          </p>
          <p className="text-xs text-gray-600">{farm.sizeUnit}</p>
        </div>
        <div className="text-center p-3 bg-secondary-50 rounded-lg">
          <p className="text-2xl font-bold text-secondary-600 font-display">
            {cropsCount}
          </p>
          <p className="text-xs text-gray-600">Active Crops</p>
        </div>
      </div>
      
      <div className="flex items-center text-xs text-gray-500">
        <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
        Created {new Date(farm.createdAt).toLocaleDateString()}
      </div>
    </motion.div>
  );
};

export default FarmCard;