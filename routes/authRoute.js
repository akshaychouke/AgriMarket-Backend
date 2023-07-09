import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
} from "../controllers/authController.js";

import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
// to use router object
const router = express.Router();

//routing
router.post("/register", registerController); // to register user in database
router.post("/login", loginController); // to login user
router.post("/forgot-password", forgotPasswordController);

router.get("/test", requireSignIn, isAdmin, testController); // to test user login passing the requireSignIn and isAdmin middleware

//protected route auth for user
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected route auth for admin
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

//order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;
