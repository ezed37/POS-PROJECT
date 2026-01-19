import Sales from "../models/salesModel.js";
import generateSalesReport from "../utils/generateSalesReport.js";

export const dailySalesReport = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const sales = await Sales.find({
      createdAt: { $gte: start, $lte: end },
    });

    generateSalesReport(sales, res);
  } catch (error) {
    res.status(500).json({ message: "Failed to generate report" });
  }
};
