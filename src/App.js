import { HashRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import Project from "./project";

function App() {
  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="project" />} />
          <Route path="/project/*" element={<Project />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;