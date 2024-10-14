const express = require("express");
const router = express.Router();
const { getSalesPrediction, getNextItemPrediction } = require("../controllers/aiController");

router.get("/sales-prediction", getSalesPrediction);
router.get("/next-item-prediction", getNextItemPrediction);

module.exports = router;
