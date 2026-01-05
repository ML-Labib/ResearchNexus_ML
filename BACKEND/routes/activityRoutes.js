const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");

// Update daily activity
router.post("/update", activityController.updateActivity);

// Get weekly summary
router.get("/weekly/:email", activityController.getWeeklySummary);

// Get weekly leaderboard
router.get("/leaderboard/weekly", activityController.getWeeklyLeaderboard);

module.exports = router;
