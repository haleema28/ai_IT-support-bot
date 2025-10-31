import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import Navbar from "../components/Navbar";

export default function ITDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAssigned = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/tickets/assigned");
      setTickets(res.data);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/tickets/${id}`, { status });
      fetchAssigned();
    } catch (e) {
      alert(e.response?.data?.message || "Failed to update");
    }
  };

  useEffect(() => { fetchAssigned(); }, []);

  return (
    <div>
      <Navbar />
      <div className="container-page py-8 max-w-5xl">
        <h2 className="mb-4">Assigned Tickets</h2>
        {loading ? (
          <p className="text-slate-500">Loading…</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : tickets.length === 0 ? (
          <p className="text-slate-500">No assigned tickets.</p>
        ) : (
          <div className="grid gap-4">
            {tickets.map((t) => (
              <div key={t._id} className="card">
                <div className="card-body">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{t.title}</h3>
                      <p className="text-slate-600 mt-1 mb-2">{t.description}</p>
                      <p className="text-xs text-slate-500">Status: {t.status}</p>
                    </div>
                    <div className="min-w-[180px] flex items-center gap-2">
                      <select
                        defaultValue={t.status}
                        onChange={(e) => updateStatus(t._id, e.target.value)}
                        className="input"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


