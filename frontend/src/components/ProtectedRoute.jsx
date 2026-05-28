// NextHire AI - ProtectedRoute Component
// Guards private routes from unauthenticated users.
// Wrap any protected page like:
//   <ProtectedRoute><Dashboard /></ProtectedRoute>

import { Navigate } from "react-router-dom";

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
 * ProtectedRoute
 * Renders the child page only when a valid token is present.
 * Otherwise redirects the user to the login page.
 */
function ProtectedRoute({ children }) {
  const token = getToken();

  // Redirect to login if the token is missing or empty
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token exists, allow access to the protected page
  return children;
}

export default ProtectedRoute;