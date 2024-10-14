const Bill = require("../models/billModel");

// Helper function for exponential smoothing
const exponentialSmoothing = (data, alpha) => {
  let smoothed = [data[0]];
  for (let i = 1; i < data.length; i++) {
    smoothed.push(alpha * data[i] + (1 - alpha) * smoothed[i - 1]);
  }
  return smoothed;
};

exports.getSalesPrediction = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    console.log('Debug: Fetching sales data from:', thirtyDaysAgo);

    const salesData = await Bill.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log('Debug: Sales data:', JSON.stringify(salesData, null, 2));

    if (salesData.length === 0) {
      console.log('Debug: No sales data found');
      return res.json(Array(7).fill({ date: 'N/A', prediction: 0 }));
    }

    const salesValues = salesData.map(day => day.totalSales);
    const alpha = 0.3; // Smoothing factor, adjust as needed
    const smoothedSales = exponentialSmoothing(salesValues, alpha);

    // Use the last 7 smoothed values to predict the next 7 days
    const lastSevenSmoothed = smoothedSales.slice(-7);
    const averageIncrease = lastSevenSmoothed.reduce((sum, val, i, arr) => {
      return i === 0 ? sum : sum + (val - arr[i-1]);
    }, 0) / 6; // Average daily increase over the last 7 days

    const predictions = [];
    let lastPrediction = lastSevenSmoothed[lastSevenSmoothed.length - 1];

    for (let i = 1; i <= 7; i++) {
      lastPrediction += averageIncrease;
      const predValue = Math.max(0, Math.round(lastPrediction)); // Ensure non-negative prediction

      const date = new Date();
      date.setDate(date.getDate() + i);
      predictions.push({
        date: date.toISOString().split('T')[0],
        prediction: predValue
      });
    }

    console.log('Debug: Predictions:', JSON.stringify(predictions, null, 2));

    res.json(predictions);
  } catch (error) {
    console.error("Error generating sales prediction:", error);
    res.status(500).json({ message: "Error generating sales prediction" });
  }
};

exports.getNextItemPrediction = async (req, res) => {
  // ... (keep this function as it is)
};
