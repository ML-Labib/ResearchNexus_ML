// controllers/aiController.js
const axios = require('axios'); // We use axios instead of the Google library

// PASTE YOUR KEY HERE
const API_KEY = "AIzaSyANSQZKdNhj1ygcY-C5P1wY0MHN1h_esOo"; 

exports.summarizeText = async (req, res) => {
  const { text } = req.body;
  console.log("🤖 Received text to summarize...");

  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    // 1. We call the REST API directly (Bypassing the SDK)
    // We use 'gemini-1.5-flash' because it is the most stable free model right now
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const response = await axios.post(url, {
      contents: [{
        parts: [{
          text: `Summarize this text in one clear paragraph: ${text}`
        }]
      }]
    });

    // 2. Extract the answer
    const summary = response.data.candidates[0].content.parts[0].text;
    
    console.log("✅ Success!");
    res.json({ summary });

  } catch (error) {
    // 3. THIS WILL TELL US THE EXACT REASON IN THE TERMINAL
    console.error("❌ ERROR DETAILS:", error.response?.data?.error || error.message);
    
    const errorMessage = error.response?.data?.error?.message || "AI Error";
    res.status(500).json({ error: errorMessage });
  }
};