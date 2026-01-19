import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleLogoutClick = () => {
    setShowPopup(true);
  };

  const handleCancel = () => {
    setShowPopup(false);
  };


  const handleConfirmLogout = () => {
    localStorage.removeItem("token");   
    setShowPopup(false);
    navigate("/", { replace: true });   
  };

  return (
    <div className="home-container">

      <header className="home-header">
        <h2 className="logo">My Dashboard</h2>
        <button className="logout-btn" onClick={handleLogoutClick}>
          Logout
        </button>
      </header>

      <div className="home-content">
        <h1>Welcome to Home Page 🎉</h1>
        <p>You are successfully logged in.</p>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="popup-buttons">
              <button className="yes-btn" onClick={handleConfirmLogout}>
                Yes
              </button>
              <button className="no-btn" onClick={handleCancel}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;
