import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/output.css";

import AdminDashboard from "./pages/AdminDashboardPage";
import DashboardPage from "./pages/DashboardPage";
import ErrorBoundary from "./utils/ErrorBoundary.utils";
import LoginPage from "./pages/LoginPage";
import { NotFound } from "./components/NotFound";
import { ServerError } from "./components/ServerError";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/*" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile/*" element={<AdminDashboard />} />

          <Route path="/NotFound" Component={NotFound} />
          <Route path="/ServerError" Component={ServerError} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
