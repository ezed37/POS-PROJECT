import mongoose, { mongo } from "mongoose";

const customerSchema = new mongoose.Schema({
  customer_id: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  customer_name: {
    type: String,
    required: true,
    uppercase: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    uppercase: true,
  },
  purchase_cost: {
    type: Number,
    min: 0,
  },
});

const Customer = mongoose.model("customer", customerSchema);
export default Customer;
