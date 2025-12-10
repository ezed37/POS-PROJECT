import Category from "../models/categoriesModel.js";

//Create a new category
export const createCategory = async (req, res) => {
  try {
    if (req.body.category_id) {
      delete req.body.category_id;
    }

    const lastCategory = await Category.findOne().sort({ category_id: -1 });

    let nextNumber = 1;
    if (lastCategory) {
      const lastId = lastCategory.category_id;
      const num = parseInt(lastId.split("/")[1]);
      nextNumber = num + 1;
    }

    const newCategoryId = "CTG/" + String(nextNumber).padStart(4, "0");

    const category = new Category({
      ...req.body,
      category_id: newCategoryId,
    });

    const savedCategory = await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: savedCategory,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//show all category
export const getCategory = async (req, res) => {
  try {
    const category = await Category.find();
    res.json({
      success: true,
      count: category.length,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//show a category by id
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found!",
      });
    }
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update a category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updateCategory)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json({
      success: true,
      data: updateCategory,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//delete a category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
