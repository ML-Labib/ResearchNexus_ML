// controllers/aiController.js

// 1. Import the NEW SDK
const { GoogleGenAI } = require("@google/genai");

// 2. Setup the Client (Hardcoding key to be safe based on previous errors)
const GOOGLE_API_KEY = "AIzaSyANSQZKdNhj1ygcY-C5P1wY0MHN1h_esOo"; 

const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

exports.summarizeText = async (req, res) => {
  const { text } = req.body;
  console.log("🤖 Received text to summarize via New SDK...");

  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    // 3. Call the API using the structure from your docs
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using the model you saw in your screenshot
      contents: `Summarize this text in a concise paragraph: ${text}`,
    });

    // 4. Extract text (New SDK syntax is slightly different)
    // The docs say response.text is the string content
    const summary = response.text; 
    
    console.log("✅ Success!");
    res.json({ summary });

  } catch (error) {
    console.error("❌ AI Error:", error);
    // Send a readable error to frontend
    res.status(500).json({ error: error.message || "AI Error" });
  }
};