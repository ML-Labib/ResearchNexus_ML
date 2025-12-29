const { GoogleGenerativeAI } = require("@google/generative-ai");

// ⚠️ REPLACE THIS WITH YOUR ACTUAL API KEY FROM GOOGLE
const GOOGLE_API_KEY = process.env.AI_API_KEY; 

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

exports.summarizeText = async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const prompt = `Summarize the following text into a concise, easy-to-read paragraph: \n\n${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    res.json({ summary });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to process AI request" });
  }
};