import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BookingProvider } from './BookingContext';
import { AuthProvider } from 'context/AuthContext';   // ✅ NEW

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
-   <BookingProvider>
-     <App />
-   </BookingProvider>
+   <AuthProvider>            {/* 🔐 makes auth available app-wide */}
+     <BookingProvider>       {/* 🧹 your existing context */}
+       <App />
+     </BookingProvider>
+   </AuthProvider>
  </React.StrictMode>
);