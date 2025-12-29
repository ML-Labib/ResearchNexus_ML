const Site = require('../models/Website');

exports.addSite = async (req, res) => {
  const { site_name, url, Gmail } = req.body;
  const task = await Task.create({ site_name, url, Gmail });
  res.json(task);
};

exports.getTasksByGroup = async (req, res) => {
  const { group_id } = req.params;
  const tasks = await Task.find({ group_id });
  res.json(tasks);
};
