const express = require('express');
const router = express.Router();
const folderController = require('../controllers/taskController');

router.post("/assign", folderController.assignTask);
router.get("/group/:group_id", folderController.getTasksByGroup);

module.exports = router;
