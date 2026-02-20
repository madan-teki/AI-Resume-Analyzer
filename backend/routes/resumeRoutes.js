const express = require("express");
const router = express.Router();

const { upload, uploadResume, getResumes } = require("../controllers/resumeController");

router.post("/upload", upload.single("resume"), uploadResume);

router.get("/", getResumes);

module.exports = router;
