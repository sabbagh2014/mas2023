const Express = require("express");
const controller = require("./controller");
const auth = require("../../../../helper/auth");
const upload = require("../../../../helper/uploadHandler");

module.exports = Express.Router()

  .get("/content", controller.viewContent)
  .get("/landingContentList", controller.landingContentList)

  .use(upload.uploadFile)
  .post("/uploadFile", controller.uploadFile)

  .use(auth.verifyToken)
  .put("/content", controller.editContent);
