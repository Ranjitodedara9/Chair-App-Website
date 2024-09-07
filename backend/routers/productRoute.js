const express = require("express");
const router = express.Router();
const Product = require("../models/product"); // Ensure the correct path and model name
const { jwtAuthMidleWare } = require("../jwt");

// Define a POST route to add a new product
router.post("/productdata", async (req, res) => {
  const { id, img, title, price, qunt, total, totalqunt } = req.body;

  if (
    !id ||
    !img ||
    !title ||
    !price ||
    qunt === undefined ||
    total === undefined
  ) {
    return res
      .status(400)
      .json({ message: "id, img, title, price, qunt, and total are required" });
  }

  try {
    // Create a new product instance
    const newProduct = new Product({
      id,
      img,
      title,
      price,
      qunt,
      total,
      totalqunt,
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    // Send a response back to the client
    res
      .status(200)
      .json({ message: "Product saved successfully", data: savedProduct });
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ message: "Error saving product" });
  }
});

// Route to get all product data
router.get("/productdata", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products); // Use 200 for successful GET request
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// Route to delete a product by ID
router.delete("/productdata/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

// Route to update the quantity and total of a product by ID
router.patch("/productdata/:id", async (req, res) => {
  const { id } = req.params;
  const { qunt, total } = req.body;

  if (qunt === undefined || total === undefined) {
    return res.status(400).json({ message: "qunt and total are required" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { qunt, total },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product" });
  }
});

module.exports = router;
