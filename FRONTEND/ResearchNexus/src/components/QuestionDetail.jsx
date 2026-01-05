import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate
import { 
  getQuestionDetail, 
  postAnswer, 
  toggleLike, 
  deleteQuestion, // Import this
  deleteAnswer    // Import this
} from '../services/api';

const QuestionDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook to redirect after deleting question
  const [data, setData] = useState(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const res = await getQuestionDetail(id);
      setData(res.data);
    } catch (error) {
      console.error("Error loading data", error);
    }
  };

  const handleReply = async () => {
    if(!reply.trim()) return;
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

  // --- NEW: DELETE LOGIC ---

  const handleDeleteQuestion = async () => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      await deleteQuestion(id);
      navigate('/community'); // Go back to the list
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (window.confirm("Delete your answer?")) {
      await deleteAnswer(answerId);
      loadData(); // Refresh the list
    }
  };

  if (!data) return <div style={{padding:40}}>Loading...</div>;

  return (
    <div style={{ padding: 40, maxWidth: '800px', margin: '0 auto' }}>
      
      {/* --- QUESTION SECTION --- */}
      <div className="main-q" style={{ borderBottom: '2px solid #eee', marginBottom: 20, paddingBottom: 20 }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
            <h1 style={{margin:0}}>{data.question.title}</h1>
            
            {/* 🔴 DELETE BUTTON (Only visible to Author) */}
            {user.Gmail === data.question.authorEmail && (
                <button 
                    onClick={handleDeleteQuestion}
                    style={{background:'red', color:'white', border:'none', padding:'5px 10px', borderRadius:'5px', cursor:'pointer'}}
                >
                    Delete Question
                </button>
            )}
        </div>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{data.question.content}</p>
        <small style={{color:'#666'}}>Asked by <b>{data.question.authorName}</b></small>
      </div>

      {/* --- ANSWERS SECTION --- */}
      <h3>{data.answers.length} Answers</h3>
      
      {data.answers.map(ans => (
        <div key={ans._id} style={{ background: '#fff', border:'1px solid #ddd', padding: 15, marginBottom: 15, borderRadius: 8 }}>
          <p style={{marginTop:0}}>{ans.content}</p>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <div>
                <small style={{color:'#888'}}>Answered by <b>{ans.authorName}</b></small>
                
                {/* 🔴 DELETE ANSWER BUTTON (Only visible to Answer Author) */}
                {user.Gmail === ans.authorEmail && (
                    <span 
                        onClick={() => handleDeleteAnswer(ans._id)} 
                        style={{marginLeft: 15, color: 'red', cursor: 'pointer', fontSize: '0.9rem'}}
                    >
                        Delete
                    </span>
                )}
            </div>

            <button 
                onClick={() => handleLikeAnswer(ans._id)} 
                style={{ cursor: 'pointer', border: 'none', background: 'none', color: ans.likes.includes(user.Gmail) ? 'red' : 'black' }}
            >
               {ans.likes.includes(user.Gmail) ? '❤️' : '🤍'} {ans.likes.length}
            </button>
          </div>
        </div>
      ))}

      {/* --- REPLY BOX --- */}
      <div style={{ marginTop: 40, borderTop:'1px solid #eee', paddingTop: 20 }}>
        <h4>Your Answer</h4>
        <textarea 
          style={{ width: '100%', height: 100, padding: 10, borderRadius: 8, border: '1px solid #ccc' }} 
          placeholder="Write your answer..."
          value={reply}
          onChange={e => setReply(e.target.value)}
        />
        <button onClick={handleReply} style={{ marginTop: 10, padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: 5, cursor:'pointer' }}>
          Post Answer
        </button>
      </div>
    </div>
  );
};

export default QuestionDetail;