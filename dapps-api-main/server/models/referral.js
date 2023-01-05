const Mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const status = require("../enums/status");
const options = {
  collection: "referral",
  timestamps: true,
};

const {Schema} = Mongoose;
const referralSchema = new Schema(
  {
    referralAmount: {
      type: Number,
    },
    refereeAmount: {
      type: Number,
    },
    coin: { type: String },
    status: { type: String, default: status.ACTIVE },
  },
  options
);
referralSchema.plugin(mongoosePaginate);
referralSchema.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("referral", referralSchema);

Mongoose.model("referral", referralSchema).find(
  { status: { $ne: status.DELETE } },
  async (err, result) => {
    if (err) {
      
    } else if (result.length != 0) {
      
    } else {
      let obj = {
        coin: "MAS",
        referralAmount: 100,
        refereeAmount: 50,
      };
      Mongoose.model("referral", referralSchema).create(
        obj,
        (err1, staticResult) => {
          if (err1) {
            
          } else {
            
          }
        }
      );
    }
  }
);
