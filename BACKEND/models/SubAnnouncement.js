const mongoose = require('mongoose');

const subAnnouncementSchema = new mongoose.Schema(
{
    subannouncement: {
        type: String,
        required: true,
        trim: true
    },

    announcement_category: {
        type: String,
        enum: [
            "PREVIOUS_WEEK_UPDATE",
            "NEXT_WEEK_PLANNING"
        ],
        required: true
    },

    group_id: {
        type: Number,
        required: true
    },

    professor_email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model(
    'SubAnnouncement',
    subAnnouncementSchema
);