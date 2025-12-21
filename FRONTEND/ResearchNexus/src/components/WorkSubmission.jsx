import React, { useState } from 'react';
import { sendWorkForPreview } from '../services/api';

const WorkSubmission = ({ studentEmail, professorEmail }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            setMessage('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('student_email', studentEmail);
        formData.append('professor_email', professorEmail);

        try {
            await sendWorkForPreview(formData);
            setMessage('Work submitted successfully!');
            setSelectedFile(null);
            e.target.reset();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error submitting work');
            console.error(error);
        }
    };

    return (
        <div className="work-submission-container">
            <h2>Submit Work for Preview</h2>
            <form onSubmit={handleSubmit} className="submission-form">
                <div className="form-group">
                    <label>Select File:</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        required
                    />
                    {selectedFile && (
                        <span className="file-name">{selectedFile.name}</span>
                    )}
                </div>
                <button type="submit" className="btn-primary">
                    Send for Preview
                </button>
            </form>
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default WorkSubmission;