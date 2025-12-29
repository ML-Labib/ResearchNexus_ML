const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');

router.post("/add", siteController.addSite);
router.get("/user/:Gmail", siteController.getSiteByGmail);
router.delete('/deleteSite/:id', siteController.deleteSite); 

module.exports = router;
