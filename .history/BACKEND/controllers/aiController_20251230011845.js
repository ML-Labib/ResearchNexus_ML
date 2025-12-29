// controllers/aiController.js

exports.summarizeText = async (req, res) => {
  // 1. Log to terminal so we know the request arrived
  console.log("✅ CONNECTION SUCCESSFUL: Request reached the backend!");
  console.log("Text received:", req.body.text);

  // 2. Send back a fake summary immediately (No AI involved)
  // This proves your frontend and backend are talking correctly.
  res.json({ 
    summary: "SUCCESS! The backend is working. If you see this, your Route, Server, and Frontend are perfect. The issue is only with the Google API Key." 
  });
};