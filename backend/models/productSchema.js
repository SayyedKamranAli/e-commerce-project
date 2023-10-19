const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: String,
    required: true,
  },
  categories: {
    type: String,
    required: true,
  },
  
});

  // createing model
const productdb = new mongoose.model("product", productSchema);

module.exports = productdb;