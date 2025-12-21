import React, { useState, useEffect } from 'react';
import { getStudentFeedback } from '../services/api';

const StudentFeedbackView = ({ studentEmail }) => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        fetchFeedbacks();
    }, [studentEmail]);

    const fetchFeedbacks = async () => {
        try {
            const response = await getStudentFeedback(studentEmail);
            setFeedbacks(response.data);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
        }
    };

    return (
        <div className="student-feedback-container">
            <h2>My Feedback</h2>
            {feedbacks.length === 0 ? (
                <p className="no-feedback">No feedback yet</p>
            ) : (
                <div className="feedback-list">
                    {feedbacks.map((item) => (
                        <div key={item._id} className="feedback-card">
                            <div className="feedback-header">
                                <span className="feedback-date">
                                    {new Date(item.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <div className="feedback-file">
                                <strong>Submitted File:</strong> {item.file}
                            </div>
                            <div className="feedback-content">
                                <strong>Feedback from Professor:</strong>
                                {item.feedback ? (
                                    <p className="feedback-text">{item.feedback}</p>
                                ) : (
                                    <p className="pending-feedback">Pending feedback...</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentFeedbackView;