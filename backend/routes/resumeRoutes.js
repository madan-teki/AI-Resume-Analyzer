const express = require("express");
const router = express.Router();
const Resume = require("../models/Resume");

const { upload, uploadResume, getResumes } = require("../controllers/resumeController");

router.post("/upload", upload.single("resume"), uploadResume);

router.get("/", getResumes);

router.get("/history", async (req, res) => {
  try {
    const items = await Resume.find()
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
