// Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup"); // or change to "/login" if you prefer
  };

  return (
    <div className="home-container">
      <div className="overlay">
        <h1 className="home-title">Welcome to Datsafi Cleaning System</h1>
        <p className="home-subtitle">
          Book trusted home cleaning professionals with ease.
        </p>
        <button className="start-button" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;