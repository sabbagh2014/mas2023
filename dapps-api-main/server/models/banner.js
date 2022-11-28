const Mongoose = require("mongoose");
const status = require("../enums/status");
const mongoosePaginate = require("mongoose-paginate");

const options = {
  collection: "banners",
  timestamps: true,
};

const {Schema} = Mongoose;
const schemaDefination = new Schema(
  {
    title: { type: String },
    description: { type: String },
    url: { type: String },
    media: { type: String },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: 'image',
    },
    background: {type: String},
    backgroundType: {
      type: String,
      enum: ["image", "video"],
      default: 'image',
    },
    status: { type: String, default: status.ACTIVE },
  },
  options
);
schemaDefination.plugin(mongoosePaginate);
module.exports = Mongoose.model("banner", schemaDefination);
