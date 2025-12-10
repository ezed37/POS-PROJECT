import mongoose, { mongo } from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    category_id: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    category_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamp: true }
);

const Category = mongoose.model("categories", categorySchema);
export default Category;
