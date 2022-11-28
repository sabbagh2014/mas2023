const Express = require("express");
const controller = require("./controller");

module.exports = Express.Router()

  .post("/staticContent", controller.addStaticContent)
  .get("/staticContent", controller.viewStaticContent)
  .put("/staticContent", controller.editStaticContent)
  .get("/staticContentList", controller.staticContentList);
