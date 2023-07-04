import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
//to protect routes from unauthorized access
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization, //token from frontend
      process.env.JWT_SECRET
    );
    req.user = decode; //adding user to req object
    next(); //if token is valid then next() will be called
  } catch (error) {
    console.log("error in requireSignIn middleware", error.message);
  }
};

//admin access
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res
        .status(401)
        .json({ success: false, message: "Admin access denied" });
    }
    next(); //if user is admin then next() will be called
  } catch (error) {
    console.log("error in isAdmin middleware", error.message);
    res
      .status(401)
      .json({ success: false, message: "Error in admin access middleware" });
  }
};
