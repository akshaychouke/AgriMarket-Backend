import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      // This is a reference to the category model.
      type: mongoose.ObjectId, // This is the type of the category model's _id field.
      ref: "category", // This is the model that will be used for population.
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    photo: {
      data: Buffer, // This is a binary data type that can be used to store image files.
      contentType: String, // This is the type of the image file.
    },
    shipping: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("product", productSchema);
export default Product;
