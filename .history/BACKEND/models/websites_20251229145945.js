const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
    site_name: String,
    group_id: Number,
    professor_email: String
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
