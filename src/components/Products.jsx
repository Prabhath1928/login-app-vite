import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Products() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  // 🔒 Protect route (stay on page after refresh if token exists)
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/", { replace: true });
    }
  }, []);

  const handleLogoutClick = () => {
    setShowPopup(true);
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-100 to-purple-200">

      <Navbar onLogout={handleLogoutClick} />

      <div className="flex items-center justify-center mt-24">
        <h1 className="text-3xl font-bold text-gray-700">
          Products Page (Coming Soon 🚧)
        </h1>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 
                        bg-black/40 backdrop-blur-sm">

          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500
                          p-8 rounded-2xl shadow-2xl w-96 text-center
                          border border-white/30">

            <h3 className="text-2xl font-bold mb-3 text-white drop-shadow">
              Confirm Logout
            </h3>

            <p className="text-white/90 mb-8">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-center gap-4">

              <button
                onClick={handleCancel}
                className="px-6 py-2 rounded-lg bg-white/20 text-white font-semibold
                           border border-white/40 hover:bg-white/30 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmLogout}
                className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold
                           hover:bg-red-600 transition shadow-lg"
              >
                Logout
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Products;
