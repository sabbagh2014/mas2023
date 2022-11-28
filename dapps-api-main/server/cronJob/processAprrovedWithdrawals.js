const status = require("../enums/status");
const userType = require("../enums/userType");

const { transactionServices } = require("../api/v1/services/transaction");
const { transactionList, updateTransaction, createTransaction } = transactionServices;

const { notificationServices } = require("../api/v1/services/notification");
const { createNotification } = notificationServices;
const { userServices } = require("../api/v1/services/user");

const bnb = require("../helper/bnb");
const Web3 = require("web3");


const cronJob = require("cron").CronJob;


let jobMain = new cronJob("* * * * * ", async function () {
  var withdrawal;
  var transaction;
  var getApprovedWithdrawals = await transactionList({
    status: { $ne: status.DELETE },
    transactionType : "Withdraw",
    transactionStatus: {$in: ["APPROVED","FAILED"]},
  });

  if (getApprovedWithdrawals.length > 0) {
    jobMain.stop();
    try {
      withdrawal = getApprovedWithdrawals[0];

      if(withdrawal.transactionStatus == "FAILED" && !withdrawal.transactionHash){
        await updateTransaction(
          { _id: withdrawal._id },
          { $inc: {retriesIfFailed: 1}, }
        );
      } else if(withdrawal.transactionStatus == "FAILED" && withdrawal.transactionHash){
        await updateTransaction(
          { _id: withdrawal._id },
          { transactionStatus: "SUCCESS", }
        );
        jobMain.start();
        return
      }
      let internalUserResult = await userServices.findUserData({ "ethAccount.address": withdrawal.recipientAddress });
      
      if(internalUserResult){
        var balance = withdrawal.coinName.toLowerCase() + "Balance";
        await userServices.updateUser({ _id: internalUserResult._id }, { $inc: { [balance]: withdrawal.amount } });
        await createTransaction({
          userId: internalUserResult._id,
          amount: withdrawal.amount,
          recipientAddress: withdrawal.recipientAddress,
          coinName: withdrawal.coinName,
          transactionType: "Deposit",
          transactionStatus: "SUCCESS" 
        });
        await updateTransaction(
          { _id: withdrawal._id },
          { transactionStatus: "SUCCESS", }
        );
        jobMain.start();
        return
      }

      let admin = await userServices.findUser({ userType: userType.ADMIN });

      var token = bnb[withdrawal.coinName.toLowerCase()];

      transaction = await token.withdraw(
        admin.ethAccount.address,
        admin.ethAccount.privateKey,
        withdrawal.recipientAddress,
        Web3.utils.toWei(withdrawal.amount.toString()),
      );
      
      if(transaction.Success || transaction.Hash){
        await updateTransaction(
          { _id: withdrawal._id },
          {
            transactionStatus: "SUCCESS",
            transactionHash: transaction.Hash,
          }
        );
        sendNotification(withdrawal.userId, transaction.Hash);
      } else {
        await updateTransaction(
          { _id: withdrawal._id },
          {
            transactionStatus: "FAILED",
            retriesIfFailed: 1,
          }
        );
      }
    } catch (error) {
       console.log('Withdraw tx error: ',error.message);
    }

    jobMain.start();
  }
});

module.exports = jobMain;


const sendNotification = async (userId, txHash) => {
  await createNotification({
    title: `Withdraw Transaction Successfull !`,
    description: `Your payment has been confirmed successfully, your transaction hash is ${txHash}`,
    userId: userId,
    notificationType: "PAYMENT_SUCCESS",
  });
};