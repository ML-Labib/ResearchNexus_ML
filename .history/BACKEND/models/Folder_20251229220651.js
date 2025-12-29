// models/Folder.js - Folder Model

const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  File: {
    type: Number,
    default: 0
  },
  id: {
    type: Number,
    required: true,
    unique: true
  },
  Type: {
    type: String,
    default: 'Folder'
  },
  Visibility: {
    type: Boolean,
    default: true
  },
  ownerEmail: {
    type: String,
    required: true
  },
  isTrashed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Folder', FolderSchema);