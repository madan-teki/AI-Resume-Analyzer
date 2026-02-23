import { useState } from "react";

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

  return (
    <div style={{ marginTop: 30 }}>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload} style={{ marginLeft: 10 }}>
        Upload Resume
      </button>

      {loading && <p>Uploading & analyzing...</p>}

      {response?.data?.analysis?.summary && (
        <div
          style={{
            marginTop: 20,
            padding: 15,
            background: "#f3f6ff",
            borderRadius: 8,
          }}
        >
          <h3>🤖 AI Summary</h3>
          <p>{response.data.analysis.summary}</p>
        </div>
      )}


      {response && (
        <div style={{ marginTop: 20 }}>
          <h3>Server Response</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}



export default UploadResume;