import React, { useState, useEffect } from 'react';
import { getTasksByGroup, updateProgress } from '../services/api';
import ProgressBar from './ProgressBar';

const StudentTaskView = ({ groupId, studentEmail }) => {
    const [tasks, setTasks] = useState([]);
    const [checkedTasks, setCheckedTasks] = useState({});
    const [completedCount, setCompletedCount] = useState(0);

    useEffect(() => {
        fetchTasks();
    }, [groupId]);

    const fetchTasks = async () => {
        try {
            const response = await getTasksByGroup(groupId);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleCheckboxChange = async (taskId) => {
        const newCheckedState = { ...checkedTasks, [taskId]: !checkedTasks[taskId] };
        setCheckedTasks(newCheckedState);

        const newCompletedCount = Object.values(newCheckedState).filter(Boolean).length;
        setCompletedCount(newCompletedCount);

        try {
            await updateProgress({
                group_id: parseInt(groupId),
                student_email: studentEmail,
                completed_task: newCompletedCount,
            });
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    return (
        <div className="student-task-view">
            <h2>My Tasks</h2>
            <ProgressBar completedTasks={completedCount} totalTasks={tasks.length} />

            <div className="task-list">
                {tasks.length === 0 ? (
                    <p className="no-tasks">No tasks assigned yet</p>
                ) : (
                    tasks.map((task) => (
                        <div key={task._id} className="task-item">
                            <label className="task-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={checkedTasks[task._id] || false}
                                    onChange={() => handleCheckboxChange(task._id)}
                                />
                                <span className={checkedTasks[task._id] ? 'completed' : ''}>
                                    {task.Task_name}
                                </span>
                            </label>
                            <span className="task-date">
                                {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentTaskView;