const nftModel = require("../../../models/nft");
const userModel = require("../../../models/user");
const status = require("../../../enums/status");
const mongoose = require("mongoose");

const nftServices = {
  createNft: async (insertObj) => {
    return await nftModel.create(insertObj);
  },

  findNft: async (query) => {
    return await nftModel
      .findOne(query)
      .populate("userId")
      .select(
        "-ethAccount.privateKey -password -referralCode -email -permissions"
      );
  },
  findNft1: async (query) => {
    return await nftModel.findOne(query);
  },

  findNftWithPopulateDetails: async (id, userId) => {
    let query = {
      _id: mongoose.Types.ObjectId(id),
      status: { $ne: status.DELETE },
    };
    return await nftModel.aggregate([
      { $match: query },
      {
        $addFields: {
          isLike: {
            $cond: {
              if: { $in: [mongoose.Types.ObjectId(userId), "$likesUsers"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "order",
          as: "orderDetails",
          let: {
            order_id: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$order_id", "$nftId"] },
              },
            },
            {
              $lookup: {
                from: "bid",
                localField: "_id",
                foreignField: "orderId",
                as: "bidDetails",
              },
            },
          ],
        },
      },
      {
        $project: {
          "userDetails.ethAccount.privateKey": 0,
          "userDetails.password": 0,
          "userDetails.email": 0,
          "userDetails.permissions": 0,
          "userDetails.referralCode": 0,
        },
      },
    ]);
  },

  updateNft: async (query, updateObj) => {
    return await nftModel.findOneAndUpdate(query, updateObj, { new: true });
  },

  nftList: async (userId) => {
    // return await nftModel.find(query).populate('userId orderId bidId');
    return await nftModel.aggregate([
      { $match: { userId: userId, status: { $ne: status.DELETE } } },
      {
        $addFields: {
          isLike: {
            $cond: {
              if: { $in: [mongoose.Types.ObjectId(userId), "$likesUsers"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "order",
          localField: "orderId",
          foreignField: "_id",
          as: "orderDetails",
        },
      },
      {
        $lookup: {
          from: "bid",
          localField: "bidId",
          foreignField: "_id",
          as: "bidDetails",
        },
      },
      {
        $project: {
          "userDetails.ethAccount.privateKey": 0,
          "userDetails.password": 0,
          "userDetails.email": 0,
          "userDetails.permissions": 0,
          "userDetails.referralCode": 0,
        },
      },
    ]);
  },

  nftSubscriber: async (query) => {
    return await nftModel.find(query).populate("userId");
  },

  nftSubscriberList: async (query) => {
    return await nftModel.find(query).select("subscribers");
  },

  nftPaginateSearch: async (validatedBody) => {
    let query = { status: { $ne: status.DELETE } };
    const { search, fromDate, toDate, page, limit } = validatedBody;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { symbol: { $regex: search, $options: "i" } },
        { categoryType: { $regex: search, $options: "i" } },
      ];
    }
    if (fromDate && !toDate) {
      query.createdAt = { $gte: fromDate };
    }
    if (!fromDate && toDate) {
      query.createdAt = { $lte: toDate };
    }
    if (fromDate && toDate) {
      query.$and = [
        { createdAt: { $gte: fromDate } },
        { createdAt: { $lte: toDate } },
      ];
    }
    let options = {
      page: page || 1,
      limit: limit || 10,
      sort: { createdAt: -1 },
    };
    return await nftModel.paginate(query, options);
  },

  myNftPaginateSearch: async (validatedBody, userId) => {
    let query = { userId: userId, status: { $ne: status.DELETE } };
    const { search, fromDate, toDate, page, limit } = validatedBody;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { symbol: { $regex: search, $options: "i" } },
        { categoryType: { $regex: search, $options: "i" } },
        { contractAddress: { $regex: search, $options: "i" } },
      ];
    }
    if (fromDate && !toDate) {
      query.createdAt = { $gte: fromDate };
    }
    if (!fromDate && toDate) {
      query.createdAt = { $lte: toDate };
    }
    if (fromDate && toDate) {
      query.$and = [
        { createdAt: { $gte: fromDate } },
        { createdAt: { $lte: toDate } },
      ];
    }
    let options = {
      page: page || 1,
      limit: limit || 10,
      sort: { createdAt: -1 },
    };
    return await nftModel.paginate(query, options);
  },

  nftCount: async () => {
    return await nftModel.countDocuments();
  },

  nftListWithAggregate: async (validatedBody, userId, subscribeNft) => {
    let query = { status: { $ne: status.DELETE }, _id: { $nin: subscribeNft } };
    const { search } = validatedBody;
    if (search) {
      query.$or = [
        { tokenId: { $regex: search, $options: "i" } },
        { bundleTitle: { $regex: search, $options: "i" } },
        { bundleName: { $regex: search, $options: "i" } },
        { contractAddress: { $regex: search, $options: "i" } },
        { tokenName: { $regex: search, $options: "i" } },
      ];
    }

    return await nftModel.aggregate([
      { $match: query },
      {
        $addFields: {
          isLike: {
            $cond: {
              if: { $in: [mongoose.Types.ObjectId(userId), "$likesUsers"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          "userDetails.ethAccount.privateKey": 0,
          "userDetails.password": 0,
          "userDetails.email": 0,
          "userDetails.permissions": 0,
          "userDetails.referralCode": 0,
        },
      },
    ]);
  },

  listAllNft: async (validatedBody) => {
    let activeIds = await getActiveUser();
    let query = { status: { $ne: status.DELETE }, userId: { $in: activeIds } };
    const { search } = validatedBody;
    if (search) {
      query.$or = [
        { tokenId: { $regex: search, $options: "i" } },
        { bundleTitle: { $regex: search, $options: "i" } },
        { bundleName: { $regex: search, $options: "i" } },
        { contractAddress: { $regex: search, $options: "i" } },
        { tokenName: { $regex: search, $options: "i" } },
      ];
    }
    return await nftModel
      .find(query)
      .populate({ path: "userId", select: "-ethAccount.privateKey" })
      .sort({ createdAt: -1 });
  },

  nftListWithAggregatePipeline: async (validatedBody, userId) => {
    let query = {
      userId: mongoose.Types.ObjectId(userId),
      status: { $ne: status.DELETE },
    };
    const { search } = validatedBody;
    if (search) {
      query.$or = [
        { tokenId: { $regex: search, $options: "i" } },
        { bundleTitle: { $regex: search, $options: "i" } },
        { bundleName: { $regex: search, $options: "i" } },
        { contractAddress: { $regex: search, $options: "i" } },
        { tokenName: { $regex: search, $options: "i" } },
      ];
    }
    return await nftModel.aggregate([
      { $match: query },
      {
        $addFields: {
          isLike: {
            $cond: {
              if: { $in: [mongoose.Types.ObjectId(userId), "$likesUsers"] },
              then: true,
              else: false,
            },
          },
        },
      },
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
        $lookup: {
          from: "order",
          as: "orderDetails",
          let: {
            order_id: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$order_id", "$nftId"] },
              },
            },
            {
              $lookup: {
                from: "bid",
                localField: "_id",
                foreignField: "orderId",
                as: "bidDetails",
              },
            },
          ],
        },
      },
      {
        $project: {
          "userId.ethAccount.privateKey": 0,
          "userId.password": 0,
          "userId.email": 0,
          "userId.permissions": 0,
          "userId.referralCode": 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
  },

  nftListWithoutShared: async (validatedBody, userId) => {
    let query = {
      userId: mongoose.Types.ObjectId(userId),
      status: { $ne: status.DELETE },
    };
    // let query = { userId: mongoose.Types.ObjectId(userId), isShared: { $ne: true }, status: { $ne: status.DELETE } };
    const { search } = validatedBody;
    if (search) {
      query.$or = [
        { tokenId: { $regex: search, $options: "i" } },
        { bundleTitle: { $regex: search, $options: "i" } },
        { bundleName: { $regex: search, $options: "i" } },
        { contractAddress: { $regex: search, $options: "i" } },
        { tokenName: { $regex: search, $options: "i" } },
      ];
    }
    return await nftModel.aggregate([
      { $match: query },
      {
        $addFields: {
          isLike: {
            $cond: {
              if: { $in: [mongoose.Types.ObjectId(userId), "$likesUsers"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "order",
          as: "orderDetails",
          let: {
            order_id: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$order_id", "$nftId"] },
              },
            },
            {
              $lookup: {
                from: "bid",
                localField: "_id",
                foreignField: "orderId",
                as: "bidDetails",
              },
            },
          ],
        },
      },
      {
        $project: {
          "userDetails.ethAccount.privateKey": 0,
          "userDetails.password": 0,
          "userDetails.email": 0,
          "userDetails.permissions": 0,
          "userDetails.referralCode": 0,
        },
      },
    ]);
  },

  nftListWithAggregatePipelineForAll: async (validatedBody, userId) => {
    let activeIds = await getActiveUser();
    let query = {
      userId: { $in: activeIds },
      status: { $ne: status.DELETE },
    };
    const { search } = validatedBody;
    if (search) {
      query.$or = [
        { tokenId: { $regex: search, $options: "i" } },
        { bundleTitle: { $regex: search, $options: "i" } },
        { bundleName: { $regex: search, $options: "i" } },
        { contractAddress: { $regex: search, $options: "i" } },
        { tokenName: { $regex: search, $options: "i" } },
      ];
    }
    return await nftModel.aggregate([
      { $match: query },
      {
        $addFields: {
          isLike: {
            $cond: {
              if: { $in: [mongoose.Types.ObjectId(userId), "$likesUsers"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "order",
          as: "orderDetails",
          let: {
            order_id: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$order_id", "$nftId"] },
              },
            },
            {
              $lookup: {
                from: "bid",
                localField: "_id",
                foreignField: "orderId",
                as: "bidDetails",
              },
            },
          ],
        },
      },
      {
        $project: {
          "userDetails.ethAccount.privateKey": 0,
          "userDetails.password": 0,
          "userDetails.email": 0,
          "userDetails.permissions": 0,
          "userDetails.referralCode": 0,
        },
      },
    ]);
  },

  multiUpdate: async (updateObj) => {
    return await nftModel.updateMany({}, updateObj, { multi: true });
  },

  multiUpdateBundle: async (query, updateObj) => {
    return await nftModel.updateMany(query, updateObj, { multi: true });
  },

  sharedBundleList: async (userId, bundleIds) => {
    return await nftModel.aggregate([
      { $match: { _id: { $in: bundleIds }, status: { $ne: status.DELETE } } },
      {
        $addFields: {
          isSubscribe: {
            $cond: {
              if: { $in: [mongoose.Types.ObjectId(userId), "$subscribers"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "audience",
          localField: "_id",
          foreignField: "nftId",
          as: "postList",
        },
      },
      {
        $project: {
          "userDetails.ethAccount.privateKey": 0,
          "userDetails.password": 0,
          "userDetails.email": 0,
          "userDetails.permissions": 0,
          "userDetails.referralCode": 0,
        },
      },
    ]);
  },

  sharedBundleListPerticular: async (userId, bundleIds) => {
    if (userId) {
      return await nftModel.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(bundleIds),
            status: { $ne: status.DELETE },
          },
        },
        {
          $addFields: {
            isSubscribe: {
              $cond: {
                if: { $in: [mongoose.Types.ObjectId(userId), "$subscribers"] },
                then: true,
                else: false,
              },
            },
          },
        },
        {
          $lookup: {
            from: "user",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $lookup: {
            from: "audience",
            localField: "_id",
            foreignField: "nftId",
            as: "postList",
          },
        },
        {
          $project: {
            "userDetails.ethAccount.privateKey": 0,
            "userDetails.password": 0,
            "userDetails.email": 0,
            "userDetails.permissions": 0,
            "userDetails.referralCode": 0,
          },
        },
      ]);
    } else {
      return await nftModel.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(bundleIds),
            status: { $ne: status.DELETE },
          },
        },
        {
          $lookup: {
            from: "user",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $lookup: {
            from: "audience",
            localField: "_id",
            foreignField: "nftId",
            as: "postList",
          },
        },
        {
          $project: {
            "userDetails.ethAccount.privateKey": 0,
            "userDetails.password": 0,
            "userDetails.email": 0,
            "userDetails.permissions": 0,
            "userDetails.referralCode": 0,
          },
        },
      ]);
    }
  },
};

module.exports = { nftServices };

const getActiveUser = async () => {
  let userId = await userModel.find({ blockStatus: false }).select("_id");
  userId = userId.map((i) => i._id);
  return userId;
};
