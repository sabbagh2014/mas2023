const apiError = require("../../../../helper/apiError");
const response = require("../../../../../assets/response");
const commonFunction = require("../../../../helper/util");
const responseMessage = require("../../../../../assets/responseMessage");
const { userServices } = require("../../services/user");
const { chatServices } = require("../../services/chat");
const { messageServices } = require("../../services/message");
const chatModel = require("../../../../models/chat");
const { createChat, findChat, chatList } = chatServices;
const { messageList, readMsg } = messageServices;
const { findUser } = userServices;
const mongoose = require("mongoose");
const Joi = require("joi");

const status = require("../../../../enums/status");
const userType = require("../../../../enums/userType");


class chatController {

  async getUserChats(req, res, next){

    const validationSchema = {
      page: Joi.number().optional().default(1),
      limit: Joi.number().optional().default(50),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      const userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let result = await chatList(userResult._id, validatedBody);
      if(!result || result.length == 0){
        let admin = await findUser({ userType: userType.ADMIN });
        let users = [
          mongoose.Types.ObjectId(userResult._id),
          mongoose.Types.ObjectId(admin._id)
        ];
        result = await createChat({ users: users});
        if (result) {
          result = [result];
        }
      }
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }

  }

  async viewChat(req, res, next) {
    const validationSchema = {
      page: Joi.number().optional().default(0),
      limit: Joi.number().optional().default(50),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      const result = await messageList(req.params.chatId , validatedBody);

      if (result.length == 0) {
        return res.json(new response(result, responseMessage.DATA_FOUND));
      } else {
        return res.json(new response(result, responseMessage.DATA_NOT_FOUND));
      }
    } catch (error) {
      return next(error);
    }
  }

  async initChat(req, res, next) {
    const validationSchema = {
      user: Joi.string().required(),
    };
    try {
      const {user} = await Joi.validate(req.body, validationSchema);

      const userResult = await findUser({ _id: user });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let query = { status: status.ACTIVE, users: { $all: [req.userId, user] }};

      let result = await findChat(query);

      if (!result) {
        result = await createChat({ users: [req.userId, user]});
      }

      return res.json(new response(result, responseMessage.DATA_FOUND));

    } catch (error) {
      return next(error);
    }

  }

  async readChat(req, res, next) {
    try {
      const userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let chatResult = await chatModel.findOne({
        _id: req.body.chat,
        status: { $ne: status.DELETE },
      });

      if (!chatResult) {
        return res.json(apiError.notFound(responseMessage.DATA_NOT_FOUND));
      }

      

      await readMsg(req.body.ids.split(","));


      return res.status(201).json(new response({}, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  async uploadFile(req, res, next) {
    try {
      let result = await commonFunction.getImageUrl(req.files);
      return res.json(new response(result, responseMessage.UPLOAD_SUCCESS));
    } catch (error) {
      return next(error);
    }
  }

}

module.exports = new chatController();
