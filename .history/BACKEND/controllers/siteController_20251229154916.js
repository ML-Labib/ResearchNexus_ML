const Site = require('../models/Websites');

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

exports.deleteSite = async (req, res) => {
  try {
    const { id } = req.params; // We will pass the _id here
    await Site.findByIdAndDelete(id); 
    res.json({ message: "Site deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting site" });
  }
};