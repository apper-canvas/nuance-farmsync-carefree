import farmsData from "@/services/mockData/farms.json";

let farms = [...farmsData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

export const farmService = {
  async getAll() {
    await delay();
    return [...farms];
  },

  async getById(id) {
    await delay();
    return farms.find(farm => farm.Id === parseInt(id));
  },

  async create(farmData) {
    await delay();
    const newFarm = {
      Id: Math.max(...farms.map(f => f.Id), 0) + 1,
      ...farmData,
      createdAt: new Date().toISOString().split("T")[0]
    };
    farms.push(newFarm);
    return newFarm;
  },

  async update(id, farmData) {
    await delay();
    const index = farms.findIndex(farm => farm.Id === parseInt(id));
    if (index !== -1) {
      farms[index] = { ...farms[index], ...farmData };
      return farms[index];
    }
    throw new Error("Farm not found");
  },

  async delete(id) {
    await delay();
    const index = farms.findIndex(farm => farm.Id === parseInt(id));
    if (index !== -1) {
      const deleted = farms.splice(index, 1)[0];
      return deleted;
    }
    throw new Error("Farm not found");
  }
};