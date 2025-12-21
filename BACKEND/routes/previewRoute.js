const express = require('express');
const router = express.Router();
const multer = require('multer');
const previewController = require('../controllers/previewController');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

router.post('/send', upload.single('file'), previewController.sendWork);
router.get('/professor/:professor_email', previewController.getProfessorPreviews);
router.post('/feedback', previewController.giveFeedback);
router.get('/student/:student_email', previewController.getStudentFeedback);

module.exports = router;