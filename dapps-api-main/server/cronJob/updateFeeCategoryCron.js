const { userServices } = require("../api/v1/services/user");
const { feeServices } = require("../api/v1/services/fee");
const status = require("../enums/status");
const userType = require("../enums/userType");
const { updateUser, allUser } = userServices;
const { sortFee } = feeServices;

const cronJob = require("cron").CronJob;

new cronJob("*/5 * * * *", async function () {
  var userResult = await allUser({
    status: status.ACTIVE,
    userType: { $in: [userType.USER, userType.CREATOR] },
  });
  if (userResult.length == 0) {
    
  } else {
    var commissionResult;
    for (let index of userResult) {
      commissionResult = await sortFee({
        masHeld: { $lte: index.masBalance },
        status: status.ACTIVE,
      });
      await updateUser(
        { _id: index._id },
        { planType: commissionResult.planType }
      );
    }
  }
}).start();
