const partnerModel = require("../../../models/partner");
const status = require("../../../enums/status");
const partnerServices = {
  createPartner: async (insertObj) => {
    return await partnerModel.create(insertObj);
  },

  findPartner: async (query) => {
    return await partnerModel.findOne(query);
  },

  updatePartner: async (query, updateObj) => {
    return await partnerModel.findOneAndUpdate(query, updateObj, { new: true });
  },

  paginatePartnerList: async (validatedBody) => {
    let query = { status: { $ne: status.DELETE } };
    const { search, fromDate, toDate, page, limit } = validatedBody;
    if (search) {
      query = { name: { $regex: search, $options: "i" } };
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
    return await partnerModel.paginate(query, options);
  },

  partnerList: async (query) => {
    return await partnerModel.find(query).sort({ createdAt: -1 });
  },
};

module.exports = { partnerServices };
