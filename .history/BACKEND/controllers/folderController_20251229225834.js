// controllers/folderController.js - Folder Controller

const Folder = require('../models/Folder');
const File = require('../models/File'); // Import File Model
const fs = require('fs'); // Import File System
// Create Folder
exports.createFolder = async (req, res) => {
  try {
    const { Name, Visibility, ownerEmail } = req.body;
    
    const lastFolder = await Folder.findOne().sort({ id: -1 });
    const newId = lastFolder ? lastFolder.id + 1 : 1;

    const newFolder = new Folder({
      Name,
      id: newId,
      Visibility,
      ownerEmail,
      
    });

    await newFolder.save();
    res.status(201).json({ message: 'Folder created', folder: newFolder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Folders
exports.getFolders = async (req, res) => {
  try {
    const { ownerEmail } = req.query;
    // Only show folders where isTrashed is FALSE
    const folders = await Folder.find({
      isTrashed: false,
      $or: [{ ownerEmail: ownerEmail }, { Visibility: true }]
    });
    res.status(200).json(folders);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Update Folder Name
exports.updateFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Visibility } = req.body;

    const updatedFolder = await Folder.findOneAndUpdate(
      { id: parseInt(id) },
      { Name, Visibility },
      { new: true }
    );

    res.status(200).json({ message: 'Folder updated', folder: updatedFolder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search Folders
exports.searchFolders = async (req, res) => {
  try {
    const { query, ownerEmail } = req.query;
    const folders = await Folder.find({
      Name: { $regex: query, $options: 'i' },
      isTrashed: false,
      $or: [{ ownerEmail: ownerEmail }, { Visibility: true }]
    });
    res.status(200).json(folders);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Delete Folder
// exports.deleteFolder = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await Folder.findOneAndDelete({ id: parseInt(id) });
//     res.status(200).json({ message: 'Folder deleted' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// --- RECYCLE BIN LOGIC ---

// Get Trashed Folders
exports.getTrash = async (req, res) => {
  try {
    const { email } = req.params;
    const folders = await Folder.find({ ownerEmail: email, isTrashed: true });
    res.json(folders);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Move to Trash (Cascading)
exports.moveToTrash = async (req, res) => {
  try {
    const { id } = req.params;
    // 1. Trash the Folder
    await Folder.findOneAndUpdate({ id: parseInt(id) }, { isTrashed: true });
    // 2. Trash ALL Files inside
    await File.updateMany({ Folder: parseInt(id) }, { isTrashed: true });
    res.json({ message: "Folder moved to Recycle Bin" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Restore Folder (Cascading)
exports.restoreFolder = async (req, res) => {
  try {
    const { id } = req.params;
    // 1. Restore Folder
    await Folder.findOneAndUpdate({ id: parseInt(id) }, { isTrashed: false });
    // 2. Restore Files
    await File.updateMany({ Folder: parseInt(id) }, { isTrashed: false });
    res.json({ message: "Folder restored" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Delete Permanently (Cascading Physical Delete)
exports.deletePermanently = async (req, res) => {
  try {
    const { id } = req.params;
    // 1. Find and delete physical files
    const filesInFolder = await File.find({ Folder: parseInt(id) });
    filesInFolder.forEach(file => {
      if (file.filePath && fs.existsSync(file.filePath)) fs.unlinkSync(file.filePath);
    });
    // 2. Delete File records
    await File.deleteMany({ Folder: parseInt(id) });
    // 3. Delete Folder record
    await Folder.findOneAndDelete({ id: parseInt(id) });
    res.status(200).json({ message: 'Folder permanently deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
