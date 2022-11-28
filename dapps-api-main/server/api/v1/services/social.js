const socialModel = require("../../../models/social");
const status = require("../../../enums/status");

const socialServices = {
  createSocial: async (insertObj) => {
    return await socialModel.create(insertObj);
  },

  findSocial: async (query) => {
    return await socialModel.findOne(query);
  },
  findAllSocial: async () => {
    let query = { status: { $ne: status.DELETE } };
    return await socialModel.find(query);
  },
  updateSocial: async (query, updateObj) => {
    return await socialModel.findOneAndUpdate(query, updateObj, { new: true });
  },

  updateSocialById: async (query, updateObj) => {
    return await socialModel.findByIdAndUpdate(query, updateObj, { new: true });
  },
  paginateSearchSocial: async (validatedBody) => {
    let query = { status: { $ne: status.DELETE } };
    const { search, fromDate, toDate, page, limit } = validatedBody;
    if (search) {
      query.$or = [
        { social_title: { $regex: search, $options: "i" } },
        { social_Link: { $regex: search, $options: "i" } },
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
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 15,
      sort: { createdAt: -1 },
    };
    return await socialModel.paginate(query, options);
  },
};

module.exports = { socialServices };
