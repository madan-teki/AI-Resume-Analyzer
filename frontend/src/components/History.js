import { useEffect, useState } from "react";

function History() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/resume/history")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <h2>Resume Analysis History</h2>

      {items.length === 0 && <p>No history yet</p>}

      {items.map(item => (
        <div
          key={item._id}
          style={{
            background: "#fff",
            padding: 18,
            margin: "14px 0",
            borderRadius: 10,
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
          }}
        >
          <h4>{item.originalName}</h4>

          <p>
            <b>Score:</b> {item.analysis?.score}
          </p>

          <p>
            <b>Skills:</b>{" "}
            {item.analysis?.skills?.join(", ")}
          </p>

          <small>
            {new Date(item.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default History;