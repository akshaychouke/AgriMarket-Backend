import userModel from "../models/userModel.js";
import { hashPassword } from "../helpers/authHelper.js";

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
