const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotanv = require("dotenv");
require("colors");
const connectDb = require("./config/config");
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);  // or true, depending on your preference
//dotenv config
dotanv.config();
require("dotenv").config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);
//db config
connectDb();
//rest object
const app = express();


//middlwares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

//routes
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/bills", require("./routes/billRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
//port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`.bgCyan.white);
});
