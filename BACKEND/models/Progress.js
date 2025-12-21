
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    group_id: Number,
    student_email: String,
    completed_task: Number
});

module.exports = mongoose.model('Progress', progressSchema);
