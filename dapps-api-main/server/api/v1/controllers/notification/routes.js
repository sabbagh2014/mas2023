const Express = require("express");
const controller = require("./controller");
const auth = require("../../../../helper/auth");

module.exports = Express.Router()

  .use(auth.verifyToken)
  .get("/read/:_id", controller.read)
  .delete("/remove", controller.remove)
  .get("/list", controller.list)
  .get("/markAllRead", controller.markAllRead);
