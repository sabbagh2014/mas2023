const Joi = require("joi");
const apiError = require("../../../../helper/apiError");
const response = require("../../../../../assets/response");
const responseMessage = require("../../../../../assets/responseMessage");
const { userServices } = require("../../services/user");
const { transactionServices } = require("../../services/transaction");
const { feeServices } = require("../../services/fee");
const { earningServices } = require("../../services/earning");
const { createTransaction } = transactionServices;
const { findUser, findUserData, updateUser } = userServices;
const { sortFee } = feeServices;
const { findEarning, createEarning, updateEarning } = earningServices;
const userType = require("../../../../enums/userType");
const status = require("../../../../enums/status");

class blockchainController {
  /**
   * @swagger
   * /blockchain/withdraw:
   *   post:
   *     tags:
   *       - BLOCKCHAIN
   *     description: withdraw
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: senderAddress
   *         description: senderAddress
   *         in: formData
   *         required: false
   *       - name: amountToSend
   *         description: amountToSend
   *         in: formData
   *         required: false
   *       - name: coin
   *         description: coin
   *         in: formData
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async withdraw(req, res, next) {
    const validationSchema = {
      recipientAddress: Joi.string().required(),
      withdrawAmount: Joi.number().required(),
      coin: Joi.string().required(),
    };
    try {
      let { recipientAddress, withdrawAmount, coin } = await Joi.validate(
        req.body,
        validationSchema
      );

      let userResult = await findUserData({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      
      
      let admin = await findUser({ userType: userType.ADMIN });
      var commissionObj = {};
      var firstCommission = {};

      var commissionResult = await sortFee({
        masHeld: { $lte: userResult.masBalance },
        status: status.ACTIVE,
      });
      var commissionFee = withdrawAmount * (commissionResult.contentCreatorFee / 100);
      var amount = withdrawAmount + commissionFee;

      var balance = coin.toLowerCase() + "Balance";

      if (amount > userResult[balance]) {
        return res.json(
          new response({},responseMessage.INSUFFICIENT_BALANCE(coin),400)
        );
      }
          
      await updateUser({ _id: userResult._id }, { $inc: { [balance]: -amount } });

      const tx = await createTransaction({
        userId: userResult._id,
        amount: withdrawAmount,
        recipientAddress: recipientAddress,
        coinName: coin,
        adminCommission: commissionFee,
        transactionType: "Withdraw",
        transactionStatus: "PROCESSING"
      });
      
      commissionObj = { $inc: { [balance]: commissionFee } };
      firstCommission[balance] = commissionFee;
      
      var adminEarningResult = await findEarning({
        userId: admin._id,
        status: status.ACTIVE,
      });

      if (!adminEarningResult) {
        firstCommission.userId = admin._id;
        await createEarning(firstCommission);
      } else {
        await updateEarning({ _id: adminEarningResult._id }, commissionObj);
      }

      return res.json(
        new response({txid:tx._id},responseMessage.TRANSACTION_SUCCESS,201)
      );
    } catch (error) {
      return next(error);
    }
  }  
}

module.exports = new blockchainController();
