const Mongoose = require("mongoose");
const status = require("../enums/status");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const options = {
  collection: "auctionNft",
  timestamps: true,
};

const {Schema} = Mongoose;
const schemaDefination = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    likesUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    orderId: {
      type: Schema.Types.ObjectId,
      ref: "order",
    },
    bidId: [
      {
        type: Schema.Types.ObjectId,
        ref: "bid",
      },
    ],
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
    },
    mediaType: {
      type: String,
    },
    mediaUrl: {
      type: String,
    },
    details: {
      type: String,
    },
    time: {
      type: String,
    },
    tokenId: {
      type: String,
    },
    tokenName: {
      type: String,
    },
    network: {
      type: String,
    },
    startingBid: {
      type: String,
    },
    orderPlace: {
      type: Boolean,
      default: false,
    },
    treandingNftCount: {
      type: Number,
      default: 0,
    },
    isSold: {
      type: Boolean,
      default: false,
    },
    isBuy: {
      type: Boolean,
      default: false,
    },
    auctionStatus: {
      type: String,
      enum: ["RUNNING", "STOPPED"],
      default: "RUNNING",
    },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

schemaDefination.plugin(mongoosePaginate);
schemaDefination.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("auctionNft", schemaDefination);
