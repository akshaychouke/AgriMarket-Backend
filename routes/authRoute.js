import express from "express";
import {registerController,loginController} from "../controllers/authController.js";
// to use router object
const router = express.Router();

//routing
router.post("/register",registerController);  // to register user in database
router.post("/login",loginController); // to login user


export default router;