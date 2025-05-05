"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../components/styles/Login.css";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      username,
      password,
    };

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful. Response data:", data);

        const userId = data._id || data.userId || data.user?._id;
        const username = data.username || data.user?.username;
        const token = data.token;
  
        if (!userId || !username || !token) {
          console.error("Missing fields in login response:", data);
          setErrorMessage("Login failed: Missing user data.");
          return;
        }
  
       
        localStorage.setItem("authToken", token);
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("userId", userId);
  
        router.push("/mainpage");
      } else {
        setErrorMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="box">
          <Link href="/" className="back">
            &#8592; Back to Home
          </Link>

          <h1>Login</h1>
          <p className="text">Welcome back! Please enter your details</p>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

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
            <button type="submit" className="btn">Log In</button>
          </form>

          <div className="link">
            Don’t have an account? <Link href="/createaccount">Get Started</Link>
          </div>
        </div>
      </div>

      <div className="login">
        <div className="welcome">
          <h2>Welcome back to <span>WRAPPED</span></h2>
          <p>Where music connects us all 🎶</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
