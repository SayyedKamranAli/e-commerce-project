const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
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
  username:
  {
type :String,
required:true,
  },
  status:{
type: String,

  },
  
});

  // createing model
const cartdb = new mongoose.model("cart", cartSchema);

module.exports = cartdb;