const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const schema = mongoose.Schema;
var userActivityModel = new schema(
  {
    userId: {
      type: schema.Types.ObjectId,
      ref: "users",
    },
    nftId: {
      type: schema.Types.ObjectId,
      ref: "nft",
    },
    bidId: {
      type: schema.Types.ObjectId,
      ref: "bid",
    },
    storyId: {
      type: schema.Types.ObjectId,
      ref: "story",
    },
    collectionId: {
      type: schema.Types.ObjectId,
      ref: "collection",
    },
    auctionNftId: {
      type: schema.Types.ObjectId,
      ref: "auctionNft",
    },
    orderId: {
      type: schema.Types.ObjectId,
      ref: "order",
    },
    trackingId: {
      type: schema.Types.ObjectId,
      ref: "tracking",
    },
    ratingModel: {
      type: schema.Types.ObjectId,
      ref: "rating",
    },
    title: {
      type: String,
    },
    price: {
      type: String,
    },
    desctiption: {
      type: String,
    },
    type: {
      type: String,
    },
    previousOwner: {
      type: schema.Types.ObjectId,
      ref: "users",
    },
    currentOwner: {
      type: String,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "BLOCK", "DELETE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

userActivityModel.plugin(mongoosePaginate);
module.exports = mongoose.model("userActivity", userActivityModel);
