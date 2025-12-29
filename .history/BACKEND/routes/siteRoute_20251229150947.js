const express = require('express');
const router = express.Router();
const folderController = require('../controllers/siteController');

router.post("/add", folderController.addSite);
router.get("/user/:Gmail", folderController.getSiteByGmail);

module.exports = router;
