import productModel from "../models/productModel.js";
import fs from "fs";
import slugify from "slugify";

//create a product controller
export const createProductController = async (req, res) => {
  try {
    // This is the data that was sent from the client
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;

    const { photo } = req.files;
    //validate the data
    switch (true) {
      case !name:
        return res
          .status(500)
          .json({ success: false, message: "name is required" });
      case !description:
        return res
          .status(500)
          .json({ success: false, message: "description is required" });
      case !price:
        return res
          .status(500)
          .json({ success: false, message: "price is required" });
      case !category:
        return res
          .status(500)
          .json({ success: false, message: "category is required" });
      case !quantity:
        return res
          .status(500)
          .json({ success: false, message: "quantity is required" });
      case photo && photo.size > 1000000:
        return res.status(500).json({
          success: false,
          message: "photo is required size should be less 1MB",
        });
    }

    //to create a product
    const newProduct = new productModel({ ...req.fields, slug: slugify(name) });

    //to add photo
    if (photo) {
      newProduct.photo.data = fs.readFileSync(photo.path);
      newProduct.photo.contentType = photo.type;
    }
    //to save the product
    await newProduct.save();
    res.status(201).json({
      success: true,
      message: "product created successfully",
      newProduct,
    });
  } catch (error) {
    console.log("error in createProductController", error.message);
    res.status(500).json({
      success: false,
      message: "error in createProductController",
      error,
    });
  }
};

//get all products controller
export const getAllProductsController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalProducts: products.length,
      message: "All products fetched successfully",
      products,
    });
  } catch (error) {
    console.log("error in getAllProductsController", error.message);
    res.status(500).json({
      success: false,
      message: "error in getAllProductsController",
      error,
    });
  }
};

//get a product controller
export const getProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).json({
      success: true,
      message: "product fetched successfully",
      product,
    });
  } catch (error) {
    console.log("error in getProductController", error.message);
    res.status(500).json({
      success: false,
      message: "error in getProductController",
      error,
    });
  }
};

//get a product photo controller
export const getProductPhotoController = async (req, res) => {
  try {
    const productPhoto = await productModel
      .findById(req.params.pid)
      .select("photo");

    if (productPhoto.photo.data) {
      res.set("Content-Type", productPhoto.photo.contentType);
      return res.status(200).json(productPhoto.photo.data);
    }
  } catch (error) {
    console.log("error in getProductPhotoController", error.message);
    res.status(500).json({
      success: false,
      message: "error in getProductPhotoController",
      error,
    });
  }
};

//update a product controller
export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;

    const { photo } = req.files;
    //validate the data
    switch (true) {
      case !name:
        return res
          .status(500)
          .json({ success: false, message: "name is required" });
      case !description:
        return res
          .status(500)
          .json({ success: false, message: "description is required" });
      case !price:
        return res
          .status(500)
          .json({ success: false, message: "price is required" });
      case !category:
        return res
          .status(500)
          .json({ success: false, message: "category is required" });
      case !quantity:
        return res
          .status(500)
          .json({ success: false, message: "quantity is required" });
      case photo && photo.size > 1000000:
        return res.status(500).json({
          success: false,
          message: "photo is required size should be less 1MB",
        });
    }

    //to update a product
    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );

    //to add photo
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    //to save the product
    await product.save();
    res.status(201).json({
      success: true,
      message: "product updated successfully",
      product,
    });
  } catch (error) {
    console.log("error in updateProductController", error.message);
    res.status(500).json({
      success: false,
      message: "error in updateProductController",
      error,
    });
  }
};

//delete a product controller
export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel
      .findByIdAndDelete(req.params.pid)
      .select("-photo");

    res.status(200).json({
      success: true,
      message: "product deleted successfully",
      product,
    });
  } catch (error) {
    console.log("error in deleteProductController", error.message);
    res.status(500).json({
      success: false,
      message: "error in deleteProductController",
      error,
    });
  }
};
