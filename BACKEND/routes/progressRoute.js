const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

router.post('/update', progressController.updateProgress);
router.get('/:group_id/:student_email', progressController.getProgress);

module.exports = router;