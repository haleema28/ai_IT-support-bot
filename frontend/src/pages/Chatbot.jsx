import { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/chat/ask", { query: input });
      const reply = res.data.reply
        ? res.data.reply
        : res.data.answer || "No response received.";

      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (err) {
      console.error("Chatbot error:", err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "⚠️ Error contacting server. Please check backend connection.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          🤖 AI Support Chatbot
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Ask me anything related to IT support or troubleshooting!
        </p>

        <div className="h-96 overflow-y-auto border border-gray-200 rounded-xl p-4 bg-gradient-to-b from-gray-50 to-white shadow-inner transition-all">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 italic mt-20">
              Start the conversation by typing below 👇
            </p>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex mb-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-center text-gray-500 animate-pulse">
              Thinking...
            </div>
          )}
        </div>

        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 mt-5 border-t border-gray-200 pt-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition-all shadow-sm"
          >
            Send
          </button>
        </form>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl transition-all"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
