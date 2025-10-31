import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="container-page py-12 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-3">Welcome to IT Support AI</h2>
          <p className="text-slate-600 mb-8">
            Create or track your IT support tickets easily.
          </p>
          <a href="/tickets" className="btn-primary">
            Go to Tickets
          </a>
        </div>
      </div>
    </div>
  );
}
