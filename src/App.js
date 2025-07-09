// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// PAGES
import AuthPage            from "./AuthPage";
import Dashboard           from "./Dashboard";
import CleanersDashboard   from "./CleanersDashboard";

// CONTEXTS
import { BookingProvider } from "./BookingContext";
import { AuthProvider, useAuth } from "../AuthContext";   //  ⬅ you'll create this (snippet below)

/* ───────────────────────────
   Re-usable <PrivateRoute/>
──────────────────────────── */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p style={{textAlign:"center"}}>Checking credentials…</p>;
  if (!user)     return <Navigate to="/auth" replace />;

  return children;
}

/* ───────────────────────────
   APP ROOT
──────────────────────────── */
export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <Routes>
            {/* public route  */}
            <Route path="/auth" element={<AuthPage />} />

            {/* protected routes  */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/cleaners"
              element={
                <PrivateRoute>
                  <CleanersDashboard />
                </PrivateRoute>
              }
            />

            {/* fallback → auth */}
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}