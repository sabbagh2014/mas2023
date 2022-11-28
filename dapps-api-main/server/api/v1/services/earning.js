const earningModel = require("../../../models/earning");

const earningServices = {
  createEarning: async (insertObj) => {
    return await earningModel.create(insertObj);
  },

  findEarning: async (query) => {
    return await earningModel.findOne(query);
  },

  updateEarning: async (query, updateObj) => {
    return await earningModel.findOneAndUpdate(query, updateObj, { new: true });
  },

  earningList: async (query) => {
    return await earningModel.find(query);
  },
};

module.exports = { earningServices };
