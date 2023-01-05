const Mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const status = require("../enums/status");
const options = {
  collection: "fee",
  timestamps: true,
};


const {Schema} = Mongoose;
const feeSchema = new Schema(
  {
    planType: {
      type: String,
    },
    masHeld: {
      type: Number,
    },
    contentCreatorFee: { type: Number },
    clientFee: { type: Number },
    status: { type: String, default: status.ACTIVE },
  },
  options
);
feeSchema.plugin(mongoosePaginate);
feeSchema.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("fee", feeSchema);

Mongoose.model("fee", feeSchema).find(
  { status: { $ne: status.DELETE } },
  async (err, result) => {
    if (err) {
      
    } else if (result.length != 0) {
      
    } else {
      let obj1 = {
        planType: "Basic",
        masHeld: 0,
        contentCreatorFee: 3,
        clientFee: 0,
      };
      let obj2 = {
        planType: "Silver",
        masHeld: 100,
        contentCreatorFee: 2.5,
        clientFee: 0,
      };
      let obj3 = {
        planType: "Gold",
        masHeld: 250,
        contentCreatorFee: 2,
        clientFee: 0,
      };
      let obj4 = {
        planType: "Diamond",
        masHeld: 1500,
        contentCreatorFee: 1.5,
        clientFee: 0,
      };
      let obj5 = {
        planType: "Mas Plus",
        masHeld: 10000,
        contentCreatorFee: 1,
        clientFee: 0,
      };
      Mongoose.model("fee", feeSchema).create(
        obj1,
        obj2,
        obj3,
        obj4,
        obj5,
        (err1, staticResult) => {
          if (err1) {
            
          } else {
            
          }
        }
      );
    }
  }
);
