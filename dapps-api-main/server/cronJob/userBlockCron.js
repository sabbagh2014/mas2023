const { blockUserServices } = require("../api/v1/services/blockUser");
const { userServices } = require("../api/v1/services/user");

const status = require("../enums/status");
const { blockUserList, updateBlockUser } = blockUserServices;
const { updateUser } = userServices;

const cronJob = require("cron").CronJob;

new cronJob("*/10 * * * * *", async function () {
  var blockUserRes = await blockUserList({
    status: { $ne: status.DELETE },
    blockStatus: status.BLOCK,
    tillValid: { $lt: new Date().toISOString() },
  });
  if (blockUserRes.length == 0) {
    
  } else {
    for (let index of blockUserRes) {
      const updateRes = await updateBlockUser(
        { _id: index._id },
        { $set: { blockStatus: status.ACTIVE } }
      );
      await updateUser({ _id: index.userId._id }, { blockStatus: false });
      if (updateRes) {
        
      }
    }
  }
}).start();
