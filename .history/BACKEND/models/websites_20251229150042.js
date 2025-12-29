const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
    site_name: String,
    url: Number,

}, { timestamps: true });

module.exports = mongoose.model('Task', siteSchema);
