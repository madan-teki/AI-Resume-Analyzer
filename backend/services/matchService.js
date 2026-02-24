const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

async function matchResumeToJD(resumeText, jdText) {
  if (!genAI) {
    throw new Error("Gemini not initialized");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
You are a resume-job matching system.

Compare the resume and job description.

Return ONLY valid JSON.
No explanation.
No markdown.
No extra text.

FORMAT:
{
  "score": number,
  "matchedSkills": string[],
  "missingSkills": string[],
  "summary": string,
  "improvements": string[]
}

RULES:
- matchedSkills = skills present in BOTH resume and job description
- missingSkills = skills present in job description BUT NOT in resume
- improvements = short bullet-style improvement points
- Each improvement must start with an action verb
- Each improvement max 6 words
- No punctuation at end
- Extract only technical skills
- Keep each skill short (1–3 words)
- Do NOT invent skills not in JD
- score will be calculated by backend

Resume:
${resumeText.slice(0, 3000)}

Job Description:
${jdText.slice(0, 3000)}
`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text();

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("Invalid AI response");
  }

  const data = JSON.parse(match[0]);

  if (!Array.isArray(data.matchedSkills)) data.matchedSkills = [];
  if (!Array.isArray(data.missingSkills)) data.missingSkills = [];
  if (!Array.isArray(data.improvements)) data.improvements = [];

  data.improvements = data.improvements.map(p =>
    p.replace(/[.]/g, "").trim()
  );

  const totalSkills =
    data.matchedSkills.length + data.missingSkills.length;

  data.score =
    totalSkills === 0
      ? 0
      : Math.round(
          (data.matchedSkills.length / totalSkills) * 100
        );

  return data;
}

module.exports = { matchResumeToJD };