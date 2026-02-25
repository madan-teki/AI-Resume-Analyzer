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
  You are an ATS resume summarization system.

  TASK:
  Write a concise professional resume summary based ONLY on the resume.

  STRICT RULES:
  - Return ONE paragraph only
  - 40 to 60 words
  - No options
  - No bullet points
  - No headings
  - No labels
  - No markdown
  - No special formatting
  - No explanations
  - Professional resume tone

  OUTPUT:
  Plain text summary only.

  Resume:

${text.slice(0, 4000)}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
}

module.exports = { generateSummary };