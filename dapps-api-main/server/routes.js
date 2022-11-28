const user = require("./api/v1/controllers/users/routes");
const admin = require("./api/v1/controllers/admin/routes");
const staticContent = require("./api/v1/controllers/static/routes");
const nft = require("./api/v1/controllers/nft/routes");
const order = require("./api/v1/controllers/order/routes");
const bid = require("./api/v1/controllers/bid/routes");
const notification = require("./api/v1/controllers/notification/routes");
const chat = require("./api/v1/controllers/chat/routes");
const plan = require("./api/v1/controllers/plan/routes");
const blockchain = require("./api/v1/controllers/blockchain/routes");
const content = require("./api/v1/controllers/content/routes");

module.exports = function routes(app) {
  app.use("/api/v1/user", user);
  app.use("/api/v1/admin", admin);
  app.use("/api/v1/static", staticContent);
  app.use("/api/v1/nft", nft);
  app.use("/api/v1/order", order);
  app.use("/api/v1/bid", bid);
  app.use("/api/v1/notification", notification);
  app.use("/api/v1/chat", chat);
  app.use("/api/v1/plan", plan);
  app.use("/api/v1/blockchain", blockchain);
  app.use("/api/v1/content", content);

  return app;
};
