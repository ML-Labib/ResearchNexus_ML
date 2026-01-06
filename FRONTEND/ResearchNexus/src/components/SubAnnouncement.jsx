import React, { useState } from 'react';
import { createSubAnnouncement  } from '../services/api';
import "../styles/SubAnnouncement.css"

const SubAnnouncement = ({ professorEmail }) => {
    const [taskName, setTaskName] = useState('');
    const [groupId, setGroupId] = useState('');
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createSubAnnouncement ({
                Task_name: taskName,
                group_id: parseInt(groupId),
                professor_email: professorEmail,
                announcement_category: category
            });

            setMessage('Announcement published successfully!');
            setTaskName('');
            setGroupId('');
            setCategory('');

            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error publishing announcement');
            console.error(error);
        }
    };

    return (
        <div className="task-assignment-container">
            <h2>Announcement Portal</h2>

            <form onSubmit={handleSubmit} className="task-form">
                
                <div className="form-group-XSL">
                    <label>Announcement Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select category</option>
                        <option value="PREVIOUS_WEEK_UPDATE">
                            Weekly Cycle Updated Announcement
                        </option>
                        <option value="NEXT_WEEK_PLANNING">
                            Next Week Planning Based Announcement
                        </option>
                    </select>
                </div>

                <div className="form-group-XSLL">
                    <label>Create an Announcement</label>
                    <input
                        type="text"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        required
                        placeholder="Write an announcement"
                    />
                </div>

                <div className="form-group-XSL">
                    <label>Group ID</label>
                    <input
                        type="number"
                        value={groupId}
                        onChange={(e) => setGroupId(e.target.value)}
                        required
                        placeholder="Enter group ID"
                    />
                </div>

                <button type="submit" className="btn-primary">
                    Announce Now
                </button>
            </form>

            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default SubAnnouncement;