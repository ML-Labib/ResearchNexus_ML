const Student = require('../models/Student');

// ✅ Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch students' });
    }
};

// ❌ Remove a student
exports.removeStudent = async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Student removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove student' });
    }
};
