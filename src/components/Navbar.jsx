import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogoClick = () => {
    navigate("/dashboard");
    window.location.reload();
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 
                       text-white px-8 py-4 flex justify-between items-center shadow-md">

      <div className="flex items-center space-x-6">

        <button onClick={handleLogoClick} className="text-xl font-bold">
          Logo
        </button>

        <button onClick={() => navigate("/dashboard")}
          className={`px-4 py-2 rounded-lg ${isActive("/dashboard") ? "bg-white/30" : "hover:bg-white/20"}`}>
          Home
        </button>

        <button onClick={() => navigate("/products")}
          className={`px-4 py-2 rounded-lg ${isActive("/products") ? "bg-white/30" : "hover:bg-white/20"}`}>
          Products
        </button>

        <button onClick={() => navigate("/users")}
          className={`px-4 py-2 rounded-lg ${isActive("/users") ? "bg-white/30" : "hover:bg-white/20"}`}>
          Users
        </button>

        <button onClick={() => navigate("/carts")}
          className={`px-4 py-2 rounded-lg ${isActive("/carts") ? "bg-white/30" : "hover:bg-white/20"}`}>
          Carts
        </button>

      </div>

      {onLogout && (
        <button onClick={onLogout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600">
          Logout
        </button>
      )}
    </header>
  );
}

export default Navbar;
