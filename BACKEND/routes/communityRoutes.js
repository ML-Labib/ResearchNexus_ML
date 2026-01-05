const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

router.post('/question', communityController.createQuestion);
router.get('/questions', communityController.getAllQuestions);
router.get('/question/:id', communityController.getQuestionDetail);
router.post('/answer', communityController.createAnswer);
router.put('/like', communityController.toggleLike);
router.delete('/question/:id', communityController.deleteQuestion);
router.delete('/answer/:id', communityController.deleteAnswer);


module.exports = router;