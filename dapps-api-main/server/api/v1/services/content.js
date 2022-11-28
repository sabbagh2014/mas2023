const contentModel = require("../../../models/content");

const contentServices = {
  findContent: async (query) => {
    return await contentModel.findOne(query);
  },

  updateContent: async (query, updateObj) => {
    return await contentModel.findOneAndUpdate(query, updateObj, { new: true });
  },

  contentList: async () => {
    return await contentModel.find({});
  },
};

module.exports = { contentServices };
