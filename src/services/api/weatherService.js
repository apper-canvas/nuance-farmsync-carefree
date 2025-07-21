const delay = () => new Promise(resolve => setTimeout(resolve, 400));

// Mock weather data generator
const generateWeatherData = (location) => {
  const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rain", "Thunderstorms"];
  const currentTemp = Math.floor(Math.random() * 30) + 60; // 60-90°F
  
  const forecast = [];
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    forecast.push({
      date: date.toISOString().split("T")[0],
      high: currentTemp + Math.floor(Math.random() * 10) - 5,
      low: currentTemp - Math.floor(Math.random() * 15) - 10,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 15) + 5 // 5-20 mph
    });
  }
  
  return {
    location,
    current: {
      temperature: currentTemp,
      condition: forecast[0].condition,
      humidity: forecast[0].humidity,
      windSpeed: forecast[0].windSpeed,
      feelsLike: currentTemp + Math.floor(Math.random() * 6) - 3
    },
    forecast
  };
};

export const weatherService = {
  async getWeatherByLocation(location) {
    await delay();
    return generateWeatherData(location);
  },

  async getCurrentWeather(location) {
    await delay();
    const data = generateWeatherData(location);
    return data.current;
  }
};