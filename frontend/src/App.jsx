import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import ITDashboard from "./pages/ITDashboard";

import Chatbot from "./pages/Chatbot";
import KnowledgeBase from "./pages/KnowledgeBase";

export default function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {token && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tickets" element={role === "employee" ? <Tickets /> : <Navigate to="/it" />} />
            <Route path="/it" element={role === "it_support" ? <ITDashboard /> : <Navigate to="/tickets" />} />
            <Route path="/chat" element={role === "employee"? <Chatbot/> :<Navigate to ="/dashboard" />} />
            <Route path="/kb" element={role === "it_support"?(<KnowledgeBase/>): (<Navigate to ="/dashboard" />)} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
