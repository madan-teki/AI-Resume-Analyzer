const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    filename: String,
    originalName: String,
    text: String,
    analysis: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);