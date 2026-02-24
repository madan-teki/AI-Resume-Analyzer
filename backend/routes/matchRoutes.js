const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfjs = require("pdfjs-dist/legacy/build/pdf.js");

const { matchResumeToJD } = require("../services/matchService");

const upload = multer({ dest: "uploads/" });

async function extractText(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = new Uint8Array(buffer);

  const loadingTask = pdfjs.getDocument({ data });
  const pdf = await loadingTask.promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((it) => it.str);
    text += strings.join(" ") + "\n";
  }

  return text;
}

router.post(
  "/match",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "jd", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const resumeFile = req.files.resume[0];
      const jdFile = req.files.jd[0];

      const resumePath = path.join(resumeFile.path);
      const jdPath = path.join(jdFile.path);

      const resumeText = await extractText(resumePath);
      const jdText = await extractText(jdPath);

      const result = await matchResumeToJD(resumeText, jdText);

      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;