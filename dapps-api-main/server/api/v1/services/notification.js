const notificationModel = require("../../../models/notification");
const userModel = require("../../../models/user");

const notificationServices = {
  createNotification: async (insertObj) => {
    let notif = await notificationModel.create(insertObj);
    global.NotifySocket.to(notif.userId.toString()).emit('notification', [notif]);
    return notif;
  },

  findNotification: async (query) => {
    return await notificationModel.findOne(query);
  },

  updateNotification: async (query, updateObj) => {
    return await notificationModel.findOneAndUpdate(query, updateObj, {
      new: true,
    });
  },

  multiUpdateNotification: async (query, updateObj) => {
    return await notificationModel.updateMany(query, updateObj, {
      multi: true,
    });
  },

  notificationList: async (query) => {
    return await notificationModel.find(query).limit(20).sort({ createdAt: -1 });
  },

};

module.exports = { notificationServices };


