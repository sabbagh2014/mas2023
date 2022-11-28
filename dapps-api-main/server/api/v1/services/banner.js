const bannerModel = require("../../../models/banner");
const status = require("../../../enums/status");

const bannerServices = {
  createBanner: async (insertObj) => {
    return await bannerModel.create(insertObj);
  },

  findBanner: async (query) => {
    return await bannerModel.findOne(query);
  },
  findBanners: async (query) => {
    return await bannerModel.find(query);
  },
  updateBanner: async (query, updateObj) => {
    return await bannerModel.findOneAndUpdate(query, updateObj, { new: true });
  },

  paginateSearchBanner: async (validatedBody) => {
    let query = { status: { $ne: status.DELETE } };
    const { search, fromDate, toDate, page, limit } = validatedBody;
    if (search) {
      query.title = { $regex: search, $options: "i" };
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
      limit: parseInt(limit) || 15,
      sort: { createdAt: -1 },
    };
    return await bannerModel.paginate(query, options);
  },
};

module.exports = { bannerServices };
