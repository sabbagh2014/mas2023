const express = require("express");
const Mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const morgan = require('morgan');
const cors = require("cors");
const auth = require("./helper/auth");

const firebase = require("firebase-admin");

var serviceAccount = require("./../firebase/mas-platform-c012-firebase-adminsdk-cs7u5-c3cb636533.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
});

const { chatServices } = require("./api/v1/services/chat");
const { messageServices } = require("./api/v1/services/message");
const { notificationServices } = require("./api/v1/services/notification");

const DepositController = require("./api/v1/controllers/blockchain/deposit");
const WithdrawCron = require("./cronJob/processAprrovedWithdrawals");
const DepositCron = require("./cronJob/processConfirmedDeposits");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});


class ExpressServer {
  constructor() {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.disable('etag');
    app.use(morgan('tiny'));
  }

  router(routes) {
    routes(app);
    return this;
  }

  configureDb(dbUrl) {
    return new Promise((resolve, reject) => {
      Mongoose.connect(
        dbUrl,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false
        },
        (err) => {
          if (err) {
            
            return reject(err);
          }
          

          return resolve(this);
        }
      );
    });
  }

  listen(port) {
    server.listen(port, () => {
      
    });
    return app;
  }
}

const socketLogin = async (socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    if (token) {
      const user = await auth.verifyTokenBySocket(token);
      if (user) {
        socket.userID = user._id;
        socket.userName = user.userName;
      }
    } else {
      return next(new Error("Please Login"));
    }
  } catch (err){
    return next(new Error("unauthorized"));
  }
  
  next();
}

io.use(socketLogin);


global.NotifySocket = io.of("/notifications");
NotifySocket.use(socketLogin);
NotifySocket.on("connection", async (socket) => {
  const user = socket.userID.toString();
  socket.join(user);
  let unread = await notificationServices.notificationList({
    userId: user,
    status: { $ne: 'DELETE' },
    isRead: false,
  });
  if(unread && unread.length > 0){
    NotifySocket.to(user).emit('notification', unread);
  }
  socket.on("error", (err) => {
    socket.disconnect();
  });
});

global.onlineUsers = new Map();

io.sockets.on("connection", async (socket) => {
  const user = socket.userID.toString();
  
  

  if (onlineUsers.has(user)) {
    onlineUsers.set(user, onlineUsers.get(user).add(socket.id));
  } else {
    onlineUsers.set(user, new Set([socket.id]));
    io.emit("notify", { onlineusers: [...onlineUsers.keys()] });
  }

  let joinChats = await chatServices.chatList(socket.userID, {});
  for (chat in joinChats) {
    socket.join(joinChats[chat]._id.toString())
  }

  socket.on("sendMsg", async (data) => {
    if (!socket.rooms.has(data.chat_id.toString())) {
      socket.join(data.chat_id.toString());
    }
    let msg = await messageServices.createMsg({
      chat: data.chat_id,
      sender: socket.userID,
      text: data.message,
      mediaType: data.mediaType || 'text'
    });
    io.to(data.chat_id).emit(data.chat_id, msg);
  });

  socket.on("ping", () => {
    io.to(socket.id).emit("notify", { onlineusers: [...onlineUsers.keys()] });
  });

  socket.on("disconnecting", () => {
     // the Set contains at least the socket ID
  });

  socket.on("disconnect", async () => {
    
    onlineUsers.get(user).delete(socket.id);
    if (onlineUsers.get(user).size == 0) {
      onlineUsers.delete(user);
      io.emit("notify", { onlineusers: [...onlineUsers.keys()] });
    }
    
  });

  socket.on("error", (err) => {
    socket.disconnect();
  });

});

WithdrawCron.start();
DepositCron.start();
DepositController.start();

module.exports = ExpressServer;
