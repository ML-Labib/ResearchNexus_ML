import React, { useState } from 'react';
import { assignTask } from '../services/api';

const TaskAssignment = ({ professorEmail }) => {
    const [taskName, setTaskName] = useState('');
    const [groupId, setGroupId] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await assignTask({
                Task_name: taskName,
                group_id: parseInt(groupId),
                professor_email: professorEmail,
            });
            setMessage('Task assigned successfully!');
            setTaskName('');
            setGroupId('');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error assigning task');
            console.error(error);
        }
    };

    return (
        <div className="task-assignment-container">
            <h2>Assign New Task</h2>
            <form onSubmit={handleSubmit} className="task-form">
                <div className="form-group">
                    <label>Task Name:</label>
                    <input
                        type="text"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        required
                        placeholder="Enter task name"
                    />
                </div>
                <div className="form-group">
                    <label>Group ID:</label>
                    <input
                        type="number"
                        value={groupId}
                        onChange={(e) => setGroupId(e.target.value)}
                        required
                        placeholder="Enter group ID"
                    />
                </div>
                <button type="submit" className="btn-primary">Assign Task</button>
            </form>
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default TaskAssignment;