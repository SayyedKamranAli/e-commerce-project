const express = require("express");
const router2 = new express.Router();
const cartdb = require("../models/cartSchema");

// add products into cart
router2.post("/addcart", async (req, res) => {
  const { name, price, categories, status, username } = req.body;

  if (!name || !price || !categories || !username) {
    res.status(422).json({ error: "fill all the details" });
  }
  try {
    const finalData = new cartdb({
      name,
      price,
      categories,
      username,
      status,
    });

    const storeData = await finalData.save();

    // console.log(storeData);
    res.status(201).json({ status: 201, storeData });
  } catch (error) {
    //  res.status(422).json(error);
    console.log("catch block error");
  }
});

router2.get("/cartlist", async (req, res) => {
    try {
      const cartlist = await cartdb.find();
      res.status(201).json({ status: 201, cartlist });
    } catch (error) {
      res.status(401).json({ status: 401, error });
    }
  });

  router2.patch("/updateStatus/:id", async (req, res) => {
    const _id = req.params.id;
  
    try {
      const updateStatus = await cartdb.findByIdAndUpdate(
        _id,
        { status: req.body.status },
        {
          new: true,
          runValidators: true,
        }
      );
  
      res.status(200).json({
        status: 200,
        message: "update status",
        data: updateStatus,
      });
    } catch (e) {
      res.status(400).json({
        message: e.message,
      });
    }
  });


module.exports = router2;
