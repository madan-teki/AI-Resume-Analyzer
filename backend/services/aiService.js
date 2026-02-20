const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeResume(text) {
  const prompt = `
You are a professional resume reviewer.

Analyze the following resume text and return JSON with:
- summary
- skills
- experience_level
- strengths
- weaknesses
- suggestions

Resume:
${text}
`;

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });

  return response.output[0].content[0].text;
}

module.exports = { analyzeResume };