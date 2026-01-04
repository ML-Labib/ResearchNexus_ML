// // routes/fileRoutes.js - File Routes

// const express = require('express');
// const router = express.Router();
// const fileController = require('../controllers/fileController');

// // Get Files by Folder
// router.get('/', fileController.getFilesByFolder);

// // Search Files (must be before /:id)
// router.get('/search', fileController.searchFiles);

// // Upload File
// router.post('/', fileController.upload.single('file'), fileController.uploadFile);

// // Delete File
// router.delete('/:id', fileController.deleteFile);

// module.exports = router;

// routes/fileRoutes.js - File Routes

const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

// --- 1. SEARCH & RECYCLE BIN (Must come BEFORE /:id) ---

// Search Files
router.get('/search', fileController.searchFiles);

// Get Trashed Files (For the Pop-up)
router.get('/trash/:email', fileController.getTrashedFiles);

// Move File to Trash (Soft Delete)
router.put('/trash/:id', fileController.moveToTrash);

// Restore File
router.put('/restore/:id', fileController.restoreFile);

// Delete Permanently (Hard Delete)
router.delete('/permanent/:id', fileController.deletePermanently);


// --- 2. STANDARD CRUD OPERATIONS ---

// Get Files by Folder (Active ones)
router.get('/', fileController.getFilesByFolder);

// Upload File
router.post('/', fileController.upload.single('file'), fileController.uploadFile);

module.exports = router;