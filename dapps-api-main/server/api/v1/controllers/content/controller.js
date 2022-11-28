const Joi = require("joi");
const response = require("../../../../../assets/response");
const responseMessage = require("../../../../../assets/responseMessage");
const { contentServices } = require("../../services/content");
const { findContent, updateContent, contentList } = contentServices;
const commonFunction = require("../../../../helper/util");

class contentController {
  /**
   * @swagger
   * /content/content:
   *   get:
   *     tags:
   *       - CONTENT
   *     description: viewContent
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: type
   *         description: type-talent/solution/howItWorks
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async viewContent(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
      type: Joi.string().valid("solution", "howItWorks").required(),
    };
    try {
      const validBody = await Joi.validate(req.query, validationSchema);
      var result = await findContent(validBody);
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /content/content:
   *   put:
   *     tags:
   *       - CONTENT
   *     description: editContent
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: editContent
   *         description: editContent
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/editContent'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async editContent(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      contentFile: Joi.string().optional(),
      contents: Joi.array().items(
        Joi.object().keys({
          heading: Joi.string().required(),
          contentDescription: Joi.string().required(),
        })
      ).optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);
      var result = await updateContent(
        { _id: validatedBody._id },
        validatedBody
      );
      return res.json(new response(result, responseMessage.UPDATE_SUCCESS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /content/landingContentList:
   *   get:
   *     tags:
   *       - CONTENT
   *     description: landingContentList
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async landingContentList(req, res, next) {
    try {
      var result = await contentList();
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /content/uploadFile:
   *   post:
   *     tags:
   *       - CONTENT
   *     description: uploadFile
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: file
   *         description: file
   *         in: formData
   *         required: true
   *         type: file
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async uploadFile(req, res, next) {
    try {
      let result = await commonFunction.getImageUrl(req.files);
      return res.json(new response(result, responseMessage.UPLOAD_SUCCESS));
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new contentController();
