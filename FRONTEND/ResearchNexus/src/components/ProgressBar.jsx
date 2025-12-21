import React from 'react';

const ProgressBar = ({ completedTasks, totalTasks }) => {
    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <div className="progress-bar-container">
            <div className="progress-info">
                <span className="progress-label">Weekly Progress</span>
                <span className="progress-text">
                    {completedTasks} / {totalTasks} tasks completed
                </span>
            </div>
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                >
                    <span className="progress-percentage">{Math.round(percentage)}%</span>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;