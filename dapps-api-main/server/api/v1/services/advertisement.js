const advertisementModel = require("../../../models/advertisement");
const status = require("../../../enums/status");

const advertisementServices = {
  createAdvertisement: async (insertObj) => {
    return await advertisementModel.create(insertObj);
  },

  findAdvertisement: async (query) => {
    return await advertisementModel.findOne(query);
  },
  findAllAdvertisement: async () => {
    let query = { status: { $ne: status.DELETE } };
    return await advertisementModel.find(query);
  },
  findAdvertisements: async (query) => {
    return await advertisementModel.find(query);
  },
  updateAdvertisement: async (query, updateObj) => {
    return await advertisementModel.findOneAndUpdate(query, updateObj, {
      new: true,
    });
  },

  updateAdvertisementById: async (query, updateObj) => {
    return await advertisementModel.findByIdAndUpdate(query, updateObj, {
      new: true,
    });
  },
  paginateSearchAdvertisement: async (validatedBody) => {
    let query = { status: { $ne: status.DELETE } };
    const { fromDate, toDate, page, limit } = validatedBody;

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
    return await advertisementModel.paginate(query, options);
  },
};

module.exports = { advertisementServices };
