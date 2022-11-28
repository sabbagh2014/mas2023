const moderatorModel = require("../../../models/moderator");

const moderatorServices = {
  createModerator: async (insertObj) => {
    return await moderatorModel.create(insertObj);
  },

  findModerator: async (query) => {
    return await moderatorModel.findOne(query);
  },

  updateModerator: async (query, updateObj) => {
    return await moderatorModel.findOneAndUpdate(query, updateObj, {
      new: true,
    });
  },

  moderatorList: async (query) => {
    return await moderatorModel.find(query);
  },
};

module.exports = { moderatorServices };
