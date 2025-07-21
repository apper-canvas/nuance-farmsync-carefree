import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const WeatherCard = ({ weather, className = "" }) => {
  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case "sunny":
        return "Sun";
      case "partly cloudy":
        return "CloudSun";
      case "cloudy":
        return "Cloud";
      case "rain":
        return "CloudRain";
      case "thunderstorms":
        return "Zap";
      default:
        return "Sun";
    }
  };

  if (!weather) {
    return (
      <div className={`card p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`card p-6 bg-gradient-to-br from-blue-50 to-blue-100 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Current Weather</h3>
        <ApperIcon 
          name={getWeatherIcon(weather.current?.condition)} 
          className="w-8 h-8 text-blue-600"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900 font-display">
            {weather.current?.temperature}°F
          </span>
          <span className="text-sm text-gray-600">
            {weather.current?.condition}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <ApperIcon name="Droplets" className="w-4 h-4 mr-1" />
            <span>{weather.current?.humidity}%</span>
          </div>
          <div className="flex items-center">
            <ApperIcon name="Wind" className="w-4 h-4 mr-1" />
            <span>{weather.current?.windSpeed} mph</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;