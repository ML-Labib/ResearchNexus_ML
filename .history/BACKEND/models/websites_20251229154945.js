const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
    site_name: String,
    url: { type: String, unique: true  },
    Gmail: String,
}, { timestamps: true });

module.exports = mongoose.model('Website', siteSchema);