// // routes/folderRoutes.js - Folder Routes

// const express = require('express');
// const router = express.Router();
// const folderController = require('../controllers/folderController');

// // Create Folder
// router.post('/', folderController.createFolder);

// // Get All Folders
// router.get('/', folderController.getFolders);

// // Search Folders (must be before /:id to avoid conflicts)
// router.get('/search', folderController.searchFolders);

// // Update Folder
// router.put('/:id', folderController.updateFolder);

// // Delete Folder
// router.delete('/:id', folderController.deleteFolder);

// module.exports = router;

// routes/folderRoutes.js - Folder Routes

const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');

// --- 1. SEARCH & RECYCLE BIN (Must come BEFORE /:id) ---

// Search Folders
router.get('/search', folderController.searchFolders);

// Get Trashed Folders (For the Pop-up)
router.get('/trash/:email', folderController.getTrash);

// Move Folder to Trash (Soft Delete)
router.put('/trash/:id', folderController.moveToTrash);

// Restore Folder
router.put('/restore/:id', folderController.restoreFolder);

// Delete Permanently (Hard Delete)
router.delete('/permanent/:id', folderController.deletePermanently);


// --- 2. STANDARD CRUD OPERATIONS ---

// Create Folder
router.post('/', folderController.createFolder);

// Get All Folders (Active ones)
router.get('/', folderController.getFolders);

// Update Folder (Generic ID route)
router.put('/:id', folderController.updateFolder);

// Note: If you have an old delete button on the frontend pointing here, 
// you can map it to permanent delete or soft delete.
// For now, we leave the named routes above for the new features.

module.exports = router;