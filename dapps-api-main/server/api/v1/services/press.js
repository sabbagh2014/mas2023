const pressModel = require("../../../models/press");
const status = require("../../../enums/status");
const pressServices = {
  createPress: async (insertObj) => {
    return await pressModel.create(insertObj);
  },

  findPress: async (query) => {
    return await pressModel.findOne(query);
  },

  updatePress: async (query, updateObj) => {
    return await pressModel.findOneAndUpdate(query, updateObj, { new: true });
  },

  paginatePressList: async (validatedBody) => {
    let query = { status: { $ne: status.DELETE } };
    const { search, fromDate, toDate, page, limit } = validatedBody;
    if (search) {
      query = { title: { $regex: search, $options: "i" } };
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
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: { createdAt: -1 },
    };
    return await pressModel.paginate(query, options);
  },

  pressList: async (query) => {
    return await pressModel.find(query).sort({ createdAt: -1 });
  },
};

module.exports = { pressServices };
