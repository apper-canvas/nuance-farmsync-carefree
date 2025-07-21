import cropsData from "@/services/mockData/crops.json";

let crops = [...cropsData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

export const cropService = {
  async getAll() {
    await delay();
    return [...crops];
  },

  async getById(id) {
    await delay();
    return crops.find(crop => crop.Id === parseInt(id));
  },

  async getByFarmId(farmId) {
    await delay();
    return crops.filter(crop => crop.farmId === parseInt(farmId));
  },

  async create(cropData) {
    await delay();
    const newCrop = {
      Id: Math.max(...crops.map(c => c.Id), 0) + 1,
      ...cropData,
      farmId: parseInt(cropData.farmId)
    };
    crops.push(newCrop);
    return newCrop;
  },

  async update(id, cropData) {
    await delay();
    const index = crops.findIndex(crop => crop.Id === parseInt(id));
    if (index !== -1) {
      crops[index] = { ...crops[index], ...cropData };
      return crops[index];
    }
    throw new Error("Crop not found");
  },

  async delete(id) {
    await delay();
    const index = crops.findIndex(crop => crop.Id === parseInt(id));
    if (index !== -1) {
      const deleted = crops.splice(index, 1)[0];
      return deleted;
    }
    throw new Error("Crop not found");
  }
};