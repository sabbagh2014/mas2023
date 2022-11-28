const Joi = require("joi");
const apiError = require("../../../../helper/apiError");
const response = require("../../../../../assets/response");
const responseMessage = require("../../../../../assets/responseMessage");
const { userServices } = require("../../services/user");
const { orderServices } = require("../../services/order");
const { auctionNftServices } = require("../../services/auctionNft");
const { notificationServices } = require("../../services/notification");
const { transactionServices } = require("../../services/transaction");
const { earningServices } = require("../../services/earning");
const {
  createTransaction,
} = transactionServices;

const { updateUser, findUser, findUserData } = userServices;
const {
  createOrder,
  findOrder,
  findOrderWithPopulate,
  updateOrder,
  orderList,
  soldOrderList,
} = orderServices;
const { findAuctionNft, updateAuctionNft, auctionNftList } =
  auctionNftServices;
const {
  createNotification,
} = notificationServices;
const { findEarning, createEarning, updateEarning } = earningServices;

const status = require("../../../../enums/status");

const activityModel = require("../../../../models/activityModel");

class orderController {
  /**
   * @swagger
   * /order/order:
   *   post:
   *     tags:
   *       - USER ORDER
   *     description: createOrder
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: nftId
   *         description: nftId
   *         in: formData
   *         required: true
   *       - name: title
   *         description: title
   *         in: formData
   *         required: false
   *       - name: details
   *         description: details
   *         in: formData
   *         required: false
   *       - name: time
   *         description: time
   *         in: formData
   *         required: false
   *       - name: startingBid
   *         description: startingBid
   *         in: formData
   *         required: false
   *       - name: tokenName
   *         description: tokenName
   *         in: formData
   *         required: false
   *       - name: tokenName
   *         description: tokenName
   *         in: formData
   *         required: false
   *       - name: tokenId
   *         description: tokenId
   *         in: formData
   *         required: false
   *       - name: mediaUrl
   *         description: mediaUrl
   *         in: formData
   *         required: false
   *       - name: mediaType
   *         description: mediaType
   *         in: formData
   *         required: false
   *     responses:
   *       creatorAddress: Joi.string().optional(),
   *       200:
   *         description: Returns success message
   */

