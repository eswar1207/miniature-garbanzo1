const express = require("express");
const {
  getItemController,
  addItemController,
  editItemController,
  deleteItemController,
} = require("../controllers/itemController");

const router = express.Router();

//routes
//Method - get
router.get("/get-item", getItemController);

//MEthod - POST
router.post("/add-item", addItemController);

//method - PUT
//method - PUT
router.put("/edit-item/:id", editItemController);

//Method - DELETE
router.delete("/delete-item/:id", deleteItemController);

module.exports = router;
