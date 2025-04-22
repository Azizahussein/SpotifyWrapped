"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../components/styles/Createaccount.css";

const CreateAccount = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [spotifyLinked, setSpotifyLinked] = useState(false);
  const [error, setError] = useState("");

  const handleSpotifyLink = () => {
    window.open("https://accounts.spotify.com/en/login", "_blank");
    setSpotifyLinked(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password || !spotifyLinked) {
      setError("All fields are required, including linking Spotify.");
      return;
    }

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", username);
    router.push("/mainpage");
  };

  return (
    <div className="page">
      <div className="container">
        <div className="box">
          <Link href="/" className="back">&#8592;</Link>

          <h1>Create Account</h1>
          <p className="text">Enter your info and link your Spotify account</p>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit} noValidate>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className={`btn spotify ${spotifyLinked ? "linked" : ""}`}
              onClick={handleSpotifyLink}
            >
              {spotifyLinked ? "Spotify Linked ✅" : "Login with Spotify"}
            </button>

            <button type="submit" className="btn">Create Account</button>
          </form>

          <div className="link">
            Already have an account? <Link href="/login">Log In</Link>
          </div>
        </div>
      </div>

      <div className="login">
        <div className="welcome">
          <h2>Welcome to <span>WRAPPED</span></h2>
          <p>Where music connects us all 🎵</p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
