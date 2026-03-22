import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Customer email is required"],
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"]
    },
    phone: {
      type: String,
      required: [true, "Customer phone is required"],
      trim: true
    },
    address: {
      type: String,
      required: [true, "Customer address is required"],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

customerSchema.index({ name: 1, email: 1 });

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;

