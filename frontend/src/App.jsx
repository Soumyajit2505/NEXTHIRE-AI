// NextHire AI - Application Root
// Defines the routing structure for the entire frontend.
// Handles public, protected, and redirect routes in one clean place.

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Page imports
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import ATSResults from "./pages/ATSResults";
import Ranking from "./pages/Ranking";
import Chatbot from "./pages/Chatbot";

// Component imports
import ProtectedRoute from "./components/ProtectedRoute";

/**
 * Safely read the JWT token from localStorage.
 * Returns an empty string if localStorage is unavailable
 * (for example in private browsing or restricted environments).
 */
function getToken() {
  try {
    const token = localStorage.getItem("token");
    return token ? token.trim() : "";
  } catch (error) {
    // localStorage may be blocked or unavailable
    return "";
  }
}

/**
 * PublicRoute
 * Used for pages that should not be visible once logged in.
 * If a valid token exists, redirect the user to the dashboard.
 */
function PublicRoute({ children }) {
  const token = getToken();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/**
 * App
 * Central routing configuration for NextHire AI.
 */
function App() {
  // Determine the initial landing route based on auth state
  const isAuthenticated = getToken() !== "";

  return (
    <BrowserRouter>
      <Routes>
        {/* Root route - send user to dashboard or login */}
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          }
        />

        {/* Public route - login page */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected route - recruiter dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected route - resume upload */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />

        {/* Protected route - screening results */}
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          }
        />

        {/* Protected route - ATS analysis results */}
        <Route
          path="/ats-results"
          element={
            <ProtectedRoute>
              <ATSResults />
            </ProtectedRoute>
          }
        />

        {/* Protected route - candidate ranking */}
        <Route
          path="/ranking"
          element={
            <ProtectedRoute>
              <Ranking />
            </ProtectedRoute>
          }
        />

        {/* Protected route - AI chatbot assistant */}
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <Chatbot />
            </ProtectedRoute>
          }
        />

        {/* Fallback route - any unknown path redirects safely */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;