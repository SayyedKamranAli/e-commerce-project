require("dotenv").config();
const express = require("express");
const app = express();
require("./db/conn");
const router = require("./routes/router");
const router1 = require("./routes/productRouter");
const router2 = require("./routes/cartRouter");
const cors = require("cors");
const cookiParser = require("cookie-parser")
const port = 8009;


// app.get("/",(req,res)=>{
//     res.status(201).json("server created")
// });

app.use(express.json());
app.use(cookiParser());
app.use(cors());
app.use(router);
app.use(router1);
app.use(router2);


app.listen(port,()=>{
    console.log(`server start at port no : ${port}`);
})