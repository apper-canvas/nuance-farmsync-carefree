import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { weatherService } from "@/services/api/weatherService";
import { farmService } from "@/services/api/farmService";
import { format } from "date-fns";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [farms, setFarms] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFarms = async () => {
    try {
      const farmsData = await farmService.getAll();
      setFarms(farmsData);
      if (farmsData.length > 0 && !selectedLocation) {
        setSelectedLocation(farmsData[0].location);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const loadWeather = async (location) => {
    if (!location) return;
    
    try {
      setLoading(true);
      setError("");
      const weatherData = await weatherService.getWeatherByLocation(location);
      setWeather(weatherData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      loadWeather(selectedLocation);
    }
  }, [selectedLocation]);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    setCustomLocation("");
  };

  const handleCustomLocationSubmit = (e) => {
    e.preventDefault();
    if (customLocation.trim()) {
      setSelectedLocation(customLocation.trim());
    }
  };

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

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case "sunny":
        return "from-yellow-400 to-orange-500";
      case "partly cloudy":
        return "from-blue-400 to-blue-500";
      case "cloudy":
        return "from-gray-400 to-gray-500";
      case "rain":
        return "from-blue-500 to-blue-600";
      case "thunderstorms":
        return "from-purple-500 to-purple-600";
      default:
        return "from-blue-400 to-blue-500";
    }
  };

  if (farms.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            Weather Forecast
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor weather conditions for your farm locations
          </p>
        </div>

        <div className="card p-6 bg-yellow-50 border border-yellow-200">
          <div className="flex items-center">
            <ApperIcon name="AlertTriangle" className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="font-medium text-yellow-800">No farms available</p>
              <p className="text-sm text-yellow-700">Create a farm first to see weather data for your locations.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-display">
          Weather Forecast
        </h1>
        <p className="text-gray-600 mt-1">
          Monitor weather conditions for your farm locations
        </p>
      </div>

      {/* Location Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <FormField
              label="Select Farm Location"
              id="farmLocation"
              type="select"
              value={selectedLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
            >
              <option value="">Choose a farm</option>
              {farms.map((farm) => (
                <option key={farm.Id} value={farm.location}>
                  {farm.name} - {farm.location}
                </option>
              ))}
            </FormField>
          </div>
          
          <div className="flex-1">
            <form onSubmit={handleCustomLocationSubmit} className="flex gap-2">
              <div className="flex-1">
                <FormField
                  label="Or Enter Custom Location"
                  id="customLocation"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="Enter city, state"
                />
              </div>
              <div className="self-end">
                <Button type="submit" disabled={!customLocation.trim()}>
                  <ApperIcon name="Search" className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>

      {loading && <Loading />}
      
      {error && (
        <Error 
          message={error} 
          onRetry={() => loadWeather(selectedLocation)} 
        />
      )}

      {!loading && !error && weather && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Current Weather */}
          <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 font-display">
                  Current Weather
                </h2>
                <p className="text-gray-600">{weather.location}</p>
              </div>
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getConditionColor(weather.current.condition)} flex items-center justify-center`}>
                <ApperIcon 
                  name={getWeatherIcon(weather.current.condition)} 
                  className="w-8 h-8 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 font-display">
                  {weather.current.temperature}°F
                </p>
                <p className="text-sm text-gray-600">Temperature</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold text-gray-900">
                  {weather.current.feelsLike}°F
                </p>
                <p className="text-sm text-gray-600">Feels Like</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold text-gray-900">
                  {weather.current.humidity}%
                </p>
                <p className="text-sm text-gray-600">Humidity</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold text-gray-900">
                  {weather.current.windSpeed} mph
                </p>
                <p className="text-sm text-gray-600">Wind Speed</p>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-lg font-medium text-gray-700">
                {weather.current.condition}
              </p>
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 font-display mb-6">
              5-Day Forecast
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {weather.forecast.map((day, index) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-4 text-center bg-gradient-to-br from-gray-50 to-gray-100"
                >
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    {index === 0 ? "Today" : format(new Date(day.date), "EEE")}
                  </p>
                  
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${getConditionColor(day.condition)} flex items-center justify-center`}>
                    <ApperIcon 
                      name={getWeatherIcon(day.condition)} 
                      className="w-6 h-6 text-white"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-gray-900">
                      {day.high}°
                    </p>
                    <p className="text-sm text-gray-600">
                      {day.low}°
                    </p>
                    <p className="text-xs text-gray-500">
                      {day.condition}
                    </p>
                  </div>
                  
                  <div className="mt-3 space-y-1 text-xs text-gray-500">
                    <div className="flex items-center justify-center">
                      <ApperIcon name="Droplets" className="w-3 h-3 mr-1" />
                      <span>{day.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <ApperIcon name="Wind" className="w-3 h-3 mr-1" />
                      <span>{day.windSpeed} mph</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Weather;