const Mongoose = require("mongoose");
const status = require("../enums/status");

const options = {
  collection: "donation",
  timestamps: true,
};

const {Schema} = Mongoose;
const schemaDefination = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    masBalance: { type: Number, default: 0 },
    usdtBalance: { type: Number, default: 0 },
    bnbBalance: { type: Number, default: 0 },
    busdBalance: { type: Number, default: 0 },
    history: [
      {
        senderUserId: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        message: { type: String },
        amount: { type: Number },
        transactionHash: { type: String },
        coinName: { type: String },
      },
    ],
    certificateNumber: { type: String },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

module.exports = Mongoose.model("donation", schemaDefination);
