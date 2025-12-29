const Site = require('../models/Website');

exports.addSite = async (req, res) => {
  const { site_name, url, Gmail } = req.body;
  const site = await Site.create({ site_name, url, Gmail });
  res.json(site);
};

exports.getSiteByGmail = async (req, res) => {
  const { Gmail } = req.params;
  const sites = await Site.find({ Gmail });
  res.json(sites);
};
