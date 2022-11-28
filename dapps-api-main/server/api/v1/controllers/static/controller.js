const Joi = require("joi");
const response = require("../../../../../assets/response");
const responseMessage = require("../../../../../assets/responseMessage");
const { staticServices } = require("../../services/static");
const {
  createStaticContent,
  findStaticContent,
  updateStaticContent,
  staticContentList,
} = staticServices;

class staticController {
  /**
   * @swagger
   * /static/staticContent:
   *   post:
   *     tags:
   *       - STATIC
   *     description: addStaticContent
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: addStaticContent
   *         description: addStaticContent
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/addStaticContent'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async addStaticContent(req, res, next) {
    const validationSchema = {
      type: Joi.string()
        .valid("termsConditions", "privacyPolicy", "aboutUs", "contactUs")
        .required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);
      const { type, title, description } = validatedBody;
      var result = await createStaticContent({
        type: type,
        title: title,
        description: description,
      });
      return res.json(new response(result, responseMessage.CMS_SAVED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /static/staticContent:
   *   get:
   *     tags:
   *       - STATIC
   *     description: viewStaticContent
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: type
   *         description: type
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async viewStaticContent(req, res, next) {
    const validationSchema = {
      type: Joi.string()
        .valid(
          "termsConditions",
          "privacyPolicy",
          "aboutUs",
          "contactUs",
          "metaverse",
          "company",
          "riskDisclosure",
          "kycProgram"
        )
        .required(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      var result = await findStaticContent({ type: validatedBody.type });
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /static/staticContent:
   *   put:
   *     tags:
   *       - STATIC
   *     description: editStaticContent
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: editStaticContent
   *         description: editStaticContent
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/editStaticContent'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async editStaticContent(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
      title: Joi.string().optional(),
      description: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);
      var result = await updateStaticContent(
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
   * /static/staticContentList:
   *   get:
   *     tags:
   *       - STATIC
   *     description: staticContentList
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async staticContentList(req, res, next) {
    try {
      var result = await staticContentList();
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new staticController();
