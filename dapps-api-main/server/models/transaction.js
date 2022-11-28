const Mongoose = require("mongoose");
const status = require("../enums/status");
const mongoosePaginate = require("mongoose-paginate");
const { boolean } = require("joi");

const options = {
  collection: "transactions",
  timestamps: true,
};

const {Schema} = Mongoose;
const schemaDefination = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    nftId: {
      type: Schema.Types.ObjectId,
      ref: "nft",
    },
    nftUserId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    referrarId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    toDonationUser: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    amount: { type: Number },
    fromAddress: { type: String },
    recipientAddress: { type: String },
    adminCommission: { type: Number },
    transactionHash: { type: String, index: true, unique: true, sparse: true },
    retriesIfFailed: { type: Number },
    coinName: { type: String },
    transactionStatus: {
      type: String,
      enum: ["PROCESSING", "APPROVED", "PENDING", "SUCCESS", "FAILED"],
      default: "PROCESSING",
    },
    transactionType: { type: String },
    email_security_verification: {type:Boolean, default:false},
    sms_security_verification: {type:Boolean, default:false},
    status: { type: String, default: status.ACTIVE },
  },
  options
);

schemaDefination.plugin(mongoosePaginate);
module.exports = Mongoose.model("transaction", schemaDefination);
