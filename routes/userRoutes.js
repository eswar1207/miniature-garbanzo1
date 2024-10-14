const express = require("express");
const {
  loginController,
  registerController,
  // other controllers
} = require("../controllers/userController");

const router = express.Router();

// Routes
router.post("/login", loginController);
router.post("/register", registerController);
// other routes

module.exports = router;
