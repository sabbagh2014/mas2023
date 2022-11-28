const Express = require("express");
const controller = require("./controller");
const auth = require("../../../../helper/auth");

module.exports = Express.Router()
  .use(auth.verifyToken)
  .post("/withdraw", controller.withdraw)
