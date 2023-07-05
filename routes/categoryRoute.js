import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createCategoryController,
  updateCategoryController,
  getAllCategoriesController,
  getSingleCategoryController,
  deleteCategoryController
} from "../controllers/categoryController.js";

//init router
const router = express.Router();

//routing for category
//create category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);
//update category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);
//get all categories
router.get("/get-Categories", getAllCategoriesController);

//get single category
router.get("/get-category/:slug", getSingleCategoryController);

//delete category
router.delete("/delete-category/:id", requireSignIn, isAdmin,deleteCategoryController), (req, res) => {};
export default router;
