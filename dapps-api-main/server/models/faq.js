const Mongoose = require("mongoose");
const status = require("../enums/status");

const options = {
  collection: "faq",
  timestamps: true,
};

const {Schema} = Mongoose;
const schemaDefination = new Schema(
  {
    question: { type: String },
    answer: { type: String },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

module.exports = Mongoose.model("faq", schemaDefination);
