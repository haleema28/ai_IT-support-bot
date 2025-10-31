import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import Navbar from "../components/Navbar";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({ title: "", description: "" });
  const role = localStorage.getItem("role");

  const fetchTickets = async () => {
    const res = await axios.get("/tickets/my");
    setTickets(res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await axios.post("/tickets", newTicket);
    setNewTicket({ title: "", description: "" });
    fetchTickets();
  };

  useEffect(() => {
    if (role !== "employee") {
      window.location.href = "/it";
      return;
    }
    fetchTickets();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container-page py-8 max-w-4xl">
        <h2 className="mb-4">My Tickets</h2>

        <form onSubmit={handleCreate} className="card mb-6">
          <div className="card-body">
            <input className="input mb-2" placeholder="Title"
            value={newTicket.title} onChange={(e)=>setNewTicket({...newTicket,title:e.target.value})}/>
            <textarea className="textarea mb-3" placeholder="Description"
            value={newTicket.description} onChange={(e)=>setNewTicket({...newTicket,description:e.target.value})}/>
            <button className="btn-primary">Create Ticket</button>
          </div>
        </form>

        {tickets.length === 0 ? (
          <p className="text-slate-500 text-center">No tickets yet.</p>
        ) : (
          <div className="grid gap-4">
            {tickets.map((t) => (
              <div key={t._id} className="card">
                <div className="card-body">
                  <h3 className="font-semibold text-slate-900">{t.title}</h3>
                  <p className="text-slate-600 mt-1 mb-2">{t.description}</p>
                  <p className="text-xs text-slate-500">Status: {t.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
