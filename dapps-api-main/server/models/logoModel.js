const Mongoose = require("mongoose");
const status = require("../enums/status");

const options = {
  Collection: "logo",
  timestamps: true,
};
const {Schema} = Mongoose;
const schemaDefination = new Schema(
  {
    logoImage: {
      type: String,
      default: "",
    },
    logoTitle: {
      type: String,
    },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

module.exports = Mongoose.model("logo", schemaDefination);
