import { useState } from "react";
import axios from "../api/axiosInstance";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      if (res.data?.user?.role) localStorage.setItem("role", res.data.user.role);
      const role = res.data?.user?.role;
      if (role === "it_support") {
        window.location.href = "/it";
      } else {
        window.location.href = "/tickets";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-full max-w-md">
        <form onSubmit={handleSubmit} className="card-body">
          <h2 className="text-center mb-6">Register</h2>
          {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
          <input className="input mb-3" placeholder="Name"
            value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/>
          <input className="input mb-3" placeholder="Email"
            value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/>
          <input className="input mb-3" placeholder="Password" type="password"
            value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}/>
          <select className="input mb-4"
            value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})}>
            <option value="employee">Employee</option>
            <option value="it_support">IT Support</option>
          </select>
          <button className="btn-primary w-full">Register</button>
          <p className="text-center text-sm mt-4 text-slate-600">
            Already have an account? <a href="/login" className="underline">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}
