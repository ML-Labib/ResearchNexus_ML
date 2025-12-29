const express = require('express');
const router = express.Router();
const folderController = require('../controllers/siteController');

router.post("/assign", folderController.assignTask);
router.get("/group/:group_id", folderController.getTasksByGroup);

module.exports = router;
