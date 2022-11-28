const Joi = require("joi");
const apiError = require("../../../../helper/apiError");
const response = require("../../../../../assets/response");
const responseMessage = require("../../../../../assets/responseMessage");
const { userServices } = require("../../services/user");
const { notificationServices } = require("../../services/notification");

const { findUser } = userServices;
const {
  findNotification,
  updateNotification,
  multiUpdateNotification,
  notificationList,
} = notificationServices;

const status = require("../../../../enums/status");

class notificationController {

  async read(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var notificationResult = await findNotification({
        _id: _id,
        userId: userResult._id,
        status: { $ne: status.DELETE },
      });
      if (!notificationResult) {
        return apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      notificationResult.isRead = true;
      await notificationResult.save();
      return res.json(
        new response(notificationResult, responseMessage.DETAILS_FETCHED)
      );
    } catch (error) {
      return next(error);
    }
  }

  async remove(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      
      var result = await updateNotification(
        { 
          _id: _id, 
          userId: userResult._id,
        },
        { status: status.DELETE }
      );
      return res.json(new response(result, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  async list(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await notificationList({
        userId: userResult._id,
        status: { $ne: status.DELETE },
      });
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  async markAllRead(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var result = await multiUpdateNotification(
        { userId: userResult._id, isRead: false },
        { isRead: true }
      );
      return res.json(new response(result, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new notificationController();
