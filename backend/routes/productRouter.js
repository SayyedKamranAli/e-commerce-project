const express = require("express");
const router1 = new express.Router();
const productdb = require("../models/productSchema");

// add product
router1.post("/addproduct", async (req, res) => {
  const { name, price, categories } = req.body;

  if (!name || !price || !categories) {
    res.status(422).json({ error: "fill all the details" });
  }

  try {
   
      const finalData = new productdb({
        name,
        price,
        categories,
      });

      const storeData = await finalData.save();

      // console.log(storeData);
      res.status(201).json({ status: 201, storeData });

  } catch (error) {
    res.status(422).json(error);
    console.log("catch block error");
  }
});

// get product list
router1.get("/productlist", async (req, res) => {
    try {
      const ProductList = await productdb.find();
      res.status(201).json({ status: 201, ProductList });
    } catch (error) {
      res.status(401).json({ status: 401, error });
    }
  });

  // get product list by category
router1.get("/productlist/:categories", async (req, res) => {
    const categories = req.params.categories;
    try {
      const ProductListByCategory = await productdb.find({categories:categories});
      res.status(201).json({ status: 201, ProductListByCategory });
    } catch (error) {
      res.status(401).json({ status: 401, error });
    }
  });


// update product
  router1.patch("/updateProduct/:id", async (req, res) => {
    const _id = req.params.id;
  
    try {
      const updateProduct = await productdb.findByIdAndUpdate(
        _id,
        { name: req.body.name, price: req.body.price, categories: req.body.categories },
        {
          new: true,
          runValidators: true,
        }
      );
  
      res.status(200).json({
        status: 200,
        message: "update product",
        data: updateProduct,
      });
    } catch (e) {
      res.status(400).json({
        message: e.message,
      });
    }
  });

// delete product
  router1.delete("/deleteProduct/:id", async (req, res) => {
    const _id = req.params.id;
    try {
      const deleteProduct = await productdb.findByIdAndDelete(
        { _id: _id },
        {
          new: true,
          runValidators: true,
        }
      );
  
      res.status(200).json({
        status: 200,
        message: "Delete product",
      });
    } catch (e) {
      res.status(400).json({
        message: e.message,
      });
    }
  });

module.exports = router1;