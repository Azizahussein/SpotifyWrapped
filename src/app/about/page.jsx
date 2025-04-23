"use client";

import React from "react";
import "../components/styles/MainPage.css";
import "../components/styles/About.css"; 
import Navbar from "../components/NavBar";
import "../components/styles/Navbar.css";

const About = () => {
  const team = [
    { name: "Aziza Hussein", role: "Frontend", genre: "Pop" },
    { name: "Arvin Ezhilan", role: "Backend", genre: "Rap" },
    { name: "Alex Duong", role: "Frontend", genre: "KPop" },
    { name: "Mathew Uliasz", role: "Backend", genre: "EDM" },
    { name: "Jainil Patel", role: "Full Stack Dev", genre: "Indie" }
  ];

  return (
    <div>
      <Navbar />

      {/* About Us Section */}
      <section className="section">
        <h2>About MusicShare</h2>
        <div className="box about-box">
          <div className="info">
            <p>
              <strong>MusicShare</strong> is a social music platform where you
              can share your favorite tracks, discover new artists, and see what
              your friends are listening to in real-time.
            </p>
            <p>
              Whether you're a casual listener or a music junkie, MusicShare
              connects you to a community that loves music as much as you do.
            </p>
            <p>
              Join us and become a part of the rhythm — because music is better
              when it's shared.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section">
        <h3>Meet the Team</h3>
        <div className="grid">
          {team.map((member, idx) => (
            <div key={idx} className="card">
              <div className="preview">[Photo]</div>
              <p><strong>Name:</strong> {member.name}</p>
              <p><strong>Role:</strong> {member.role}</p>
              <p><strong>Favorite Genre:</strong> {member.genre}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;

