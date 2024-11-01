import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/output.css";

import DashboardPage from "./pages/DashboardPage";
import ErrorBoundary from "./utils/ErrorBoundary.utils";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/*" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
