const Site = require('../models/Website');

exports.addSite = async (req, res) => {
  const { site_name, url, Gmail } = req.body;
  const site = await Site.create({ site_name, url, Gmail });
  res.json(site);
};

exports.getSite = async (req, res) => {
  const { group_id } = req.params;
  const tasks = await Task.find({ group_id });
  res.json(tasks);
};
