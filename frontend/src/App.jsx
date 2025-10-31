import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import ITDashboard from "./pages/ITDashboard";

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
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
