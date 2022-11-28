const audienceModel = require("../../../models/audience");
const status = require("../../../enums/status");

const audienceServices = {
  createAudience: async (insertObj) => {
    return await audienceModel.create(insertObj);
  },

  findAudience: async (query) => {
    return await audienceModel.findOne(query);
  },

  findAudience1: async (query) => {
    return await audienceModel.findOne(query).populate("userId nftId");
  },

  updateAudience: async (query, updateObj) => {
    return await audienceModel.findOneAndUpdate(query, updateObj, {
      new: true,
    });
  },

  postList: async (query) => {
    return await audienceModel.find(query);
  },
  postList1: async (query) => {
    return await audienceModel.find(query);
  },
  multiUpdate: async (updateObj) => {
    return await audienceModel.updateMany({}, updateObj, { multi: true });
  },

  feedUpdateAll: async (query, updateObj) => {
    return await audienceModel.updateMany(query, updateObj, { multi: true });
  },

  audienceContentList: async (query) => {
    const { nftId, search, fromDate, toDate, postType, page, limit } = query;
    query = { status: status.ACTIVE, nftId: { $in: nftId } };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { details: { $regex: search, $options: "i" } },
      ];
    }
    if (postType) {
      query.postType = postType;
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

    var options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: { createdAt: -1 },
    };

    return await audienceModel.paginate(query, options);
  },
};

module.exports = { audienceServices };

