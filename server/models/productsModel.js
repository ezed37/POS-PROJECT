import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    barcode: {
      type: String,
    },
    product_name: {
      type: String,
      required: true,
    },
    category_id: {
      type: String,
      ref: "category",
      uppercase: true,
    },
    brand_id: {
      type: String,
      ref: "brand",
      uppercase: true,
    },
    regular_item: {
      type: Boolean,
      required: true,
    },
    unit: {
      type: String,
      enum: ["pkt", "weight", "length"],
      lowercase: true,
    },
    stock_qty: {
      type: Number,
      required: true,
      min: 0,
    },
    cost_price: {
      type: Number,
      required: true,
      min: 0,
    },
    actual_price: {
      type: Number,
      required: true,
      min: 0,
    },
    selling_price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("products", productSchema);
export default Product;
