import UploadResume from "./components/UploadResume";
import JDMatcher from "./components/JDMatcher";

const container = {
  maxWidth: 900,
  margin: "40px auto",
  fontFamily: "Arial",
};

const card = {
  background: "white",
  padding: 25,
  borderRadius: 10,
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  marginBottom: 30,
};

function App() {
  return (
    <div style={container}>
      <h1>AI Resume Analyzer</h1>

      {/* Section 1 */}
      <div style={card}>
        <UploadResume />
      </div>

      {/* Section 2 */}
      <div style={card}>
        <JDMatcher />
      </div>
    </div>
  );
}

export default App;