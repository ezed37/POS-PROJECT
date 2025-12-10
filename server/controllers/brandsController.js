import Brand from "../models/brandsModel.js";

//Create a new brand
export const createBrand = async (req, res) => {
  try {
    if (req.body.brand_id) {
      delete req.body.brand_id;
    }

    const lastBrand = await Brand.findOne().sort({ brand_id: -1 });

    let nextNumber = 1;
    if (lastBrand) {
      const lastId = lastBrand.brand_id;
      const num = parseInt(lastId.split("/")[1]);
      nextNumber = num + 1;
    }

    const newBrandtId = "BRD/" + String(nextNumber).padStart(4, "0");

    const brand = new Brand({
      ...req.body,
      brand_id: newBrandtId,
    });

    const savedBrand = await brand.save();

    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      data: savedBrand,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//show all brand
export const getBrand = async (req, res) => {
  try {
    const brand = await Brand.find();
    res.json({
      success: true,
      count: brand.length,
      data: brand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//show a brand by id
export const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found!",
      });
    }
    res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update a brand
export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updateBrand)
      return res.status(404).json({ message: "Brand not found" });

    res.status(200).json({
      success: true,
      data: updateBrand,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//delete a brand
export const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Brand deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
