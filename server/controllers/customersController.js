import Customer from "../models/customersModel.js";

//Create a customer
export const createCustomer = async (req, res) => {
  try {
    if (req.body.customer_id) {
      delete req.body.customer_id;
    }

    const lastCustomer = await Customer.findOne().sort({ customer_id: -1 });

    let nextNumber = 1;
    if (lastCustomer) {
      const lastId = lastCustomer.customer_id;
      const num = parseInt(lastId.split("/")[1]);
      nextNumber = num + 1;
    }

    const newCustomerId = "CUST/" + String(nextNumber).padStart(4, "0");

    const customer = new Customer({
      ...req.body,
      customer_id: newCustomerId,
    });

    const savedCustomer = await customer.save();

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: savedCustomer,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//Show all customers
export const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.find();
    res.json({
      success: true,
      count: customer.length,
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//show a customer by id
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found!",
      });
    }
    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update a customer
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!updateCustomer)
      return res.status(404).json({ message: "Customer not found" });

    res.status(200).json({
      success: true,
      data: updateCustomer,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//delete a customer
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
