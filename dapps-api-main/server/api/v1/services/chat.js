const chatModel = require("../../../models/chat");
const mongoose = require("mongoose");

const chatServices = {
  createChat: async (insertObj) => {
    return await chatModel.create(insertObj);
  },

  findChat: async (query) => {
    return await chatModel.findOne(query);
  },

  updateChat: async (query, updateObj) => {
    return await chatModel.findOneAndUpdate(query, updateObj, { new: true });
  },

  chatList: async (userId, options) => {
    const {limit, page} = options;
    const query = {
      users: mongoose.Types.ObjectId(userId),
      status: 'ACTIVE',
    };

    return await chatModel.find(query, options).limit(limit).skip((page-1)*limit).populate('users', 'userName profilePic');
  },
};

module.exports = { chatServices };

