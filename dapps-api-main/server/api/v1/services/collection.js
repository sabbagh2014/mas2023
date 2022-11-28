const collectionModel = require("../../../models/collection");
const userModel = require("../../../models/user");
const status = require("../../../enums/status");

const collectionServices = {
  createCollection: async (insertObj) => {
    return await collectionModel.create(insertObj);
  },

  findCollection: async (query) => {
    return await collectionModel.findOne(query);
  },

  updateCollection: async (query, updateObj) => {
    return await collectionModel.findOneAndUpdate(query, updateObj, {
      new: true,
    });
  },

  collectionList: async (query) => {
    let activeIds = await getActiveUser();
    query.userId = { $in: activeIds };
    return await collectionModel.find(query);
  },

  collectionPaginateSearch: async (validatedBody) => {
    let activeIds = await getActiveUser();
    let query = { status: { $ne: status.DELETE }, userId: { $in: activeIds } };
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
    return await collectionModel.paginate(query, options);
  },

  myCollectionPaginateSearch: async (validatedBody, userId) => {
    let query = {
      $and: [
        { status: { $ne: status.DELETE } },
        { $or: [{ userId: userId }, { collectionType: "DEFAULT" }] },
      ],
    };
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
    return await collectionModel.paginate(query, options);
  },
};

module.exports = { collectionServices };

const getActiveUser = async () => {
  let userId = await userModel.find({ blockStatus: false }).select("_id");
  userId = userId.map((i) => i._id);
  return userId;
};
