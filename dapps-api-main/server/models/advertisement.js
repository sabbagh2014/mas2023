const Mongoose = require("mongoose");
const status = require("../enums/status");
const mongoosePaginate = require("mongoose-paginate");

const options = {
  collection: "advertisement",
  timestamps: true,
};

const {Schema} = Mongoose;
const schemaDefination = new Schema(
  {
    title: { type: String },
    image: { type: String },
    mediaType: {
      type: String,
      enum: ["image", "video"],
    },
    startDate: { type: Date },
    endDate: { type: Date },
    url: { type: String },
    status: { type: String, default: status.ACTIVE },
  },
  options
);
schemaDefination.plugin(mongoosePaginate);
module.exports = Mongoose.model("advertisement", schemaDefination);
