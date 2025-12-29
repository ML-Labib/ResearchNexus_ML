const express = require('express');
const router = express.Router();
const folderController = require('../controllers/siteController');

router.post("/assign", folderController.addSite);
router.get("/group/:group_id", folderController.getSiteByGmail);

module.exports = router;
