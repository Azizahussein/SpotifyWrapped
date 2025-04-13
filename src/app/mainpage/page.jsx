"use client";

import React from "react";
import "../components/styles/MainPage.css"; 
import Navbar from "../components/NavBar";
import "../components/styles/Navbar.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const MainPage = () => {
  return (
    <div>
      <Navbar />

      {/* Top Song */}
      <section className="section">
        <h2>Top Song of the Week</h2>
        <div className="box">
          <div className="preview">[Song Preview]</div>
          <div className="info">
            <p><strong>Song:</strong> Song Name Here</p>
            <p><strong>User:</strong> example_user</p>
            <p><strong>Date:</strong> April 12, 2025</p>
            <p>
              <strong>Likes:</strong>{" "}
              <FontAwesomeIcon icon={faHeart} className="icon" /> 10
            </p>
          </div>
        </div>
        <a href="#" className="link">← Previous Weeks</a>
      </section>

      {/* Friends */}
      <section className="section section-friends">
        <h3>What Your Friends Are Listening To:</h3>
        <div className="grid">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="card">
              <div className="preview">[Song Preview]</div>
              <p><strong>User:</strong> friend_{idx + 1}</p>
              <p><strong>Date:</strong> April 11, 2025</p>
              <p>
                <strong>Likes:</strong>{" "}
                <FontAwesomeIcon icon={faHeart} className="icon" /> 10
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainPage;
