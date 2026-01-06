const SubAnnouncement = require('../models/SubAnnouncement');

// Create Sub-Announcement
exports.createSubAnnouncement = async (req, res) => {
    try {
        const { Task_name, announcement_category, group_id, professor_email } = req.body;

        if (!Task_name || !announcement_category || !group_id || !professor_email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const announcement = await SubAnnouncement.create({
            subannouncement: Task_name,
            announcement_category,
            group_id, // keep type same as DB
            professor_email
        });

        res.status(201).json(announcement);
    } catch (error) {
        console.error("SubAnnouncement Error:", error);
        res.status(500).json({ message: "Sub-announcement creation failed" });
    }
};

// Get Sub-Announcements by Group with optional category filter
exports.getSubAnnouncementsByGroup = async (req, res) => {
    try {
        const { group_id } = req.params;
        const { category } = req.query;

        // keep type same as stored in MongoDB
        const filter = { group_id };

        if (category) filter.announcement_category = category;

        const announcements = await SubAnnouncement.find(filter).sort({ createdAt: -1 });

        res.json(announcements);
    } catch (error) {
        console.error("Failed to fetch sub-announcements:", error);
        res.status(500).json({ message: 'Failed to fetch sub-announcements' });
    }
};