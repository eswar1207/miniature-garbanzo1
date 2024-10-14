const Item = require("../models/itemModel");

// get items
exports.getItemController = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).send(items);
  } catch (error) {
    console.log(error);
  }
};

//add items
exports.addItemController = async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).send("Item Created Successfully!");
  } catch (error) {
    res.status(400).send("error", error);
    console.log(error);
  }
};

//update item
// Edit item
//update item
// Edit item
exports.editItemController = async (req, res) => { 
  try {
    const itemId = req.params.id;
    const updatedItem = await Item.findByIdAndUpdate(itemId, req.body, { new: true });
    res.status(200).send(updatedItem);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}
// Delete item
// Delete item
exports.deleteItemController = async (req, res) => {
  try {
    const itemId = req.params.id; // Updated from itemId to id
    await Item.findByIdAndDelete(itemId);
    res.status(204).send(); // Updated status code
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};