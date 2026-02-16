const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdfjs = require("pdfjs-dist/legacy/build/pdf.mjs");



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
    const dataBuffer = new Uint8Array(fs.readFileSync(filePath));
    const loadingTask = pdfjs.getDocument({ data: dataBuffer });
    const pdf = await loadingTask.promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(item => item.str);
      text += strings.join(" ") + "\n";
    }

    res.json({
      message: "Resume uploaded & parsed",
      filename: req.file.filename,
      text,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { upload, uploadResume };

