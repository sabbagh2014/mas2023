const staticModel = require("../../../models/static");

const staticServices = {
  createStaticContent: async (insertObj) => {
    return await staticModel.create(insertObj);
  },

  findStaticContent: async (query) => {
    return await staticModel.findOne(query);
  },

  updateStaticContent: async (query, updateObj) => {
    return await staticModel.findOneAndUpdate(query, updateObj, { new: true });
  },

  staticContentList: async () => {
    return await staticModel.find({});
  },
};

module.exports = { staticServices };
