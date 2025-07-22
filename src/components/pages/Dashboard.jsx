import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/molecules/StatCard";
import WeatherCard from "@/components/molecules/WeatherCard";
import TaskList from "@/components/organisms/TaskList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { taskService } from "@/services/api/taskService";
import { transactionService } from "@/services/api/transactionService";
import { weatherService } from "@/services/api/weatherService";

const Dashboard = () => {
  const [data, setData] = useState({
    farms: [],
    crops: [],
    tasks: [],
    transactions: [],
    weather: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [farms, crops, tasks, transactions] = await Promise.all([
        farmService.getAll(),
        cropService.getAll(),
        taskService.getAll(),
        transactionService.getAll()
      ]);

      // Get weather for first farm
      let weather = null;
      if (farms.length > 0) {
        weather = await weatherService.getWeatherByLocation(farms[0].location);
      }

      setData({ farms, crops, tasks, transactions, weather });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCompleteTask = async (taskId) => {
    try {
      await taskService.complete(taskId);
      loadDashboardData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

const activeCrops = data.crops.filter(crop => crop.status_c !== "Harvested").length;
  const pendingTasks = data.tasks.filter(task => !task.completed_c).length;
  const completedTasks = data.tasks.filter(task => task.completed_c).length;
  
const currentMonth = new Date().getMonth();
  const monthlyTransactions = data.transactions.filter(t => 
    new Date(t.date_c).getMonth() === currentMonth
  );
  const monthlyIncome = monthlyTransactions
    .filter(t => t.type_c === "income")
    .reduce((sum, t) => sum + t.amount_c, 0);
  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type_c === "expense")
    .reduce((sum, t) => sum + t.amount_c, 0);
  const monthlyProfit = monthlyIncome - monthlyExpenses;

const upcomingTasks = data.tasks
    .filter(task => !task.completed_c)
    .sort((a, b) => new Date(a.due_date_c) - new Date(b.due_date_c))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Farms"
          value={data.farms.length}
          icon="MapPin"
          color="primary"
        />
        <StatCard
          title="Active Crops"
          value={activeCrops}
          icon="Wheat"
          color="secondary"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          icon="Clock"
          color="warning"
        />
        <StatCard
          title="Monthly Profit"
          value={`$${monthlyProfit.toLocaleString()}`}
          icon="DollarSign"
          color={monthlyProfit >= 0 ? "success" : "error"}
          trend={monthlyProfit >= 0 ? "up" : "down"}
          trendValue={`$${Math.abs(monthlyProfit).toLocaleString()}`}
        />
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 font-display">
                Upcoming Tasks
              </h2>
              <div className="text-sm text-gray-600">
                {pendingTasks} pending, {completedTasks} completed
              </div>
            </div>
            
            {upcomingTasks.length > 0 ? (
              <TaskList
                tasks={upcomingTasks}
                farms={data.farms}
                crops={data.crops}
                onComplete={handleCompleteTask}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No upcoming tasks</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Weather Card */}
          <WeatherCard weather={data.weather} />

          {/* Financial Summary */}
          <div className="card p-6 bg-gradient-to-br from-accent-50 to-accent-100">
            <h3 className="font-semibold text-gray-900 mb-4">This Month</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Income</span>
                <span className="font-medium text-green-600">
                  +${monthlyIncome.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Expenses</span>
                <span className="font-medium text-red-600">
                  -${monthlyExpenses.toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Net Profit</span>
                  <span className={`font-bold ${monthlyProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {monthlyProfit >= 0 ? "+" : ""}${monthlyProfit.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;