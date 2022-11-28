const { subscriptionServices } = require("../api/v1/services/subscription");
const { userServices } = require("../api/v1/services/user");
const { notificationServices } = require("../api/v1/services/notification");

const status = require("../enums/status");
const { updateSubscription, subscriptionList } = subscriptionServices;
const { updateUser } = userServices;
const { createNotification } = notificationServices;

const cronJob = require("cron").CronJob;

new cronJob("*/50 * * * * *", async function () {
  var subscriberRes = await subscriptionList({
    status: { $ne: status.DELETE },
    validTillDate: { $lt: new Date().toISOString() },
    subscriptionStatus: status.ACTIVE,
  });
  if (subscriberRes.length == 0) {
    console.log("No records found.");
  } else {
    for (let i = 0; i < subscriberRes.length; i++) {
      // await updateNft({ _id: subscriberRes[i].nftId._id }, { $pull: { subscribers: subscriberRes[i].userId } });
      const updateRes = await updateSubscription(
        { _id: subscriberRes[i]._id },
        { $set: { subscriptionStatus: status.EXPIRED } }
      );
      await updateUser(
        { _id: subscriberRes[i].userId },
        { $pull: { subscribeNft: subscriberRes[i].nftId._id } }
      );
      sendNotification(
        subscriberRes[i].userId,
        subscriberRes[i].nftId.bundleName
      );
      if (updateRes) {
        console.log(`Expired....userId===>>${subscriberRes[i].nftId._id}`);
      }
    }
  }
}).start();

const sendNotification = async (userId, bundleName) => {
  await createNotification({
    title: `Bundle Expire Alert!`,
    description: `Your subscription plan of ${bundleName} bundle is expired subscribe to enjoy again.`,
    userId: userId,
    notificationType: "BUNDLE_EXPIRED",
  });
};
