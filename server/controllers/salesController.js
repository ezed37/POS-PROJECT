import Sales from "../models/salesModel.js";

//Create a sale
export const createSale = async (req, res) => {
  try {
    const {
      user_name,
      reference,
      sub_total,
      discount,
      final_total,
      items,
      final_cost,
      total_profit,
    } = req.body;

    // Basic validation
    if (!user_name || !sub_total || !final_total || !items) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newSale = new Sales({
      user_name,
      reference,
      sub_total,
      discount: discount || 0,
      final_total,
      final_cost,
      items,
      total_profit,
    });

    const savedSale = await newSale.save();

    res.status(201).json({
      success: true,
      message: "Sale created successfully!",
      data: savedSale,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get All sales
export const getAllSales = async (req, res) => {
  try {
    const sales = await Sales.find().sort({ createdAt: -1 });
    res.status(200).json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Get sale by ID
export const getSaleById = async (req, res) => {
  try {
    const sale = await Sales.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(200).json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Delete a sale
export const deleteSale = async (req, res) => {
  try {
    const sale = await Sales.findByIdAndDelete(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
