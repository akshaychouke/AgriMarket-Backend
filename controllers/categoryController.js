import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

//create category controller
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    //validation
    if (!name) {
      return res.status(401).json({
        success: false,
        message: "Name is required",
      });
    }
    //check if category already exists
    const existingCategory = await categoryModel.findOne({ name: name });

    if (existingCategory) {
      return res.status(401).json({
        success: false,
        message: "Category already exists",
      });
    }

    //create new category
    const newCategory = new categoryModel({
      name,
      slug: slugify(name),
    });
    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      newCategory,
    });
  } catch (error) {
    console.log("error in createCategoryController", error.message);
    res.status(500).json({
      success: false,
      error,
      message: "Error in createCategoryController",
    });
  }
};

//update category controller
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    //update category
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(201).json({
      success: true,
      message: "Category updated successfully",
      updatedCategory,
    });
  } catch (error) {
    console.log("error in updateCategoryController", error.message);
    res.status(500).json({
      success: false,
      error,
      message: "Error in updateCategoryController",
    });
  }
};

//get all categories controller
export const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.status(200).json({
      success: true,
      message: "All categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.log("error in getAllCategoriesController", error.message);
    res.status(500).json({
      success: false,
      error,
      message: "Error in getAllCategoriesController",
    });
  }
};

//get single category controller
export const getSingleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });

    //check if category exists
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    //if category exists then send response
    res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      category,
    });
  } catch (error) {
    console.log("error in getSingleCategoryController", error.message);
    res.status(500).json({
      success: false,
      error,
      message: "Error in getSingleCategoryController",
    });
  }
};

//delete category controller
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    //to delete category
    const deletedCategory = await categoryModel.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      deletedCategory,
    });
  } catch (error) {
    console.log("error in deleteCategoryController", error.message);
    res.status(500).json({
      success: false,
      error,
      message: "Error in deleteCategoryController",
    });
  }
};
