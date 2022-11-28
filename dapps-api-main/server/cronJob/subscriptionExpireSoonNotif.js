const { subscriptionServices } = require("../api/v1/services/subscription");
const { notificationServices } = require("../api/v1/services/notification");

const status = require("../enums/status");
const { updateSubscription, subscriptionList } = subscriptionServices;
const { createNotification } = notificationServices;

const cronJob = require("cron").CronJob;

new cronJob("*/50 * * * * *", async function () {
  var subscriberRes = await subscriptionList({
    status: { $ne: status.DELETE },
    validTillDate: {
      $lt: new Date(
        new Date().setHours(new Date().getHours() - 1)
      ).toISOString(),
    },
    subscriptionStatus: status.ACTIVE,
  });
  if (subscriberRes.length == 0) {
    console.log("No records found for subscription alert.");
  } else {
    for (let i = 0; i < subscriberRes.length; i++) {
      const updateRes = await updateSubscription(
        { _id: subscriberRes[i]._id },
        { $set: { isAlert: true } }
      );
      sendNotification(
        subscriberRes[i].userId,
        subscriberRes[i].nftId.bundleName
      );
      if (updateRes) {
        console.log(`alert done....userId===>>${subscriberRes[i].nftId._id}`);
      }
    }
  }
}).start();

const sendNotification = async (userId, bundleName) => {
  await createNotification({
    title: `Bundle Expire Soon!`,
    description: `Your subscription plan of ${bundleName} bundle is expiring soon please subscribe to enjoy again.`,
    userId: userId,
    notificationType: "BUNDLE_EXPIRE",
  });
};
