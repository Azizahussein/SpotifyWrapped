"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../components/styles/Login.css";

const Login = () => {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("loggedIn", "true");
    router.push("/mainpage");
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

          <form onSubmit={handleSubmit} noValidate>
            <input type="email" placeholder="Email"/>
            <input type="password" placeholder="Password" />
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
