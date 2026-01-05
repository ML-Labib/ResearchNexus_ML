const Question = require('../models/Question');
const Answer = require('../models/Answer');

// 1. Create a Question
exports.createQuestion = async (req, res) => {
  try {
    const { title, content, authorName, authorEmail } = req.body;
    const newQ = await Question.create({ title, content, authorName, authorEmail });
    res.status(201).json(newQ);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// 2. Get All Questions (Newest First)
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// 3. Get Single Question + Its Answers
exports.getQuestionDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    const answers = await Answer.find({ questionId: id }).sort({ createdAt: 1 });
    res.json({ question, answers });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// 4. Post an Answer
exports.createAnswer = async (req, res) => {
  try {
    const { questionId, content, authorName, authorEmail } = req.body;
    
    const newA = await Answer.create({ questionId, content, authorName, authorEmail });
    
    // Update answer count on the question
    await Question.findByIdAndUpdate(questionId, { $inc: { answerCount: 1 } });
    
    res.status(201).json(newA);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// 5. Toggle Like (Works for Question OR Answer)
exports.toggleLike = async (req, res) => {
  try {
    const { id, type, userEmail } = req.body; // type = 'question' or 'answer'
    const Model = type === 'question' ? Question : Answer;
    
    const item = await Model.findById(id);
    
    // Check if user already liked
    if (item.likes.includes(userEmail)) {
      item.likes = item.likes.filter(email => email !== userEmail); // Unlike
    } else {
      item.likes.push(userEmail); // Like
    }
    
    await item.save();
    res.json({ likes: item.likes });
  } catch (err) { res.status(500).json({ error: err.message }); }
};