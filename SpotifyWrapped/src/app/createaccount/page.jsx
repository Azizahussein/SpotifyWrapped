"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../components/styles/Createaccount.css";

const API = "http://localhost:3001";

export default function CreateAccount() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1) Call the backend register endpoint
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    // 2) Save token & userId
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user.id);

    // 3) Redirect to backend Spotify login (OAuth)
    window.location.assign(
      `${API}/api/spotify/login?userId=${data.user.id}`
    );
  };

  return (
    <div className="page">
      <div className="container">
        <div className="box">
          <Link href="/" className="back">
            &#8592;
          </Link>

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
              Create Account &amp; Link Spotify
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
}
