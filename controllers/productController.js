import productModel from "../models/productModel.js";
import fs from "fs";
import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//create a product controller
export const createProductController = async (req, res) => {
  try {
    // This is the data that was sent from the client
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;

    const { photo } = req.files;
    //validate the data
    switch (true) {
      case !name:
        return res
          .status(500)
          .json({ success: false, message: "name is required" });
      case !description:
        return res
          .status(500)
          .json({ success: false, message: "description is required" });
      case !price:
        return res
          .status(500)
          .json({ success: false, message: "price is required" });
      case !category:
        return res
          .status(500)
          .json({ success: false, message: "category is required" });
      case !quantity:
        return res
          .status(500)
          .json({ success: false, message: "quantity is required" });
      case photo && photo.size > 1000000:
        return res.status(500).json({
          success: false,
          message: "photo is required size should be less 1MB",
        });
    }

    //to create a product
    const newProduct = new productModel({ ...req.fields, slug: slugify(name) });

    //to add photo
    if (photo) {
      newProduct.photo.data = fs.readFileSync(photo.path);
      newProduct.photo.contentType = photo.type;
    }
    //to save the product
    await newProduct.save();
    res.status(201).json({
      success: true,
      message: "product created successfully",
      newProduct,
    });
  } catch (error) {
    console.log("error in createProductController", error.message);
    res.status(500).json({
      success: false,
      message: "error in createProductController",
      error,
    });
  }
};

//get all products controller
export const getAllProductsController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalProducts: products.length,
      message: "All products fetched successfully",
      products,
    });
  } catch (error) {
    console.log("error in getAllProductsController", error.message);
    res.status(500).json({
      success: false,
      message: "error in getAllProductsController",
      error,
    });
  }
};

//get a product controller
export const getProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).json({
      success: true,
      message: "product fetched successfully",
      product,
    });
  } catch (error) {
    console.log("error in getProductController", error.message);
    res.status(500).json({
      success: false,
      message: "error in getProductController",
      error,
    });
  }
};

//get a product photo controller
export const getProductPhotoController = async (req, res) => {
  try {
    const productPhoto = await productModel
      .findById(req.params.pid)
      .select("photo");

    if (productPhoto.photo.data) {
      res.set("Content-Type", productPhoto.photo.contentType);
      return res.status(200).send(productPhoto.photo.data);
    }
  } catch (error) {
    console.log("error in getProductPhotoController", error.message);
    res.status(500).json({
      success: false,
      message: "error in getProductPhotoController",
      error,
    });
  }
};

//update a product controller
export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;

    const { photo } = req.files;
    //validate the data
    switch (true) {
      case !name:
        return res
          .status(500)
          .json({ success: false, message: "name is required" });
      case !description:
        return res
          .status(500)
          .json({ success: false, message: "description is required" });
      case !price:
        return res
          .status(500)
          .json({ success: false, message: "price is required" });
      case !category:
        return res
          .status(500)
          .json({ success: false, message: "category is required" });
      case !quantity:
        return res
          .status(500)
          .json({ success: false, message: "quantity is required" });
      case photo && photo.size > 1000000:
        return res.status(500).json({
          success: false,
          message: "photo is required size should be less 1MB",
        });
    }

    //to update a product
    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );

    //to add photo
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    //to save the product
    await product.save();
    res.status(201).json({
      success: true,
      message: "product updated successfully",
      product,
    });
  } catch (error) {
    console.log("error in updateProductController", error.message);
    res.status(500).json({
      success: false,
      message: "error in updateProductController",
      error,
    });
  }
};

//delete a product controller
export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel
      .findByIdAndDelete(req.params.pid)
      .select("-photo");

    res.status(200).json({
      success: true,
      message: "product deleted successfully",
      product,
    });
  } catch (error) {
    console.log("error in deleteProductController", error.message);
    res.status(500).json({
      success: false,
      message: "error in deleteProductController",
      error,
    });
  }
};

//products filter controller
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) {
      args.category = checked;
    }
    if (radio.length) {
      args.price = {
        $gte: radio[0],
        $lte: radio[1],
      };
    }
    const products = await productModel.find(args);
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log("error in productFilterController", error.message);
    res.status(500).json({
      success: false,
      message: "error in productFilterController",
      error,
    });
  }
};

//product count controller
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).json({ success: true, total });
  } catch (error) {
    console.log("error in productCountController", error.message);
    res.status(500).json({
      success: false,
      message: "error in productCountController",
      error,
    });
  }
};

//product list controller
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page || 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log("error in productListController", error.message);
    res.status(500).json({
      success: false,
      message: "error in productListController",
      error,
    });
  }
};

//search product controller
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.log("error in searchProductController", error.message);
    res.status(500).json({
      success: false,
      message: "error in searchProductController",
      error,
    });
  }
};

//similar product controller
export const similarProductsController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({ category: cid, _id: { $ne: pid } })
      .limit(3)
      .select("-photo");
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log("error in similarProductsController", error.message);
    res.status(500).json({
      success: false,
      message: "error in similarProductsController",
      error,
    });
  }
};

//category wise product controller
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).json({ success: true, category, products });
  } catch (error) {
    console.log("error in productCategoryController", error.message);
    res.status(500).json({
      success: false,
      message: "error in productCategoryController",
      error,
    });
  }
};

//payment gateway api
// token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log("error in braintreeTokenController", error.message);
  }
};

//payments
export const braintreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((item) => {
      total += item.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (err, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(err);
        }
      }
    );
  } catch (error) {
    console.log("error in braintreePaymentController", error.message);
  }
};
