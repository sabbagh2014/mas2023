
const { transactionServices } = require("../../services/transaction");
const { createTransaction, findTransaction } = transactionServices;
const userModel = require("../../../../models/user");
const bnb = require("../../../../helper/bnb");
const { notificationServices } = require("../../services/notification");
const { createNotification } = notificationServices;

class depositController {

  constructor(){}

  async start(){
    var addrPool = await userModel.find({userType:{$ne: 'Admin'}}).distinct("ethAccount.address");
    console.log(addrPool);
    await bnb.usdt.trackDeposits(addrPool, this.processTokenDeposit);
    await bnb.busd.trackDeposits(addrPool, this.processTokenDeposit);
    await bnb.mas.trackDeposits(addrPool, this.processTokenDeposit);
  }


  async processTokenDeposit(hash, coin, amount, from, to) {

    try {
      
      let userResult = await userModel.findOne({ "ethAccount.address": to });
      if(!userResult){
        console.error('No user found with deposit addr '+ to);
        return
      }

      let tx = await findTransaction({transactionHash: hash});
      if (tx) {
        console.log('tx exists')
        return
      }

      await createTransaction({
        userId: userResult._id,
        amount: amount,
        fromAddress: from,
        recipientAddress: to,
        coinName: coin,
        transactionType: "Deposit",
        transactionHash: hash,
        transactionStatus: "PENDING" 
      });
      sendNotification(userResult._id,hash,amount,coin);
      
    } catch (error) {
      return error;
    }
  }  
}

const sendNotification = async (userId, hash, amount, coin) => {
  await createNotification({
    title: `Deposit Transaction Pending !`,
    description: `Your Deposit of ${amount} ${coin} is detected, waiting for blockchain confirmations, 
                  Transaction hash is: ${hash} `,
    userId: userId,
    notificationType: "DEPOSIT_PENDING",
  });
};

module.exports = new depositController();
