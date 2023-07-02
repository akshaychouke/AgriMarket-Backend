import userModel from "../models/userModel.js";
import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";

// to register user in database and return success message and user details in response if successful else return error message and error
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // to validate input fields are not empty
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    }
    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone is required" });
    }
    if (!address) {
      return res
        .status(400)
        .json({ success: false, message: "Address is required" });
    }

    // to check if user already exists
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // to hash password before saving in database
    const hashedPassword = await hashPassword(password);

    // to save user in database
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    // to save user in database
    await user.save();
    console.log("user saved successfully");
    res
      .status(200)
      .json({ success: true, message: "User saved successfully", user });
  } catch (error) {
    console.log("error in registerController", error.message);
    res
      .status(500)
      .json({ sucess: false, message: "Error in Registration", error });
  }
};

// to login user method ->POST
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body; //to get email and password from request body

    // to validate input fields are not empty
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and Password are required" });
    }

    // to check if user exists
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }
    // to compare password with hashed password in database  - comparePassword is a helper function imported from authHelper.js
    const isMatch = await comparePassword(password, user.password); // user.password is hashed password in database
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }

    // to generate token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log("error in loginController", error.message);
    res.status(500).json({ success: false, message: "Error in Login", error });
  }
};
