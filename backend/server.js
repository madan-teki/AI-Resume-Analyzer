require("dotenv").config();
const express = require("express");
const cors = require("cors");
const resumeRoutes = require("./routes/resumeRoutes");
const connectDB = require("./config/db");
const matchRoutes = require("./routes/matchRoutes");


const app = express();
connectDB();

//middlewear
app.use(cors());
app.use(express.json());

app.use("/api/resume",resumeRoutes);
app.use("/api",matchRoutes);

//route
app.get("/", (req, res) => {
  res.send("Resume Analyzer API running");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
