const Express = require("express");
const controller = require("./controller");
const auth = require("../../../../helper/auth");
const upload = require("../../../../helper/uploadHandler");

module.exports = Express.Router()

  .use(auth.verifyToken)
  .get("/list", controller.getUserChats)
  .post("/init", controller.initChat) // return chat id if not found create one
  .get("/view/:chatId", controller.viewChat)
  .post("/read/", controller.readChat)
  .use(upload.uploadFile)
  .post("/uploadFile", controller.uploadFile);
