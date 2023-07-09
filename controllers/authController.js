import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";

// to register user in database and return success message and user details in response if successful else return error message and error
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

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
    if (!answer) {
      return res
        .status(400)
        .json({ success: false, message: "Answer is required" });
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
      answer,
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

// to forgot password method ->POST
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newpassword } = req.body;

    // to validate input fields are not empty
    if (!email) {
      res.status(400).json({ success: false, message: "Email is required" });
    }
    if (!answer) {
      res.status(400).json({ success: false, message: "Answer is required" });
    }
    if (!newpassword) {
      res
        .status(400)
        .json({ success: false, message: "New Password is required" });
    }

    // to check if user and answer exists

    const user = await userModel.findOne({ email: email, answer: answer });

    //validate user exists or not
    if (!user) {
      res.status(400).json({ success: false, message: "User does not exist" });
    }
    // to hash new password before saving in database
    const hashedPass = await hashPassword(newpassword);
    // to update password in database
    await userModel.findByIdAndUpdate(user._id, { password: hashedPass });
    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.log("error in forgotPasswordController", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error in forgot password", error });
  }
};

// to test user login method ->GET
export const testController = async (req, res) => {
  // console.log("testController for protected route");
  res.status(200).json({ success: true, message: "Protected route" });
};

//update user profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;
    const user = await userModel.findById(req.user._id);
    if (password && password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password is required and should be atleast 6 characters long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        email: email || user.email,
        phone: phone || user.phone,
        address: address || user.address,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log("error in updateProfileController", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error in update profile", error });
  }
};

//get orders controller
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      success: false,
      message: "Error while Geting Orders",
      error,
    });
  }
};
