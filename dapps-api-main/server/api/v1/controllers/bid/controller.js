const Joi = require("joi");
const apiError = require("../../../../helper/apiError");
const response = require("../../../../../assets/response");
const responseMessage = require("../../../../../assets/responseMessage");
const { userServices } = require("../../services/user");
const { orderServices } = require("../../services/order");
const { bidServices } = require("../../services/bid");

const { findUser, findUserData, updateUser } = userServices;
const { findOrder, updateOrder } = orderServices;
const { createBid, findBid, updateBid, updateManyBid, bidList } = bidServices;

const commonFunction = require("../../../../helper/util");
const status = require("../../../../enums/status");

class bidController {
  /**
   * @swagger
   * /bid/bid:
   *   post:
   *     tags:
   *       - USER BID
   *     description: createBid
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: createBid
   *         description: createBid
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/createBid'
   *     responses:
   *       creatorAddress: Joi.string().optional(),
   *       200:
   *         description: Returns success message
   */

  async createBid(req, res, next) {
    const validationSchema = {
      orderId: Joi.string().required(),
      name: Joi.string().optional(),
      bid: Joi.string().optional(),
      date: Joi.string().optional(),
      statues: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);
      let userResult = await findUserData({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let orderCheck = await findOrder({
        _id: validatedBody.orderId,
        status: { $ne: status.DELETE },
      });
      if (!orderCheck) {
        throw apiError.conflict(responseMessage.ORDER_NOT_FOUND);
      }
      validatedBody.userId = userResult._id;
      validatedBody.nftId = orderCheck.nftId;
      await updateManyBid(validatedBody.orderId);
      var result = await createBid(validatedBody);
      await updateOrder(
        { _id: orderCheck._id },
        {
          $addToSet: { bidId: result._id },
          $set: { lastBidder: userResult._id },
        }
      );
      await updateUser(
        { _id: userResult._id },
        { $inc: { masBalance: -Number(validatedBody.bid) } }
      );
      return res.json(new response(result, responseMessage.BID_ADDED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /bid/bid/{_id}:
   *   get:
   *     tags:
   *       - USER BID
   *     description: viewBid
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

  async viewBid(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var bidResult = await findBid({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!bidResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(bidResult, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /bid/bid:
   *   put:
   *     tags:
   *       - USER BID
   *     description: editBid
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: editBid
   *         description: editBid
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/editBid'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async editBid(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
      name: Joi.string().optional(),
      bid: Joi.string().optional(),
      date: Joi.string().optional(),
      statues: Joi.string().optional(),
    };
    try {
      var validatedBody = await Joi.validate(req.body, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      if (req.files.length != 0) {
        validatedBody.mediaUrl = await commonFunction.getImageUrl(req.files);
      }
      var bidResult = await findBid({
        _id: validatedBody._id,
        status: { $ne: status.DELETE },
      });
      if (!bidResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      var result = await updateBid({ _id: bidResult._id }, validatedBody);
      return res.json(new response(result, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /bid/bid:
   *   delete:
   *     tags:
   *       - USER BID
   *     description: deleteBid
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

  async deleteBid(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var bidResult = await findBid({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!bidResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      var result = await updateBid(
        { _id: bidResult._id },
        { status: status.DELETE }
      );
      return res.json(new response(result, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /bid/acceptBid:
   *   get:
   *     tags:
   *       - USER BID
   *     description: acceptBid
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

  async acceptBid(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validationSchema);
      let userResult = await findUserData({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var bidResult = await findBid({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!bidResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      var result = await updateBid(
        { _id: bidResult._id },
        { bidStatus: "ACCEPTED" }
      );
      return res.json(new response(result, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /bid/rejectBid:
   *   put:
   *     tags:
   *       - USER BID
   *     description: rejectBid
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

  async rejectBid(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var bidResult = await findBid({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!bidResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      var result = await updateBid(
        { _id: bidResult._id },
        { bidStatus: "REJECTED" }
      );
      return res.json(new response(result, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /bid/listBid:
   *   get:
   *     tags:
   *       - USER BID
   *     description: listBid
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: orderId
   *         description: orderId
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async listBid(req, res, next) {
    const validationSchema = {
      orderId: Joi.string().required(),
    };
    try {
      const { orderId } = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await bidList({
        orderId: orderId,
        status: { $ne: status.DELETE },
      });
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /bid/myBid:
   *   get:
   *     tags:
   *       - USER BID
   *     description: myBid
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

  async myBid(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await bidList({
        userId: userResult._id,
        status: { $ne: status.DELETE },
      });
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new bidController();
