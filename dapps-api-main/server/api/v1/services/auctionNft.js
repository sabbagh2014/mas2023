const auctionNftModel = require("../../../models/auctionNft");
const status = require("../../../enums/status");

const auctionNftServices = {
  createAuctionNft: async (insertObj) => {
    return await auctionNftModel.create(insertObj);
  },

  findAuctionNft: async (query) => {
    return await auctionNftModel
      .findOne(query)
      .populate([
        {
          path: "userId",
          select:
            "-ethAccount.privateKey -password -referralCode -email -permissions",
        },
        { path: "orderId" },
        { path: "nftId" },
      ]);
  },

  updateAuctionNft: async (query, updateObj) => {
    return await auctionNftModel.findOneAndUpdate(query, updateObj, {
      new: true,
    });
  },

  auctionNftList: async (query) => {
    // let activeIds = await getActiveUser();
    // query.userId = { $in: activeIds };
    return await auctionNftModel
      .find(query)
      .populate([
        {
          path: "userId",
          select:
            "-ethAccount.privateKey -password -referralCode -email -permissions",
        },
        { path: "orderId" },
        { path: "nftId" },
      ])
      .sort({ createdAt: -1 });
  },

  allNftAuctionList: async (validatedBody) => {
    let query = { status: { $ne: status.DELETE } };
    const { search, fromDate, toDate, page, limit } = validatedBody;
    if (search) {
      query.$or = [
        { tokenName: { $regex: search, $options: "i" } },
        { tokenId: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { network: { $regex: search, $options: "i" } },
        { details: { $regex: search, $options: "i" } },
        { mediaType: { $regex: search, $options: "i" } },
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
      populate: [
        {
          path: "userId",
          select:
            "-ethAccount.privateKey -password -referralCode -email -permissions",
        },
      ],
    };
    return await auctionNftModel.paginate(query, options);
  },
};

module.exports = { auctionNftServices };

