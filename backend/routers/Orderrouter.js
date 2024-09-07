const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/order");
const { jwtAuthMidleWare } = require("../jwt");

const router = express.Router();

// Create a new order
router.post("/", jwtAuthMidleWare, async (req, res) => {
  try {
    const {
      productData, // assuming productData is an object
      billingDetails, // assuming billingDetails is an object
    } = req.body;

    const { id, img, title, price, qunt, total, totalqunt, status,payments } =
      productData;
    const { name, address, city, state, pincode } = billingDetails;

    if (!id || !img || !title || !price || !qunt || !total) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const username = req.user.username; // Assuming jwtAuthMidleWare adds the user object to req

    // Create a new order instance
    const newOrder = new Order({
      id,
      img,
      title,
      price,
      qunt,
      total,
      totalqunt,
      status,
      user: username,
      name,
      address,
      city,
      state,
      pincode,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders for a specific user
router.get("/", jwtAuthMidleWare, async (req, res) => {
  try {
    const username = req.user.username;
    const orders = await Order.find({ user: username });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders for admin
router.get("/admin", async (req, res) => {
  // Ensure only admin can access
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an order
router.put("/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    // Find the order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the status
    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
