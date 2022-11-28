const Mongoose = require("mongoose");
const status = require("../enums/status");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const options = {
  collection: "order",
  timestamps: true,
};

const {Schema} = Mongoose;
const schemaDefination = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    nftId: {
      type: Schema.Types.ObjectId,
      ref: "auctionNft",
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
    lastBidder: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    // auctionNftId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'auctionNft'
    // },
    title: {
      type: String,
    },
    mediaUrl: {
      type: String,
    },
    mediaType: {
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
    duration: {
      type: String,
    },
    startingBid: {
      type: String,
    },
    orderPlace: {
      type: Boolean,
      default: false,
    },
    isSold: {
      type: Boolean,
      default: false,
    },
    isBuy: {
      type: Boolean,
      default: false,
    },
    isCancel: {
      type: Boolean,
      default: false,
    },
    isExport: {
      type: Boolean,
      default: false,
    },
    exportedWalletAddress: {
      type: String,
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
module.exports = Mongoose.model("order", schemaDefination);
