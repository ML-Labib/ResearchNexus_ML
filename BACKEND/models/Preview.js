const mongoose = require('mongoose');

const previewSchema = new mongoose.Schema({
    file: String,
    student_email: String,
    professor_email: String,
    feedback: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Preview", previewSchema);
