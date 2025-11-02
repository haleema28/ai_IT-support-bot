// import Navbar from "../components/Navbar";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const navigate = useNavigate();
//   return (
//     <div>
//       <Navbar />
//       <div className="container-page py-12 text-center">
//         <div className="mx-auto max-w-3xl">
//           <h2 className="mb-3">Welcome to IT Support AI</h2>
//           <p className="text-slate-600 mb-8">
//             Create or track your IT support tickets easily.
//           </p>
//           <a href="/tickets" className="btn-primary">
//             Go to Tickets
//           </a>
//           <button
//             onClick={() => navigate("/chat/api")}
//             className ="btn-secondary bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
//             >
//               💬 Chat with AI
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, FileText } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex flex-col items-center justify-center px-6">
      {/* Header */}
      <div className="absolute top-5 left-8 text-2xl font-semibold text-blue-700">
        IT Support AI
      </div>

      {/* Logout Button */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
        className="absolute top-5 right-8 bg-white border border-gray-300 px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100 shadow-sm"
      >
        Logout
      </button>

      {/* Main Content */}
      <div className="bg-white shadow-lg rounded-3xl p-10 text-center max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to <span className="text-blue-600">IT Support AI</span>
        </h1>
        <p className="text-gray-600 mb-8">
          Create or track your IT support tickets easily, or chat with our AI
          assistant for instant help.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/tickets")}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition duration-200 shadow-md"
          >
            <FileText size={18} />
            Go to Tickets
          </button>

          <button
            onClick={() => navigate("/chat")}
            className="flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-xl hover:bg-purple-700 transition duration-200 shadow-md"
          >
            <MessageCircle size={18} />
            Chat with AI
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-5 text-gray-500 text-sm">
        © {new Date().getFullYear()} IT Support AI. All rights reserved.
      </footer>
    </div>
  );
}
