import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

export const taskService = {
  async getAll() {
    await delay();
    return [...tasks];
  },

  async getById(id) {
    await delay();
    return tasks.find(task => task.Id === parseInt(id));
  },

  async getByFarmId(farmId) {
    await delay();
    return tasks.filter(task => task.farmId === parseInt(farmId));
  },

  async create(taskData) {
    await delay();
    const newTask = {
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      ...taskData,
      farmId: parseInt(taskData.farmId),
      cropId: taskData.cropId ? parseInt(taskData.cropId) : null,
      completed: false,
      completedDate: null
    };
    tasks.push(newTask);
    return newTask;
  },

  async update(id, taskData) {
    await delay();
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...taskData };
      return tasks[index];
    }
    throw new Error("Task not found");
  },

  async complete(id) {
    await delay();
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      tasks[index].completed = true;
      tasks[index].completedDate = new Date().toISOString().split("T")[0];
      return tasks[index];
    }
    throw new Error("Task not found");
  },

  async delete(id) {
    await delay();
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      const deleted = tasks.splice(index, 1)[0];
      return deleted;
    }
    throw new Error("Task not found");
  }
};