const Config = require("config");
const Routes = require("./routes");
const Server = require("./server");

const dbUrl = `mongodb://${Config.get("databaseHost")}:${Config.get("databasePort")}/${Config.get("databaseName")}`;
const server = new Server()
  .router(Routes)
  .configureDb(dbUrl)
  .then((_server) => _server.listen(Config.get("port")));

module.exports = server;
