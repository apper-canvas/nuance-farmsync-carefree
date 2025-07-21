import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import StatCard from "@/components/molecules/StatCard";
import TransactionList from "@/components/organisms/TransactionList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { transactionService } from "@/services/api/transactionService";
import { farmService } from "@/services/api/farmService";
import { toast } from "react-toastify";

const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    farmId: "",
    type: "expense",
    category: "",
    amount: "",
    date: "",
    description: ""
  });

  const expenseCategories = ["Seeds", "Fertilizer", "Equipment", "Fuel", "Labor", "Maintenance", "Insurance", "Other"];
  const incomeCategories = ["Crop Sales", "Livestock Sales", "Equipment Rental", "Consulting", "Other"];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [transactionsData, farmsData] = await Promise.all([
        transactionService.getAll(),
        farmService.getAll()
      ]);
      setTransactions(transactionsData);
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
      if (editingTransaction) {
        await transactionService.update(editingTransaction.Id, {
          ...formData,
          amount: parseFloat(formData.amount)
        });
        toast.success("Transaction updated successfully!");
      } else {
        await transactionService.create({
          ...formData,
          amount: parseFloat(formData.amount)
        });
        toast.success("Transaction recorded successfully!");
      }
      resetForm();
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      farmId: transaction.farmId.toString(),
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      date: transaction.date,
      description: transaction.description
    });
    setShowForm(true);
  };

  const handleDelete = async (transactionId) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    
    try {
      await transactionService.delete(transactionId);
      toast.success("Transaction deleted successfully!");
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      farmId: "",
      type: "expense",
      category: "",
      amount: "",
      date: "",
      description: ""
    });
    setEditingTransaction(null);
    setShowForm(false);
  };

  // Calculate financial stats
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netProfit = totalIncome - totalExpenses;

  // Monthly stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });
  
  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) return <Loading type="stats" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            Financial Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track farm income and expenses
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} disabled={farms.length === 0}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {farms.length === 0 && (
        <div className="card p-6 bg-yellow-50 border border-yellow-200">
          <div className="flex items-center">
            <ApperIcon name="AlertTriangle" className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="font-medium text-yellow-800">No farms available</p>
              <p className="text-sm text-yellow-700">Create a farm first before recording transactions.</p>
            </div>
          </div>
        </div>
      )}

      {/* Financial Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Income"
          value={`$${totalIncome.toLocaleString()}`}
          icon="TrendingUp"
          color="success"
        />
        <StatCard
          title="Total Expenses"
          value={`$${totalExpenses.toLocaleString()}`}
          icon="TrendingDown"
          color="error"
        />
        <StatCard
          title="Net Profit"
          value={`$${netProfit.toLocaleString()}`}
          icon="DollarSign"
          color={netProfit >= 0 ? "success" : "error"}
          trend={netProfit >= 0 ? "up" : "down"}
          trendValue={`$${Math.abs(netProfit).toLocaleString()}`}
        />
        <StatCard
          title="This Month"
          value={`$${monthlyIncome.toLocaleString()}`}
          icon="Calendar"
          color="primary"
        />
      </motion.div>

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
                {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
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
                  label="Type"
                  id="type"
                  type="select"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value, category: "" })}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </FormField>

                <FormField
                  label="Category"
                  id="category"
                  type="select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {(formData.type === "income" ? incomeCategories : expenseCategories).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Amount"
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />

                <FormField
                  label="Date"
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <FormField
                label="Description"
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Transaction details"
                required
              />

              <div className="flex space-x-3 pt-4">
                <Button type="button" variant="ghost" onClick={resetForm} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingTransaction ? "Update Transaction" : "Record Transaction"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Transactions List */}
      {transactions.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TransactionList
            transactions={transactions}
            farms={farms}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </motion.div>
      ) : (
        <Empty
          title="No transactions found"
          message="Start tracking your farm finances by recording your first transaction."
          actionLabel="Add Transaction"
          onAction={() => setShowForm(true)}
          icon="DollarSign"
        />
      )}
    </div>
  );
};

export default Finance;