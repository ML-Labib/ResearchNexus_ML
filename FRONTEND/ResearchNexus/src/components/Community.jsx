import React, { useState, useEffect } from 'react';
import { getQuestions, postQuestion, toggleLike } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/Community.css'; // Create simple CSS for this

const Community = ({ user }) => {
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newQ, setNewQ] = useState({ title: '', content: '' });
  const navigate = useNavigate();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const res = await getQuestions();
    setQuestions(res.data);
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    await postQuestion({ ...newQ, authorName: user.Name, authorEmail: user.Gmail });
    setShowModal(false);
    setNewQ({ title: '', content: '' });
    loadQuestions();
  };

  const handleLike = async (id, e) => {
    e.stopPropagation();
    await toggleLike({ id, type: 'question', userEmail: user.Gmail });
    loadQuestions(); // Refresh to show new like count
  };

  return (
    <div className="community-container">
      <h1>🎓 Community Q&A</h1>
      <button className="ask-btn" onClick={() => setShowModal(true)}>+ Ask Question</button>

      <div className="question-list">
        {questions.map(q => (
          <div key={q._id} className="question-card" onClick={() => navigate(`/community/${q._id}`)}>
            <div className="vote-box">
              <button onClick={(e) => handleLike(q._id, e)}>▲</button>
              <span>{q.likes.length}</span>
            </div>
            <div className="q-content">
              <h3>{q.title}</h3>
              <p>Asked by {q.authorName} • {q.answerCount} Answers</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ask Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Ask the Community</h3>
            <input placeholder="Title" value={newQ.title} onChange={e => setNewQ({...newQ, title: e.target.value})} />
            <input placeholder="Category" value={newQ.category} onChange={e => setNewQ({...newQ, category: e.target.value})} />
            <textarea placeholder="Details..." value={newQ.content} onChange={e => setNewQ({...newQ, content: e.target.value})} />
            <button onClick={handleAsk}>Post</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;