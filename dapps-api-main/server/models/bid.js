const Mongoose = require("mongoose");
const status = require("../enums/status");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const options = {
  collection: "bid",
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
      ref: "nft",
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "order",
    },
    name: {
      type: String,
    },
    bid: {
      type: String,
    },
    date: {
      type: String,
    },
    statues: {
      type: String,
    },
    bidStatus: {
      type: String,
      enum: ["ACCEPTED", "REJECTED"],
      default: "ACCEPTED",
    },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

schemaDefination.plugin(mongoosePaginate);
schemaDefination.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("bid", schemaDefination);
