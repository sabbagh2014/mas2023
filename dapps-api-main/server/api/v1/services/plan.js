const planModel = require("../../../models/plan");
const userModel = require("../../../models/user");

const planServices = {
  createPlan: async (insertObj) => {
    return await planModel.create(insertObj);
  },

  findPlan: async (query) => {
    return await planModel.findOne(query);
  },

  updatePlan: async (query, updateObj) => {
    return await planModel.findOneAndUpdate(query, updateObj, { new: true });
  },

  planList: async (query) => {
    let activeIds = await getActiveUser();
    query.userId = { $in: activeIds };
    return await planModel.find(query);
  },
};

module.exports = { planServices };

const getActiveUser = async () => {
  let userId = await userModel.find({ blockStatus: false }).select("_id");
  userId = userId.map((i) => i._id);
  return userId;
};
