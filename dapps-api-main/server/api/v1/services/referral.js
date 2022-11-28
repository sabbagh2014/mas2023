const refferalModel = require("../../../models/referral");

const referralServices = {
  findReferral: async (query) => {
    return await refferalModel.findOne(query);
  },

  updateReferral: async (query, updateObj) => {
    return await refferalModel.findOneAndUpdate(query, updateObj, {
      new: true,
    });
  },
};

module.exports = { referralServices };
