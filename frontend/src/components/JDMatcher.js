import { useState } from "react";

function JDMatcher() {
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    if (!resume || !jd) {
      alert("Please upload both Resume and Job Description");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jd", jd);

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/match", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Matching failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2> JD Compatibility Check</h2>

      <div style={{ marginTop: 10 }}>
        <label>Upload Resume: </label>
        <input type="file" accept=".pdf" onChange={(e) => setResume(e.target.files[0])} />
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Upload Job Description: </label>
        <input type="file" accept=".pdf,.txt" onChange={(e) => setJd(e.target.files[0])} />
      </div>

      <button onClick={handleMatch} style={{ marginTop: 15 }}>
        Check Compatibility
      </button>

      {loading && <p>Analyzing match...</p>}

      {result && (
        <div
          style={{
            marginTop: 20,
            padding: 15,
            background: "#eef2ff",
            borderRadius: 8,
          }}
        >
          <h3>Match Score: {result.score}%</h3>

          {result.matchedSkills && (
            <p>
              <b>Matched Skills:</b> {result.matchedSkills.join(", ")}
            </p>
          )}

          {result.missingSkills && result.missingSkills.length > 0 ? (
             <p>
               <b>Missing Skills:</b> {result.missingSkills.join(", ")}
             </p>
            ) : (
             <p><b>Missing Skills:</b> None </p>
          )}

         {result.improvements && result.improvements.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <b>Resume Improvements:</b>
            <ul style={{ marginTop: 5 }}>
              {result.improvements.map((imp, i) => (
                <li key={i}>{imp}</li>
              ))}
            </ul>
          </div>
        )}
        </div>
      )}
    </div>
  );
}

export default JDMatcher;