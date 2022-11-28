const bundleModel = require("../../../models/bundle");
const userModel = require("../../../models/user");

const bundleServices = {
  createBundle: async (insertObj) => {
    return await bundleModel.create(insertObj);
  },

  findBundle: async (query) => {
    return await bundleModel.findOne(query);
  },

  updateBundle: async (query, updateObj) => {
    return await bundleModel.findOneAndUpdate(query, updateObj, { new: true });
  },

  bundleList: async (query) => {
    let activeIds = await getActiveUser();
    query.userId = { $in: activeIds };
    return await bundleModel.find(query);
  },
};

module.exports = { bundleServices };

const getActiveUser = async () => {
  let userId = await userModel.find({ blockStatus: false }).select("_id");
  userId = userId.map((i) => i._id);
  return userId;
};
