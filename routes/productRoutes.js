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
  productListController,
  searchProductController,
  similarProductsController,
  productCategoryController,
  braintreeTokenController,
  braintreePaymentController
} from "../controllers/productController.js";
import formidable from "express-formidable";
import braintree from "braintree";

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
//count products
router.get("/product-count", productCountController);
//product per page
router.get("/product-list/:page", productListController);

//search products
router.get("/search/:keyword", searchProductController);

//similar products
router.get("/similar-products/:pid/:cid", similarProductsController);

//category wise products
router.get("/product-category/:slug", productCategoryController);

//payment routes
//to get braintree token
router.get("/braintree/token", braintreeTokenController);

//braintree payment
router.post("/braintree/payment", requireSignIn, braintreePaymentController);

export default router;
