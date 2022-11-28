const Express = require("express");
const controller = require("./controller");

module.exports = Express.Router()

  .get("/subscriptionPlanList", controller.subscriptionPlanList)
  .post("/plan", controller.choosePlan)
  .get("/plan/:_id", controller.viewPlan)
  .put("/plan", controller.editPlan)
  .delete("/plan", controller.deletePlan)
  .get("/listPlan", controller.listPlan);
