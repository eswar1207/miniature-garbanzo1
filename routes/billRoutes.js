const express = require("express");
const router = express.Router();
const {
  createBill,
  getAllBills,
  getBillById,
  updateBill,
  deleteBill,
  getBillsByDateRange,
  getCustomers,
  getTodaySales,
  getTotalRevenue,
  getTotalItemsSold,
  getBestSellingItem,
  getRecentBills,
  getSalesData,
} = require("../controllers/billController");

// Create a new bill
router.post("/add-bill", createBill);

// Get all bills
router.get("/get-bills", getAllBills);

// Get a single bill by ID
router.get("/get-bills/:id", getBillById);

// Update a bill
router.patch("/update-bills/:id", updateBill);

// Delete a bill
router.delete("/delete-bills/:id", deleteBill);

// Get bills by date range
router.get("/get-bills/date-range", getBillsByDateRange);

// Get customers
router.get("/get-customers", getCustomers);

// Get today's sales
router.get("/get-today-sales", getTodaySales);

// Get total revenue
router.get("/get-total-revenue", getTotalRevenue);

// Get total items sold
router.get("/get-total-items-sold", getTotalItemsSold);

// Get best selling item
router.get("/get-best-selling-item", getBestSellingItem);

// Get recent bills
router.get("/get-recent-bills", getRecentBills);

// Get sales data
router.get("/get-sales-data", getSalesData);

module.exports = router;