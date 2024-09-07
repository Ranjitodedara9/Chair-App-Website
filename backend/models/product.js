const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
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
  // Add other fields as necessary
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
