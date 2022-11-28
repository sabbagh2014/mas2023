const Mongoose = require("mongoose");
const status = require("../enums/status");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const options = {
  collection: "collection",
  timestamps: true,
};

const {Schema} = Mongoose;
const schemaDefination = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    contractAddress: {
      type: String,
    },
    name: {
      type: String,
    },
    symbol: {
      type: String,
    },
    baseURI: {
      type: String,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    categoryType: {
      type: String,
    },
    collectionType: {
      type: String,
      enum: ["DEFAULT", "REGULAR"],
      default: "REGULAR",
    },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

schemaDefination.plugin(mongoosePaginate);
schemaDefination.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("collection", schemaDefination);

Mongoose.model("collection", schemaDefination).find(
  { collectionType: "DEFAULT" },
  (err, result) => {
    if (err) {
      console.log("Default static collection error", err);
    } else if (result.length != 0) {
      console.log("Default static collection");
    } else {
      var obj = {
        contractAddress: "0xb5de0c3753b6e1b4dba616db82767f17513e6d4e",
        name: "WETH",
        symbol: "WETH",
        baseURI: "test data",
        image:
          "https://i.picsum.photos/id/319/200/300.jpg?hmac=-xZWQr-2igun1QhUD5zoRCQKvRl7bjB_gIbQuv26oj0",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        collectionType: "DEFAULT",
      };
      Mongoose.model("collection", schemaDefination).create(
        obj,
        (err1, staticResult) => {
          if (err1) {
            console.log("Static collection error.", err1);
          } else {
            console.log("Static collection created.", staticResult);
          }
        }
      );
    }
  }
);
