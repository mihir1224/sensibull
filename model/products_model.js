const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
  {
    success: Boolean,
    payload: {
      identifier: String,
      symbol: {
        type: String,
        minlength: 3,
      },
      quantity: Number,
      filled_quantity: Number,
      order_status: String,
    },
  },
  { versionKey: false }
);
module.exports = mongoose.model("products", productsSchema);
