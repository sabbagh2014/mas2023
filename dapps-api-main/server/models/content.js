const Mongoose = require("mongoose");
const status = require("../enums/status");

const options = {
  collection: "landing_content",
  timestamps: true,
};

const {Schema} = Mongoose;
const schemaDefination = new Schema(
  {
    type: { type: String },
    title: { type: String },
    description: { type: String },
    contentFile: { type: String },
    contents: [
      {
        heading: { type: String },
        contentDescription: { type: String },
      },
    ],
    status: { type: String, default: status.ACTIVE },
  },
  options
);

module.exports = Mongoose.model("landing_content", schemaDefination);
Mongoose.model("landing_content", schemaDefination).find({}, (err, result) => {
  if (err) {
    console.log("Default landing content error", err);
  } else if (result.length != 0) {
    console.log("Default landing content");
  } else {
    var obj = {
      type: "solution",
      title: "Our Solutions",
      contentFile:
        "https://res.cloudinary.com/mobiloittetech/image/upload/v1653894513/xrewqjkndvzeivupywqk.png",
      description:
        "The MAS platform takes the traditional instituons of patronage donations to the next level. In it , individuals that wish to support certain content creator (called cliens, can connect with those content creators (called MAS) and financially contribute with specific projects or make generic donations to specific creators. Unlike generic crowdfunding platforms, the MAS platform will enable and faster close and personal relationship.",
    };
    var obj2 = {
      type: "howItWorks",
      title: "How It Works",
      contentFile:
        "https://res.cloudinary.com/mobiloittetech/image/upload/v1653894556/mehbmf56lywah4lpbbar.png",
      description:
        "In the MAS platform, clients will be able to financially support MAS in two ways:",
      contents: [
        {
          heading: "Bundles",
          contentDescription:
            "MAS setup with 'bundles' specific prices and benefits and clients will be able to purchase those bundles",
        },
        {
          heading: "Generic Donations",
          contentDescription:
            "Clients can also make generic donations to MAS, in order to support all their projects and activites",
        },
        {
          heading: "NFT Auctions",
          contentDescription:
            "Clients will be able to buy NFT auctions of their desired MAS",
        },
      ],
    };

    Mongoose.model("landing_content", schemaDefination).create(
      obj,
      obj2,
      (contentErr, contentResult) => {
        if (contentErr) {
          console.log("Landing content error.", contentErr);
        } else {
          console.log("Landing content created.", contentResult);
        }
      }
    );
  }
});
