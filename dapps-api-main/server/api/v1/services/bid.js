const bidModel = require("../../../models/bid");

const bidServices = {
  createBid: async (insertObj) => {
    return await bidModel.create(insertObj);
  },

  findBid: async (query) => {
    return await bidModel.findOne(query);
  },

  updateBid: async (query, updateObj) => {
    return await bidModel.findOneAndUpdate(query, updateObj, { new: true });
  },

  updateManyBid: async (orderId) => {
    return await bidModel.updateMany(
      { orderId: orderId },
      { bidStatus: "REJECTED" },
      { multi: true }
    );
  },

  bidList: async (query) => {
    // let activeIds = await getActiveUser();
    // query.userId = { $in: activeIds };
    return await bidModel.find(query).populate("orderId");

    // return await bidModel.find(query).populate([{ path: 'userId', select: '-ethAccount.privateKey' }, { path: 'orderId', populate: { path: "nftId" } }]).sort({ createdAt: -1 });
  },

  bidCount: async () => {
    return await bidModel.countDocuments();
  },
};

module.exports = { bidServices };
