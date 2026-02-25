import { useState } from "react";
import { Link } from "react-router-dom";

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  marginBottom: 30
};

const resultCard = {
  marginTop: 20,
  padding: 18,
  background: "#eef3ff",
  borderRadius: 8
};

const tag = {
  display: "inline-block",
  padding: "4px 10px",
  margin: "4px",
  borderRadius: 12,
  background: "#e8f0ff",
  fontSize: 13
};

function UploadResume() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select a file");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const analysis = response?.data?.analysis;
  const filename = response?.data?.originalName;

  return (
    <div style={card}>
      <div style={{ textAlign: "right", marginBottom: 10 }}>
        <Link to="/history">History</Link>
      </div>

      <h2>AI Resume Analysis</h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload} style={{ marginLeft: 10 }}>
        Upload Resume
      </button>

      {loading && <p>Uploading & analyzing...</p>}

      
      {analysis && (
        <div style={resultCard}>
          <h3>Resume Uploaded & Analyzed</h3>

          <p>
            <b>File:</b> {filename}
          </p>

          <p>
            <b>ATS Score:</b> {analysis.score}
          </p>

          <div>
            <b>Skills:</b>
            <div>
              {analysis.skills?.map((s, i) => (
                <span key={i} style={tag}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <b>Sections:</b>
            <ul>
              {Object.entries(analysis.sections || {}).map(
                ([sec, present]) => (
                  <li key={sec}>
                    {sec}: {present ? "✔️" : ""}
                  </li>
                )
              )}
            </ul>
          </div>

          {analysis.summary && (
            <div style={{ marginTop: 10 }}>
              <b>AI Summary:</b>
              <p style={{ marginTop: 6 }}>{analysis.summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UploadResume;