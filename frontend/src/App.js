import UploadResume from "./components/UploadResume";
import JDMatcher from "./components/JDMatcher";
import History from "./components/History";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

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
    <BrowserRouter>
      <div style={container}>
        <h1>AI Resume Analyzer</h1>

        {/* Navigation */}
        <nav style={{ marginBottom: 20 }}>
          <Link to="/" style={{ marginRight: 15 }}>Resume ATS Score Analysis</Link>
          <Link to="/matcher" style={{ marginRight: 15 }}>JD Compatibility</Link>
          <Link to="/history">History</Link>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <div style={card}>
                <UploadResume />
              </div>
            }
          />

          <Route
            path="/matcher"
            element={
              <div style={card}>
                <JDMatcher />
              </div>
            }
          />

          <Route
            path="/history"
            element={
              <div style={card}>
                <History />
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;