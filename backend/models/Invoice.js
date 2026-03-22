import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, "Item quantity is required"],
      min: [1, "Quantity must be at least 1"]
    },
    price: {
      type: Number,
      required: [true, "Item price is required"],
      min: [0, "Price cannot be negative"]
    }
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"]
    },
    items: {
      type: [invoiceItemSchema],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: "Invoice must contain at least one item"
      }
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, "Subtotal cannot be negative"]
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, "Tax cannot be negative"]
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"]
    },
    total: {
      type: Number,
      required: true,
      min: [0, "Total cannot be negative"]
    },
    status: {
      type: String,
      enum: ["paid", "pending"],
      default: "pending"
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

invoiceSchema.index({ customerId: 1, date: -1 });
invoiceSchema.index({ status: 1 });

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;

