import Product from "../models/productsModel.js";

//create a product
export const createProduct = async (req, res) => {
  try {
    if (req.body.product_id) {
      delete req.body.product_id;
    }

    const lastProduct = await Product.findOne().sort({ product_id: -1 });

    let nextNumber = 1;
    if (lastProduct) {
      const lastId = lastProduct.product_id;
      const num = parseInt(lastId.split("/")[1]);
      nextNumber = num + 1;
    }

    const newProductId = "PRD/" + String(nextNumber).padStart(4, "0");

    const product = new Product({
      ...req.body,
      product_id: newProductId,
    });

    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: savedProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//show all products
export const getProduct = async (req, res) => {
  try {
    const product = await Product.find();
    res.json({
      success: true,
      count: product.length,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//show a product by id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Update Bulk product
export const updateBulkProduct = async (req, res) => {
  try {
    const products = req.body;

    for (const items of products) {
      await Product.findByIdAndUpdate(items.product_id, {
        $inc: { stock_qty: -items.stock_qty },
      });
    }

    res.json({ message: "Stock updated for all products" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
