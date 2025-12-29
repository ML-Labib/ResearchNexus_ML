const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
    site_name: String,
    url: St,

}, { timestamps: true });

module.exports = mongoose.model('Task', siteSchema);
