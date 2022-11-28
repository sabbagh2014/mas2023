const orderModel = require("../../../models/order");
const status = require("../../../enums/status");
const mongoose = require("mongoose");

const orderServices = {
  createOrder: async (insertObj) => {
    return await orderModel.create(insertObj);
  },

  findOrder: async (query) => {
    return await orderModel.findOne(query).populate("nftId");
  },

  findOrderWithPopulate: async (id) => {
    let query = {
      _id: mongoose.Types.ObjectId(id),
      status: { $ne: status.DELETE },
    };
    let data = await orderModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "user",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      { $unwind: "$userId" },
      {
        $lookup: {
          from: "auctionNft",
          localField: "nftId",
          foreignField: "_id",
          as: "nftId",
        },
      },
      { $unwind: "$nftId" },
      {
        $lookup: {
          from: "bid",
          localField: "bidId",
          foreignField: "_id",
          as: "bidId",
        },
      },
      {
        $project: {
          "userId.ethAccount.privateKey": 0,
          "userId.password": 0,
          "userId.referralCode": 0,
          "userId.email": 0,
        },
      },
    ]);
    return data[0];
  },

  updateOrder: async (query, updateObj) => {
    return await orderModel.findOneAndUpdate(query, updateObj, { new: true });
  },

  orderList: async (query) => {
    // let activeIds = await getActiveUser();
    // query.userId = { $in: activeIds };
    return await orderModel
      .find(query)
      .populate([
        {
          path: "userId",
          select:
            "-ethAccount.privateKey -password -referralCode -email -permissions",
        },
        { path: "nftId" },
      ]);
  },

  soldOrderList: async (query) => {
    // let activeIds = await getActiveUser();
    // query.userId = { $in: activeIds };
    return await orderModel
      .find(query)
      .populate([
        {
          path: "userId",
          select:
            "-ethAccount.privateKey -password -referralCode -email -permissions",
        },
        {
          path: "buyerId",
          select:
            "-ethAccount.privateKey -password -referralCode -email -permissions",
        },
        { path: "sellerId", select: "-ethAccount.privateKey" },
        { path: "nftId" },
      ]);
  },

  orderCount: async () => {
    return await orderModel.countDocuments();
  },
};

module.exports = { orderServices };

