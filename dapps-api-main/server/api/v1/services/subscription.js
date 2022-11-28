const subscriptionModel = require("../../../models/subscription");
const mongoose = require("mongoose");

const subscriptionServices = {
  createSubscription: async (insertObj) => {
    return await subscriptionModel.create(insertObj);
  },

  findSubscription: async (query) => {
    return await subscriptionModel.findOne(query);
  },

  updateSubscription: async (query, updateObj) => {
    return await subscriptionModel.findOneAndUpdate(query, updateObj, {
      new: true,
    });
  },

  subscriptionList: async (query) => {
    return await subscriptionModel.find(query).populate("nftId");
  },

  subscriptionListWithAggregate: async (userId) => {
    let query = { userId: mongoose.Types.ObjectId(userId) };
    return await subscriptionModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "nft",
          as: "bundleDetails",
          localField: "nftId",
          foreignField: "_id",
          pipeline: [
            
            {
              $lookup: {
                from: "user",
                localField: "userId",
                foreignField: "_id",
                as: "userId",
              },
            },
            {
              $unwind: "$userId",
            },
            {
              $project: {
                "userId.ethAccount.privateKey": 0,
                "userId.password": 0,
              },
            },
          ],
        }
        
      },
      {
        $unwind: "$bundleDetails",
      },
      { $sort: { createdAt: -1 } },
    ]);
  },
};

module.exports = { subscriptionServices };
