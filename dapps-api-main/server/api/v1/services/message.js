const messageModel = require("../../../models/message");
const mongoose = require("mongoose");

const messageServices = {
  createMsg: async (insertObj) => {
    return await messageModel.create(insertObj);
  },

  findMsg: async (query) => {
    return await messageModel.findOne(query);
  },

  readMsg: async (ids) => {
    return await messageModel.updateMany(
      { _id: { $in: ids } },
      { $set: { "status" : 'Read' } }
   );
  },

  messageList: async (chatId, options) => {
    const {limit, page} = options;
    const query = {
      chat: mongoose.Types.ObjectId(chatId),
    };
    return await messageModel.find(query).limit(limit).skip(page).sort({ createdAt: -1 });
  }
};

module.exports = { messageServices };

