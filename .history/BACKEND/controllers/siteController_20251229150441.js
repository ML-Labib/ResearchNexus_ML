const Task = require('../models/Task');

exports.addSite = async (req, res) => {
  const { Task_name, group_id, professor_email } = req.body;
  const task = await Task.create({ Task_name, group_id, professor_email });
  res.json(task);
};

exports.getTasksByGroup = async (req, res) => {
  const { group_id } = req.params;
  const tasks = await Task.find({ group_id });
  res.json(tasks);
};
