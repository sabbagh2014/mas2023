const Express = require("express");
const controller = require("./controller");
const auth = require("../../../../helper/auth");
const upload = require("../../../../helper/uploadHandler");

module.exports = Express.Router()

  .get("/allListOrder", controller.allListOrder)

  .use(auth.verifyToken)
  .get("/order/:_id", controller.viewOrder)
  .put("/order", controller.editOrder)
  .delete("/order", controller.deleteOrder)
  .get("/listOrder", controller.listOrder)
  .get("/soldOrderList", controller.soldOrder)
  .get("/buyOrderList", controller.buyOrder)
  .put("/cancelOrder", controller.cancelOrder)

  .post("/order", controller.createOrder)

  .post("/sendOrderToUser", controller.sendOrderToUser)

  .use(upload.uploadFile);
