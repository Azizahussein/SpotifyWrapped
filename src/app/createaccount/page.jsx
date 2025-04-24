"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../components/styles/Createaccount.css";

const CreateAccount = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const accountData = {
      username,
      password,
      email: `${username}@wrapped.com`,
    };

    try {
      const response = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", data._id); // Store userId
        localStorage.setItem("username", data.username); // Store username

        console.log('Spotify Login URL:', data.spotifyLoginUrl);
        window.location.href = data.spotifyLoginUrl;
      } else {
        setError(data.error || "An error occurred while creating the account.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="box">
          <Link href="/" className="back">&#8592; Back to Home</Link>
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

            <button type="submit" className="btn">
              Create Account & Link Spotify
            </button>
          </form>

          <div className="link">
            Already have an account? <Link href="/login">Log In</Link>
          </div>
        </div>
      </div>

      <div className="login">
        <div className="welcome">
          <h2>
            Welcome to <span>WRAPPED</span>
          </h2>
          <p>Where music connects us all 🎵</p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
