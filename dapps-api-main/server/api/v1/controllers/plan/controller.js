const Joi = require("joi");
const apiError = require("../../../../helper/apiError");
const response = require("../../../../../assets/response");
const responseMessage = require("../../../../../assets/responseMessage");
const { userServices } = require("../../services/user");
const { subscriptionServices } = require("../../services/subscription");
const { planServices } = require("../../services/plan");

const {
  findUser,
} = userServices;
const {
  findSubscription,
  subscriptionList,
} = subscriptionServices;
const { createPlan, findPlan, updatePlan, planList } = planServices;

const commonFunction = require("../../../../helper/util");
const status = require("../../../../enums/status");

class planController {
  /**
   * @swagger
   * /plan/subscriptionPlanList:
   *   get:
   *     tags:
   *       - USER PLAN
   *     description: subscriptionPlanList
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

  async subscriptionPlanList(req, res, next) {
    try {
      var result = await subscriptionList({ status: { $ne: status.DELETE } });
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /plan/plan:
   *   post:
   *     tags:
   *       - USER PLAN
   *     description: choosePlan
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: choosePlan
   *         description: choosePlan
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/choosePlan'
   *     responses:
   *       creatorAddress: Joi.string().optional(),
   *       200:
   *         description: Returns success message
   */

  async choosePlan(req, res, next) {
    const validationSchema = {
      subscriptionId: Joi.string().required(),
      planType: Joi.string().optional(),
      planName: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let subscriptionCheck = await findSubscription({
        _id: validatedBody.subscriptionId,
        orderPlace: false,
        status: { $ne: status.DELETE },
      });
      if (!subscriptionCheck) {
        throw apiError.conflict(responseMessage.SUBSCRIPTION_NOT_FOUND);
      }
      validatedBody.userId = userResult._id;
      validatedBody.subscriptionId = subscriptionCheck._id;
      var result = await createPlan(validatedBody);
      return res.json(new response(result, responseMessage.PLAN_ADDED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /plan/plan/{_id}:
   *   get:
   *     tags:
   *       - USER PLAN
   *     description: viewPlan
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

  async viewPlan(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var planResult = await findPlan({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!planResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(
        new response(planResult, responseMessage.DETAILS_FETCHED)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /plan/plan:
   *   put:
   *     tags:
   *       - USER PLAN
   *     description: editPlan
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: editPlan
   *         description: editPlan
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/editPlan'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async editPlan(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
      planType: Joi.string().optional(),
      planName: Joi.string().optional(),
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
      var planResult = await findPlan({
        _id: validatedBody._id,
        status: { $ne: status.DELETE },
      });
      if (!planResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      var result = await updatePlan({ _id: planResult._id }, validatedBody);
      return res.json(new response(result, responseMessage.UPDATE_SUCCESS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /plan/plan:
   *   delete:
   *     tags:
   *       - USER PLAN
   *     description: deletePlan
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

  async deletePlan(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var planResult = await findPlan({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!planResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      var result = await updatePlan(
        { _id: planResult._id },
        { status: status.DELETE }
      );
      return res.json(new response(result, responseMessage.DELETE_SUCCESS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /plan/listPlan:
   *   get:
   *     tags:
   *       - USER PLAN
   *     description: listPlan
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

  async listPlan(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await planList({
        userId: userResult._id,
        status: { $ne: status.DELETE },
      });
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new planController();
