import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  getAllProductsController,
  getProductController,
  getProductPhotoController,
  updateProductController,
  deleteProductController,
  productFilterController,
  productCountController,
  productListController
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

//routes

//to create a product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//to get all products
router.get("/get-products", getAllProductsController);

//to get a product
router.get("/get-product/:slug", getProductController);

//to get a product photo
router.get("/product-photo/:pid", getProductPhotoController);

//to update a product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//delete a product
router.delete(
  "/delete-product/:pid",
  requireSignIn,
  isAdmin,
  deleteProductController
);

//filter products
router.post("/product-filter", productFilterController);
export default router;

//count products
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);
