export default function Navbar() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href={localStorage.getItem("role") === "it_support" ? "/it" : "/tickets"} className="brand">IT Support AI</a>
        <button
          onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
          className="btn-ghost"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
