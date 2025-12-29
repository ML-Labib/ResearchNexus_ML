const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
    site_name: String,
    group_id: Number,

}, { timestamps: true });

module.exports = mongoose.model('Task', siteSchema);
