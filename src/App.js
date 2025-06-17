// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import CleanersDashboard from './CleanersDashboard';
import { BookingProvider } from './BookingContext'; // ✅ Wrap with context

function App() {
  return (
    <BookingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cleaners" element={<CleanersDashboard />} />
        </Routes>
      </Router>
    </BookingProvider>
  );
}

export default App;