const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DailySaleSchema = new Schema({
  date: {
    type: String, // keep as string since your form posts yyyy-mm-dd
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  soldQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  // store a reference to the MemberModel
  staff: {
    type: Schema.Types.ObjectId,
    ref: "MemberModel",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("DailySale", DailySaleSchema);
