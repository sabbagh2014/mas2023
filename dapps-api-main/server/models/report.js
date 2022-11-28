const Mongoose = require("mongoose");
const status = require("../enums/status");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const options = {
  collection: "report",
  timestamps: true,
};

const {Schema} = Mongoose;
const schemaDefination = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "chatting",
    },
    actionApply: {
      type: Boolean,
      default: false,
    },
    reportStatus: {
      type: String,
      enum: ["PENDING", "RESOLVED"],
      default: "PENDING",
    },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

schemaDefination.plugin(mongoosePaginate);
schemaDefination.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("report", schemaDefination);
