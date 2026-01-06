const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  authorName: String,
  authorEmail: String, // To identify who posted
  
  //emails of people who liked to prevent double voting
  likes: [{ type: String }], 
  
  // Count of answers to show in the list view
  answerCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);