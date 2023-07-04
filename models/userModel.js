import mongoose from "mongoose";

//creating a schema for the user
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, //to remove the extra spaces
    },
    email: {
      type: String,
      required: true,
      unique: true, //to make sure that the email is unique
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0, //0 for user and 1 for admin
    },
  },
  //to add the time of creation and updation
  { timestamps: true }
);

//creating a model for the schema
const User = mongoose.model("user", userSchema);
export default User;
