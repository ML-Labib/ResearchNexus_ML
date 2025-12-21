const Preview = require('../models/Preview');

exports.sendWork = async (req, res) => {
    try {
        const { student_email, professor_email } = req.body;
        const file = req.file ? req.file.path : null;
        
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const preview = await Preview.create({ 
            file, 
            student_email, 
            professor_email 
        });
        res.json(preview);
    } catch (error) {
        res.status(500).json({ message: 'Error sending work', error: error.message });
    }
};

exports.getProfessorPreviews = async (req, res) => {
    try {
        const { professor_email } = req.params;
        const works = await Preview.find({ professor_email }).sort({ createdAt: -1 });
        res.json(works);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching previews', error: error.message });
    }
};

exports.giveFeedback = async (req, res) => {
    try {
        const { id, feedback } = req.body;
        const updated = await Preview.findByIdAndUpdate(
            id, 
            { feedback }, 
            { new: true }
        );
        if (updated) {
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Preview not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error giving feedback', error: error.message });
    }
};

exports.getStudentFeedback = async (req, res) => {
    try {
        const { student_email } = req.params;
        const feedbacks = await Preview.find({ student_email }).sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
};