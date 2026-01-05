import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getQuestionDetail, postAnswer, toggleLike } from '../services/api';

const QuestionDetail = ({ user }) => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    const res = await getQuestionDetail(id);
    setData(res.data);
  };

  const handleReply = async () => {
    await postAnswer({
      questionId: id,
      content: reply,
      authorName: user.Name,
      authorEmail: user.Gmail
    });
    setReply('');
    loadData();
  };

  const handleLikeAnswer = async (answerId) => {
    await toggleLike({ id: answerId, type: 'answer', userEmail: user.Gmail });
    loadData();
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div style={{ padding: 40, maxWidth: '800px', margin: '0 auto' }}>
      {/* Main Question */}
      <div className="main-q" style={{ borderBottom: '2px solid #eee', marginBottom: 20 }}>
        <h1>{data.question.title}</h1>
        <p style={{ fontSize: '1.1rem' }}>{data.question.content}</p>
        <small>Asked by {data.question.authorName}</small>
      </div>

      {/* Answers List */}
      <h3>{data.answers.length} Answers</h3>
      {data.answers.map(ans => (
        <div key={ans._id} style={{ background: '#f9f9f9', padding: 15, marginBottom: 10, borderRadius: 8 }}>
          <p>{ans.content}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <small>Answered by {ans.authorName}</small>
            <button onClick={() => handleLikeAnswer(ans._id)} style={{ cursor: 'pointer', border: 'none', background: 'none' }}>
               ❤️ {ans.likes.length}
            </button>
          </div>
        </div>
      ))}

      {/* Reply Box */}
      <div style={{ marginTop: 30 }}>
        <textarea 
          style={{ width: '100%', height: 100, padding: 10 }} 
          placeholder="Write your answer..."
          value={reply}
          onChange={e => setReply(e.target.value)}
        />
        <button onClick={handleReply} style={{ marginTop: 10, padding: '10px 20px', background: '#007bff', color: 'white', border: 'none' }}>
          Post Answer
        </button>
      </div>
    </div>
  );
};

export default QuestionDetail;