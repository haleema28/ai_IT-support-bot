import { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function KnowledgeBase() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/kb/text", { title, text });
      setStatus("✅ Text document uploaded successfully!");
      setTitle("");
      setText("");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to upload text document");
    }
  };

  const handlePdfSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setStatus("⚠️ Please select a file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("/kb/pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("✅ PDF uploaded successfully!");
      setFile(null);
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to upload PDF");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">📚 Add Knowledge Base</h2>

        <form onSubmit={handleTextSubmit} className="space-y-3 mb-6">
          <input
            type="text"
            placeholder="Document Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />
          <textarea
            placeholder="Enter text content..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg h-32"
          ></textarea>
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full">
            Upload Text
          </button>
        </form>

        <form onSubmit={handlePdfSubmit} className="space-y-3">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border px-3 py-2 rounded-lg"
          />
          <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg w-full">
            Upload PDF
          </button>
        </form>

        {status && <p className="mt-4 text-center text-gray-700">{status}</p>}

        <button
          onClick={() => navigate("/it")}
          className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
        >
          ← Back to IT Dashboard
        </button>
      </div>
    </div>
  );
}
