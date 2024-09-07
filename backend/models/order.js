const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  img: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  qunt: {
    type: Number,
    default: 1, // Set a default quantity if not provided
  },
  total: {
    type: Number,
    default: function () {
      return this.price * this.qunt; // Calculate total based on price and quantity
    },
  },
  totalqunt: {
    type: Number,
    default: 0, // Ensure a default value is provided
  },
  user: {
    type: String,
    ref: "Person",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Default value for the creation date
  },
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },

  payments: {
    type: String,
    required: true,
    enum: ["cash", "paypal"],
    default: "cash",
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  // Add other fields as necessary
});

const Order = mongoose.model("Order", productSchema);

module.exports = Order;
