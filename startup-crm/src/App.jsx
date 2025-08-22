import React from "react";
import "./index.css";
import StartupCRM from "./components/StartupCRM";
import ToastProvider from "./components/ToastProvider";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <div>
        <ProtectedRoute>
          <StartupCRM />
        </ProtectedRoute>
        <ToastProvider />
      </div>
    </AuthProvider>
  );
}

export default App;