  async createOrder(req, res, next) {
    const validationSchema = {
      nftId: Joi.string().required(),
      title: Joi.string().required(),
      tokenId: Joi.string().optional(),
      mediaUrl: Joi.string().optional(),
      details: Joi.string().required(),
      time: Joi.string().required(),
      startingBid: Joi.string().required(),
      tokenName: Joi.string().optional(),
      mediaType: Joi.string().optional(),
    };
    try {
      const validatedBody = Joi.validate(validationSchema, req.body);
      let userResult = await findUserData({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let nftCheck = await findAuctionNft({
        _id: validatedBody.nftId,
        status: { $ne: status.DELETE },
      });
      if (!nftCheck) {
        throw apiError.notFound(responseMessage.NFT_NOT_FOUND);
      }
      if (nftCheck.orderPlace === true) {
        throw apiError.conflict(responseMessage.NFT_ALREADY_PLACE);
      }
      validatedBody.userId = userResult._id;
      validatedBody.orderPlace = true;
      var result = await createOrder(validatedBody);
      await updateAuctionNft(
        { _id: nftCheck._id },
        { orderPlace: true, time: validatedBody.time },
        { $inc: { treandingNftCount: 1 } }
      );
      let obj = {
        userId: userResult._id,
        nftId: nftCheck._id,
        orderId: result._id,
        tokenId: nftCheck.tokenId,
        price: result.startingBid,
        title: "New order Place",
        type: "LIST",
        description: "NFT LIST ",
      };
      await activityModel(obj).save();
      return res.json(new response(result, responseMessage.ORDER_ADDED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /order/order/{_id}:
   *   get:
   *     tags:
   *       - USER ORDER
   *     description: viewOrder
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async viewOrder(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var orderResult = await findOrderWithPopulate(_id);
      if (!orderResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(
        new response(orderResult, responseMessage.DETAILS_FETCHED)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /order/order:
   *   put:
   *     tags:
   *       - USER ORDER
   *     description: editOrder
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id
   *         in: formData
   *         required: true
   *       - name: mediaUrl
   *         description: mediaUrl
   *         in: formData
   *         required: false
   *       - name: details
   *         description: details
   *         in: formData
   *         required: false
   *       - name: time
   *         description: time
   *         in: formData
   *         required: false
   *       - name: startingBid
   *         description: startingBid
   *         in: formData
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async editOrder(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
      mediaUrl: Joi.string().optional(),
      details: Joi.string().optional(),
      time: Joi.string().optional(),
      startingBid: Joi.string().optional(),
    };
    try {
      var validatedBody = await Joi.validate(req.body, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      validatedBody.isCancel = false;
      validatedBody.orderPlace = true;
      validatedBody.isSold = false;
      validatedBody.isBuy = false;
      var orderResult = await findOrder({
        _id: validatedBody._id,
        status: { $ne: status.DELETE },
      });
      if (!orderResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      var result = await updateOrder({ _id: orderResult._id }, validatedBody);
      await updateAuctionNft(
        { _id: result.nftId },
        {
          orderPlace: true,
          time: validatedBody.time,
          auctionStatus: "RUNNING",
          isSold: false,
          isBuy: false,
        },
        { $inc: { treandingNftCount: 1 } }
      );
      return res.json(new response(result, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /order/order:
   *   delete:
   *     tags:
   *       - USER ORDER
   *     description: deleteOrder
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async deleteOrder(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var orderResult = await findOrder({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!orderResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      var result = await updateOrder(
        { _id: orderResult._id },
        { status: status.DELETE }
      );
      return res.json(new response(result, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /order/listOrder:
   *   get:
   *     tags:
   *       - USER ORDER
   *     description: listOrder
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async listOrder(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await orderList({
        userId: userResult._id,
        status: { $ne: status.DELETE },
        orderPlace: true,
        isSold: false,
      });
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /order/soldOrderList:
   *   get:
   *     tags:
   *       - USER ORDER
   *     description: soldOrder
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async soldOrder(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await soldOrderList({
        userId: userResult._id,
        status: { $ne: status.DELETE },
        isSold: true,
      });
      if (dataResults.length === 0) {
        return apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /order/buyOrderList:
   *   get:
   *     tags:
   *       - USER ORDER
   *     description: buyOrder
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async buyOrder(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await soldOrderList({
        buyerId: userResult._id,
        userId: userResult._id,
        status: { $ne: status.DELETE },
      });
      if (dataResults.length === 0) {
        return apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /order/auctionNftList:
   *   get:
   *     tags:
   *       - USER ORDER
   *     description: auctionNftList
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async auctionNftList(req, res, next) {
    try {
      let dataResults = await auctionNftList({
        status: { $ne: status.DELETE },
      });
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /order/allListOrder:
   *   get:
   *     tags:
   *       - USER ORDER
   *     description: allListOrder
   *     produces:
   *       - application/json
   *     parameters:
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async allListOrder(req, res, next) {
    try {
      let dataResults = await orderList({
        status: { $ne: status.DELETE },
        isCancel: { $ne: true },
        isSold: { $ne: true },
        orderPlace: true,
        isExport: false,
      });
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /order/sendOrderToUser:
   *   post:
   *     tags:
   *       - USER ORDER
   *     description: sendOrderToUser
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token is required.
   *         in: header
   *         required: true
   *       - in: body
   *         name: sendOrderToUser
   *         description: sendOrderToUser.
   *         schema:
   *           type: object
   *           required:
   *             - orderId
   *             - userId
   *           properties:
   *             orderId:
   *               type: string
   *             userId:
   *               type: string
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async sendOrderToUser(req, res, next) {
    let validationSchema = {
      orderId: Joi.string().required(),
      userId: Joi.string().required(),
    };
    try {
      let validatedBody = await Joi.validate(req.body, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound([], responseMessage.USER_NOT_FOUND);
      }
      const orderRes = await findOrder({ _id: validatedBody.orderId });
      const userRes = await findUser({ _id: validatedBody.userId });
      const nftRes = await findAuctionNft({ _id: orderRes.nftId });
      if (!orderRes) {
        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
      } else {
        var userEarn = {};
        var userEarningResult = await findEarning({
          userId: orderRes.userId,
          status: status.ACTIVE,
        });
        if (!userEarningResult) {
          userEarn.userId = orderRes.userId;
          userEarn.masBalance = Number(orderRes.startingBid);
          await createEarning(userEarn);
        } else {
          await updateEarning(
            { _id: userEarningResult._id },
            { masBalance: Number(nftRes.startingBid) }
          );
        }
        if (userRes.userType == "Creator") {
          validatedBody.userId = userRes._id;
          validatedBody.nftId = orderRes.nftId;
          validatedBody.startingBid = orderRes.startingBid;
          validatedBody.sellerId = orderRes.userId;
          validatedBody.isBuy = false;
          validatedBody.isSold = false;
          validatedBody.orderPlace = false;
          validatedBody.title = orderRes.title;
          validatedBody.time = orderRes.time;
          validatedBody.tokenId = orderRes.tokenId;
          validatedBody.details = orderRes.details;
          validatedBody.buyerId = userRes._id;
          await createOrder(validatedBody);
          let orderUpdate = await updateOrder(
            { _id: orderRes._id },
            {
              buyerId: userRes._id,
              isSold: true,
              isBuy: true,
              orderPlace: false,
              bidId: [],
            }
          );
          await updateAuctionNft(
            { _id: nftRes._id },
            { userId: userRes._id, orderPlace: false }
          );
          let updateQuery1 = {};
          let updateQuery = { $addToSet: { supporters: orderRes.userId } };
          updateQuery.$inc = { masBalance: Number(nftRes.startingBid) };
          updateQuery1.$inc = { masBalance: -Number(nftRes.startingBid) };
          await updateUser({ _id: validatedBody.sellerId }, updateQuery);
          await updateUser({ _id: validatedBody.userId }, updateQuery1);
          await createTransaction({
            userId: validatedBody.userId,
            nftId: orderRes.nftId,
            nftUserId: validatedBody.sellerId,
            amount: Number(validatedBody.startingBid),
            transactionType: "Donation",
            coinName: "MAS",
          });
          await createTransaction({
            userId: validatedBody.userId,
            nftId: orderRes.nftId,
            nftUserId: validatedBody.sellerId,
            amount: Number(validatedBody.startingBid),
            transactionType: "Deposite",
            coinName: "MAS",
          });
          await updateAuctionNft(
            { _id: nftRes._id },
            {
              buyerId: userRes._id,
              auctionStatus: "STOPPED",
              isSold: false,
              isBuy: false,
            }
          );

          let notificationResUser = {
            userId: userRes._id,
            nftId: nftRes._id,
            orderId: orderUpdate._id,
            title: "NEW ORDER BUY",
            description: "You have buy a Order.",
            notificationType: "ORDER BUY",
          };
          await createNotification(notificationResUser);

          let notificationResOwner = {
            userId: orderRes.userId,
            nftId: nftRes._id,
            orderId: orderRes._id,
            title: "NEW ORDER SELL",
            description: `Your order is Successfully buy.`,
            notificationType: "ORDER SELL",
          };
          await createNotification(notificationResOwner);
          return res.json(
            new response(orderUpdate, responseMessage.SEND_ORDER)
          );
        } else if (userRes.userType == "User") {
          validatedBody.userId = userRes._id;
          validatedBody.nftId = orderRes.nftId;
          validatedBody.startingBid = orderRes.price;
          validatedBody.sellerId = orderRes.userId;
          validatedBody.isBuy = true;
          validatedBody.isSold = true;
          validatedBody.orderPlace = false;
          validatedBody.title = orderRes.title;
          validatedBody.time = orderRes.time;
          validatedBody.tokenId = orderRes.tokenId;
          validatedBody.details = orderRes.details;
          validatedBody.buyerId = userRes._id;
          await createOrder(validatedBody);
          let orderUpdate = await updateOrder(
            { _id: orderRes._id },
            {
              buyerId: userRes._id,
              isSold: true,
              isBuy: true,
              orderPlace: false,
              bidId: [],
            }
          );
          await updateAuctionNft(
            { _id: nftRes._id },
            { userId: userRes._id, orderPlace: false }
          );
          let obj = {
            userId: userResult._id,
            nftId: orderUpdate.nftId,
            orderId: orderUpdate._id,
            tokenId: orderUpdate.tokenId,
            currentOwner: userRes._id,
            previousOwner: userResult._id,
            title: "New order sell",
            type: "SELL",
            description: "NFT SELL ",
          };
          await nftHistoryModel(obj).save();
          await createTransaction({
            userId: validatedBody.userId,
            nftId: orderRes.nftId,
            nftUserId: validatedBody.sellerId,
            amount: validatedBody.price,
            transactionType: "Donation",
            coinName: "MAS",
          });
          await createTransaction({
            userId: validatedBody.userId,
            nftId: orderRes.nftId,
            nftUserId: validatedBody.sellerId,
            amount: validatedBody.price,
            transactionType: "Deposite",
            coinName: "MAS",
          });
          await updateAuctionNft(
            { _id: nftRes._id },
            {
              buyerId: userRes._id,
              auctionStatus: "STOPPED",
              isSold: false,
              isBuy: false,
            }
          );

          let notificationResUser = {
            userId: userRes._id,
            nftId: nftRes._id,
            orderId: orderUpdate._id,
            title: "NEW ORDER BUY",
            description: "You have buy a Order.",
            notificationType: "ORDER BUY",
          };
          await createNotification(notificationResUser);

          let notificationResOwner = {
            userId: orderRes.userId,
            nftId: nftRes._id,
            orderId: orderRes._id,
            title: "NEW ORDER SELL",
            description: `Your order is Successfully buy.`,
            notificationType: "ORDER SELL",
          };
          await createNotification(notificationResOwner);
          return res.json(
            new response(orderUpdate, responseMessage.SEND_ORDER)
          );
        }
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /order/cancelOrder:
   *   put:
   *     tags:
   *       - USER ORDER
   *     description: deleteOrder
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async cancelOrder(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var orderResult = await findOrder({
        _id: _id,
        isCancel: false,
        status: { $ne: status.DELETE },
      });
      if (!orderResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      var result = await updateOrder(
        { _id: orderResult._id },
        { isCancel: true, orderPlace: false }
      );
      await updateAuctionNft(
        { _id: result.nftId },
        { orderPlace: false },
        { $inc: { treandingNftCount: 0 } }
      );

      return res.json(new response(result, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new orderController();
