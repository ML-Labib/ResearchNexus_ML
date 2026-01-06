import { useEffect, useState } from 'react';
import { getAllStudents, removeStudent } from '../services/api';
import '../styles/ViolanceControlPanel.css';

const ViolanceControlPanel = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchStudents = async () => {
        try {
            const res = await getAllStudents();
            setStudents(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        if (!window.confirm('Remove this student permanently?')) return;
        await removeStudent(id);
        setStudents(prev => prev.filter(s => s._id !== id));
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const filteredStudents = students.filter(student =>
        (student.Name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.studentId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.Gmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.SuperVisor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.Group_id?.toString() || '').includes(searchTerm)
    );


    if (loading) return <p className="loading">Loading students...</p>;

    return (
        <div className="students-container">
            <h2>Violance Control Panel</h2>

            {/* 🔍 SEARCH BOX */}
            <input
                type="text"
                placeholder="Search by name, ID, email, group, supervisor..."
                className="search-box"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="students-grid">
                {filteredStudents.length === 0 ? (
                    <p className="no-results">No students found</p>
                ) : (
                    filteredStudents.map(student => (
                        <div className="student-card" key={student._id}>
                            <h3>{student.Name}</h3>

                            <p><b>Student ID:</b> {student.studentId}</p>
                            <p><b>Email:</b> {student.Gmail}</p>
                            <p><b>Supervisor:</b> {student.SuperVisor}</p>
                            <p><b>Group:</b> {student.Group_id}</p>
                            <p><b>Phone:</b> {student.phone || 'N/A'}</p>
                            <p><b>Address:</b> {student.address || 'N/A'}</p>

                            <button
                                className="remove-btn"
                                onClick={() => handleRemove(student._id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ViolanceControlPanel;