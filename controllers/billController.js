const Bill = require("../models/billModel");

// Create a new bill
exports.createBill = async (req, res) => {
  try {
    const newBill = new Bill(req.body);
    await newBill.save();
    res.status(201).json({
      success: true,
      message: "Bill created successfully",
      data: newBill,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating bill",
      error: error.message,
    });
  }
};

// Get all bills
exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: bills.length,
      data: bills,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error fetching bills",
      error: error.message,
    });
  }
};

// Get a single bill by ID
exports.getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }
    res.status(200).json({
      success: true,
      data: bill,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error fetching bill",
      error: error.message,
    });
  }
};

// Update a bill
exports.updateBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Bill updated successfully",
      data: bill,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating bill",
      error: error.message,
    });
  }
};

// Delete a bill
exports.deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Bill deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error deleting bill",
      error: error.message,
    });
  }
};

// Get bills by date range
exports.getBillsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const bills = await Bill.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ date: 1 });
    res.status(200).json({
      success: true,
      count: bills.length,
      data: bills,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error fetching bills by date range",
      error: error.message,
    });
  }
};

// Get distinct customer names
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Bill.find().distinct("customerName");
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Error fetching customers" });
  }
};

// Get today's sales
exports.getTodaySales = async (req, res) => {
  try {
    const todaySales = await Bill.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
        },
      },
    ]);
    res.json({ totalSales: todaySales[0]?.totalSales || 0 });
  } catch (error) {
    console.error("Error fetching today sales:", error);
    res.status(500).json({ message: "Error fetching today sales" });
  }
};

// Get total revenue
exports.getTotalRevenue = async (req, res) => {
  try {
    const totalRevenue = await Bill.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);
    res.json({ totalRevenue: totalRevenue[0]?.totalRevenue || 0 });
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    res.status(500).json({ message: "Error fetching total revenue" });
  }
};

// Get total items sold
exports.getTotalItemsSold = async (req, res) => {
  try {
    const totalItemsSold = await Bill.aggregate([
      { $unwind: "$cartItems" },
      {
        $group: { _id: null, totalItemsSold: { $sum: "$cartItems.quantity" } },
      },
    ]);
    res.json({ totalItemsSold: totalItemsSold[0]?.totalItemsSold || 0 });
  } catch (error) {
    console.error("Error fetching total items sold:", error);
    res.status(500).json({ message: "Error fetching total items sold" });
  }
};

// Get best selling item
exports.getBestSellingItem = async (req, res) => {
  try {
    const bestSellingItem = await Bill.aggregate([
      { $unwind: "$cartItems" },
      {
        $group: {
          _id: "$cartItems.name",
          totalSales: { $sum: "$cartItems.quantity" },
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 1 },
    ]);
    res.json(bestSellingItem[0] || {});
  } catch (error) {
    console.error("Error fetching best selling item:", error);
    res.status(500).json({ message: "Error fetching best selling item" });
  }
};

// Get recent bills
exports.getRecentBills = async (req, res) => {
  try {
    const recentBills = await Bill.find().sort({ createdAt: -1 }).limit(10);
    res.json(recentBills);
  } catch (error) {
    console.error("Error fetching recent bills:", error);
    res.status(500).json({ message: "Error fetching recent bills" });
  }
};

// Get sales data for graph
exports.getSalesData = async (req, res) => {
  try {
    const salesData = await Bill.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    res.json(salesData);
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ message: "Error fetching sales data" });
  }
};
