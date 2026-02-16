const SKILLS_DB = [
  "javascript",
  "react",
  "node",
  "node.js",
  "express",
  "mongodb",
  "mysql",
  "python",
  "java",
  "c++",
  "html",
  "css",
  "aws",
  "docker",
  "kubernetes",
  "git",
  "typescript",
  "next.js",
];

//detect skills from resume text
function extractSkills(text) {
  const lowerText = text.toLowerCase();

  const foundSkills = SKILLS_DB.filter(skill =>
    lowerText.includes(skill)
  );

  return [...new Set(foundSkills)];
}

//detect resume sections
function detectSections(text) {
  const lowerText = text.toLowerCase();

  return {
    education: lowerText.includes("education"),
    experience: lowerText.includes("experience"),
    projects: lowerText.includes("project"),
    skills: lowerText.includes("skill"),
  };
}

//calculate ATS score
function calculateScore(skills, sections) {
  let score = 0;
  score += Math.min(skills.length * 5, 40);

  if (sections.education) score += 15;
  if (sections.experience) score += 25;
  if (sections.projects) score += 15;
  if (sections.skills) score += 5;

  return Math.min(score, 100);
}

//analyzer
function analyzeResume(text) {
  const skills = extractSkills(text);
  const sections = detectSections(text);
  const score = calculateScore(skills, sections);

  return {
    skills,
    sections,
    score,
  };
}

module.exports = { analyzeResume };
