const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

async function generateSummary(text) {
  // fallback if no key
  if (!genAI) {
    return "Motivated candidate with strong technical skills and project experience.";
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
You are a resume expert.

Write a concise professional 2–3 line summary for this resume:

${text.slice(0, 4000)}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
}

module.exports = { generateSummary };