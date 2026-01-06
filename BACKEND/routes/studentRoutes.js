const express = require('express');
const {
    getAllStudents,
    removeStudent
} = require('../controllers/studentController');

const router = express.Router();

router.get('/', getAllStudents);
router.delete('/:id', removeStudent);

module.exports = router;