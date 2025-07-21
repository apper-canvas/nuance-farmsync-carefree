import transactionsData from "@/services/mockData/transactions.json";

let transactions = [...transactionsData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

export const transactionService = {
  async getAll() {
    await delay();
    return [...transactions];
  },

  async getById(id) {
    await delay();
    return transactions.find(transaction => transaction.Id === parseInt(id));
  },

  async getByFarmId(farmId) {
    await delay();
    return transactions.filter(transaction => transaction.farmId === parseInt(farmId));
  },

  async create(transactionData) {
    await delay();
    const newTransaction = {
      Id: Math.max(...transactions.map(t => t.Id), 0) + 1,
      ...transactionData,
      farmId: parseInt(transactionData.farmId),
      amount: parseFloat(transactionData.amount)
    };
    transactions.push(newTransaction);
    return newTransaction;
  },

  async update(id, transactionData) {
    await delay();
    const index = transactions.findIndex(transaction => transaction.Id === parseInt(id));
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...transactionData };
      return transactions[index];
    }
    throw new Error("Transaction not found");
  },

  async delete(id) {
    await delay();
    const index = transactions.findIndex(transaction => transaction.Id === parseInt(id));
    if (index !== -1) {
      const deleted = transactions.splice(index, 1)[0];
      return deleted;
    }
    throw new Error("Transaction not found");
  }
};