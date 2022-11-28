const status = require("../enums/status");
const userType = require("../enums/userType");

const { transactionServices } = require("../api/v1/services/transaction");
const { transactionList, updateTransaction } = transactionServices;

const { notificationServices } = require("../api/v1/services/notification");
const { createNotification } = notificationServices;
const userModel = require("../models/user");

const bnb = require("../helper/bnb");

const cronJob = require("cron").CronJob;


let jobMain = new cronJob("* * * * * ", async function () {
  var deposit;
  var getConfirmedDeposits = await transactionList({
    status: { $ne: status.DELETE },
    transactionType : "Deposit",
    transactionStatus: "PENDING",
  });
  
  if (getConfirmedDeposits.length > 0) {
    jobMain.stop();
    try {
      deposit = getConfirmedDeposits[0];
      let user = await userModel.findOne({ _id: deposit.userId });
      let admin = await userModel.findOne({ userType: userType.ADMIN });

      let confirmations = await bnb.getConfirmations(deposit.transactionHash);
      if(confirmations > 10) {
        await updateTransaction(
          { _id: deposit._id },
          {
            transactionStatus: "SUCCESS",
          }
        );
        await userModel.updateOne({ _id: deposit.userId },
          {$inc: {[deposit.coinName.toLowerCase()+'Balance']: deposit.amount}}
        );
        sendNotification(deposit.userId, deposit.amount, deposit.coinName)
      }

      var token = bnb[deposit.coinName.toLowerCase()];
      const balance = await token.weibBalance(user.ethAccount.address);
 
      if(parseFloat(balance) > 1000000000000000000){
        const gasLimit = await token.contract.methods
        .transfer(admin.ethAccount.address, balance)
        .estimateGas({ from: user.ethAccount.address });
        let {fee, gasPrice} = await bnb.gasFee(gasLimit);
        console.log(' gasLimit', gasLimit);
        console.log(' gasprice', gasPrice);
        console.log('calculated tx fee', fee);
        const userHasGasFee = await bnb.accountBalance(user.ethAccount.address);

        if(userHasGasFee < fee){
          console.log('sending fee to user wallet:',fee);
          await bnb.withdraw(
            admin.ethAccount.address,
            admin.ethAccount.privateKey,
            user.ethAccount.address,
            fee.toString()
          );
        }
        console.log('withdraw '+balance+' '+token.coin+' to admin wallet ...')
        await token.withdraw(
          user.ethAccount.address,
          user.ethAccount.privateKey,
          admin.ethAccount.address,
          balance,
          gasLimit
        );
      
    }
       
    } catch (error) {
       console.log(error.message);
    }

    
    jobMain.start();
  }
});

module.exports = jobMain;


const sendNotification = async (userId, amount, coin) => {
  await createNotification({
    title: `Deposit Transaction Successfull !`,
    description: `Your Deposit of ${amount} ${coin} is confirmed and complete`,
    userId: userId,
    notificationType: "DEPOSIT_SUCCESS",
  });
};