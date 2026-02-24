const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdfjs = require("pdfjs-dist/legacy/build/pdf.js");
const { analyzeResume } = require("../services/resumeAnalyzer");
const Resume = require("../models/Resume");
const { generateSummary } = require("../services/aiService");

// storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// file filter (PDF only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});


const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = path.join(__dirname, "..", "uploads", req.file.filename);

    const dataBuffer = fs.readFileSync(filePath);

    //extract text from PDF 
    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(dataBuffer) });
    const pdf = await loadingTask.promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(item => item.str);
      text += strings.join(" ") + "\n";
    }

    //AI analysis
    const analysis = analyzeResume(text);
 
    const summary = await generateSummary(text);
     analysis.summary = summary;

    //save to MongoDB
    const savedResume = await Resume.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      text,
      analysis,
    });

    res.json({
      message: "Resume uploaded, analyzed & saved",
      data: savedResume,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//to get resumes
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });

    res.json({
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { upload, uploadResume, getResumes };

