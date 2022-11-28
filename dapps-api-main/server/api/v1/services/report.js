const reportModel = require("../../../models/report");
const userModel = require("../../../models/user");

const reportServices = {
  createReport: async (insertObj) => {
    return await reportModel.create(insertObj);
  },

  findReport: async (query) => {
    return await reportModel
      .findOne(query)
      .populate([
        {
          path: "userId",
          select:
            "-ethAccount.privateKey -password -referralCode -email -permissions",
        },
        { path: "chatId" },
      ]);
  },

  updateReport: async (query, updateObj) => {
    return await reportModel.findOneAndUpdate(query, updateObj, { new: true });
  },

  reportList: async (query, page, limit) => {
    let activeIds = await getActiveUser();
    query.userId = { $in: activeIds };
    var options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: { createdAt: -1 },
      populate: [
        {
          path: "userId",
          select:
            "-ethAccount.privateKey -password -referralCode -email -permissions",
        },
        { path: "chatId" },
      ],
    };
    return await reportModel.paginate(query, options);
  },
};

module.exports = { reportServices };

const getActiveUser = async () => {
  let userId = await userModel.find({ blockStatus: false }).select("_id");
  userId = userId.map((i) => i._id);
  return userId;
};
