const config = require("config");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: config.get("cloudinary.cloud_name"),
  api_key: config.get("cloudinary.api_key"),
  api_secret: config.get("cloudinary.api_secret"),
});

const ethers = require('ethers');

module.exports = {

  generateETHWallet() {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address.toLowerCase(),
      privateKey: wallet.privateKey
    }
  },
 
  getReferralCode() {
    var x = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 8; i++) {
      x += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return x;
  },

  getToken: async (payload) => {
    var token = await jwt.sign(payload, config.get("jwtsecret"), {
      expiresIn: "24h",
    });
    return token;
  },

  getImageUrl: async (files) => {
    var result = await cloudinary.v2.uploader.upload(files[0].path, {
      resource_type: "auto",
    });
    return result.secure_url;
  },

  getSecureUrl: async (base64) => {
    var result = await cloudinary.v2.uploader.upload(base64);
    return result.secure_url;
  },

};