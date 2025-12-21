const Progress = require('../models/Progress');

exports.updateProgress = async (req, res) => {
    try {
        const { group_id, student_email, completed_task } = req.body;
        const progress = await Progress.findOneAndUpdate(
            { group_id, student_email },
            { completed_task },
            { upsert: true, new: true }
        );
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error updating progress', error: error.message });
    }
};

exports.getProgress = async (req, res) => {
    try {
        const { group_id, student_email } = req.params;
        const progress = await Progress.findOne({ 
            group_id: parseInt(group_id), 
            student_email 
        });
        if (progress) {
            res.json(progress);
        } else {
            res.json({ group_id: parseInt(group_id), student_email, completed_task: 0 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching progress', error: error.message });
    }
};