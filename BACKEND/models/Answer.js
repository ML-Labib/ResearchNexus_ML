const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  content: { type: String, required: true },
  authorName: String,
  authorEmail: String,
  
  // Optional: If replying to a specific comment (Reddit style nesting)
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer', default: null },
  
  likes: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Answer', AnswerSchema);