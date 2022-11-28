const Mongoose = require("mongoose");
const status = require("../enums/status");

const options = {
  collection: "chat",
  timestamps: true,
};

const {Schema} = Mongoose;
const schemaDefination = new Schema(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      }
    ],
    clearStatus: { type: Boolean, default: false },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

module.exports = Mongoose.model("chat", schemaDefination);
