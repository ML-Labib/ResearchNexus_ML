const express = require('express');
const router = express.Router();
const subAnnouncementController = require('../controllers/subannouncementController');

/* Create Sub-Announcement */
router.post('/', subAnnouncementController.createSubAnnouncement);

/* Get Sub-Announcements by Group */
router.get('/group/:group_id', subAnnouncementController.getSubAnnouncementsByGroup);


module.exports = router;