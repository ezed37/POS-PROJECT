import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
  },
  product_name: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  cost_price: {
    type: Number,
    required: true,
  },
  selling_price: {
    type: Number,
    required: true,
  },
});

const salesSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
    },

    reference: {
      type: String,
      default: "",
    },

    payment_type: {
      type: String,
      enum: ["card", "cash", "mobile"],
      default: "cash",
    },

    sub_total: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    final_total: {
      type: Number,
      required: true,
    },

    items: {
      type: [itemSchema],
      required: true,
    },
  },
  { timestamps: true }
);

const Sales = mongoose.model("sales", salesSchema);
export default Sales;
