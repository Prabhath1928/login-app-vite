import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogoClick = () => {
    navigate("/dashboard");
    setOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/dashboard" },
    { name: "Products", path: "/products" },
    { name: "Users", path: "/users" },
    { name: "Carts", path: "/carts" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] 
                       bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500
                       border-b border-white/20 shadow-xl backdrop-blur-md">

      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">

        <button
          onClick={handleLogoClick}
          className="flex items-center gap-3"
        >
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl cursor-pointer">L</span>
          </div>
          <span className="text-xl font-semibold text-white hidden sm:block tracking-wide cursor-pointer">
            LO<span className="text-white-600 cursor-pointer">GO</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center bg-white/10 p-1.5 rounded-2xl border border-white/20">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavigate(link.path)}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive(link.path)
                  ? "bg-white text-indigo-700 shadow-md"
                  : "text-white hover:bg-white/20 cursor-pointer"
              }`}
            >
              {link.name}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div className="h-8 w-[2px] bg-white/30 mx-2" />
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl 
                         bg-red-500 text-white text-sm font-medium
                         hover:bg-red-600 transition-all shadow-lg active:scale-100 cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-xl bg-white/20 text-white hover:bg-white/30 transition"
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <div
        className={`md:hidden absolute top-20 left-0 right-0 
                    bg-gradient-to-b from-indigo-600 to-sky-500
                    border-t border-white/20 transition-all duration-300 ${
          open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-6 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavigate(link.path)}
              className={`block w-full text-left px-5 py-4 rounded-2xl cursor-pointer
                          text-sm font-semibold transition ${
                isActive(link.path)
                  ? "bg-white text-indigo-700"
                  : "text-white hover:bg-white/20"
              }`}
            >
              {link.name}
            </button>
          ))}

          {onLogout && (
            <button
              onClick={() => {
                onLogout();
                setOpen(false);
              }}
              className="block w-full text-left px-5 py-4 rounded-2xl 
                         bg-red-500 text-white text-sm font-semibold transition cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
