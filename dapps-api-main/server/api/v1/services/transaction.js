const transactionModel = require("../../../models/transaction");
const userModel = require("../../../models/user");
const status = require("../../../enums/status");

const transactionServices = {
  createTransaction: async (insertObj) => {
    return await transactionModel.create(insertObj);
  },

  findTransaction: async (query) => {
    return await transactionModel.findOne(query);
  },

  updateTransaction: async (query, updateObj) => {
    return await transactionModel.updateOne(query, updateObj);
  },

  transactionList: async (query) => {
    let activeIds = await getActiveUser();
    query.userId = { $in: activeIds };
    return await transactionModel
      .find(query)
      .populate([
        {
          path: "userId",
          select:
            "-ethAccount.privateKey -password -referralCode -email -permissions",
          populate: { path: "subscribeNft" },
        },
        { path: "nftId" },
        { path: "nftUserId", select: "-ethAccount.privateKey" },
      ]);
  },
  depositeList: async (query) => {
    return await transactionModel.find(query);
  },
  depositeList1: async (query) => {
    return await transactionModel
      .find(query)
      .populate("userId toDonationUser nftUserId");
  },

  depositListWithPagination: async (userId, validatedBody) => {
    const { page, limit } = validatedBody;
    var query = {
      userId: userId,
      status: status.ACTIVE,
      transactionType: "Donation",
    };
    var options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: { createdAt: -1 },
      populate: {
        path: "toDonationUser",
        select: "name userName email ethAccount.address",
      },
    };
    return await transactionModel.paginate(query, options);
  },

  depositListWithPopulate: async (userId, validatedBody) => {
    const { page, limit } = validatedBody;
    var query = {
      $and: [
        { status: status.ACTIVE },
        { transactionType: { $ne: "Deposite" } },
        {
          $or: [
            { userId: userId },
            { toDonationUser: userId },
            { nftUserId: userId },
          ],
        },
      ],
    };
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
        { path: "toDonationUser" },
        { path: "nftUserId" },
      ],
    };
    return await transactionModel.paginate(query, options);
  },

  allTransactions: async (validatedBody) => {
    const { page, limit, userId, fromDate, toDate } = validatedBody;
    var query = {
      $and: [
        { status: status.ACTIVE },
        {
          $or: [
            { userId: userId },
            { toDonationUser: userId },
            { nftUserId: userId },
          ],
        },
      ],
    };
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
        { path: "toDonationUser" },
        { path: "nftUserId" },
      ],
    };
    return await transactionModel.paginate(query, options);
  },
};

module.exports = { transactionServices };

const getActiveUser = async () => {
  let userId = await userModel.find({ blockStatus: false }).select("_id");
  userId = userId.map((i) => i._id);
  return userId;
};
