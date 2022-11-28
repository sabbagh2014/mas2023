const config = require("config");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const apiError = require("./apiError");
const responseMessage = require("../../assets/responseMessage");
const response =        require("../../assets/response");
 
module.exports = {
  verifyToken: async (req, res, next) => {
    try {
      if (req.headers.token) {
        let result = jwt.verify(
          req.headers.token,
          config.get("jwtsecret")
        );
        if (result) {
          let user = await userModel.findOne({ _id: result.id });
          if (!user) {
            return apiError.notFound(responseMessage.USER_NOT_FOUND);
          } else {
              if(user.status === 'BLOCK' || user.blockStatus === true){
                return res.status(403).json(new response({},responseMessage.BLOCKED_NOT_ALLOWED));
              }
              req.userId = result.id;
              req.userDetails = result;
              next();
          }
        } 
      } else {
          return res.send(apiError.badRequest(responseMessage.NO_TOKEN));
      }
    } catch (error) {
      return next(error);
    }
  },

  verifyTokenBySocket: (token) => {
    return new Promise((resolve, reject) => {
      try {
        if (token) {
          jwt.verify(token, config.get("jwtsecret"), (err, result) => {
            if (err) {
              reject(err);
            } else {
              userModel.findOne({ _id: result.id }, (error, user) => {
                if (error)
                  reject(responseMessage.INTERNAL_ERROR);
                else if (!user) {
                  reject(responseMessage.USER_NOT_FOUND);
                } else {
                  if (user.status == "BLOCK") {
                    reject(responseMessage.BLOCK_BY_ADMIN);
                  } else if (user.status == "DELETE") {
                    reject(responseMessage.DELETE_BY_ADMIN);
                  } else {
                    resolve(user);
                  }
                }
              });
            }
          });
        } else {
          reject(responseMessage.NO_TOKEN);
        }
      } catch (e) {
        reject(e);
      }
    });
  },
};
