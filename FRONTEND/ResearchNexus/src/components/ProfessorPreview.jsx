import React, { useState, useEffect } from 'react';
import { getProfessorPreviews, giveFeedback } from '../services/api';

const ProfessorPreview = ({ professorEmail }) => {
    const [works, setWorks] = useState([]);
    const [feedbackText, setFeedbackText] = useState({});

    useEffect(() => {
        fetchWorks();
    }, [professorEmail]);

    const fetchWorks = async () => {
        try {
            const response = await getProfessorPreviews(professorEmail);
            setWorks(response.data);
        } catch (error) {
            console.error('Error fetching works:', error);
        }
    };

    const handleFeedbackChange = (workId, value) => {
        setFeedbackText({ ...feedbackText, [workId]: value });
    };

    const handleSubmitFeedback = async (workId) => {
        try {
            await giveFeedback({
                id: workId,
                feedback: feedbackText[workId],
            });
            alert('Feedback submitted successfully!');
            fetchWorks(); // Refresh the list
            setFeedbackText({ ...feedbackText, [workId]: '' });
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Error submitting feedback');
        }
    };

    return (
        <div className="professor-preview-container">
            <h2>Student Work Submissions</h2>
            {works.length === 0 ? (
                <p className="no-works">No submissions yet</p>
            ) : (
                <div className="works-list">
                    {works.map((work) => (
                        <div key={work._id} className="work-card">
                            <div className="work-header">
                                <h3>From: {work.student_email}</h3>
                                <span className="work-date">
                                    {new Date(work.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <div className="work-file">
                                <strong>File:</strong> {work.file}
                            </div>
                            {work.feedback && (
                                <div className="existing-feedback">
                                    <strong>Previous Feedback:</strong>
                                    <p>{work.feedback}</p>
                                </div>
                            )}
                            <div className="feedback-section">
                                <textarea
                                    placeholder="Enter your feedback here..."
                                    value={feedbackText[work._id] || ''}
                                    onChange={(e) => handleFeedbackChange(work._id, e.target.value)}
                                    rows="4"
                                />
                                <button
                                    onClick={() => handleSubmitFeedback(work._id)}
                                    className="btn-primary"
                                    disabled={!feedbackText[work._id]}
                                >
                                    Submit Feedback
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfessorPreview;