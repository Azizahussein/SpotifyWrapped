"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../components/styles/Createaccount.css";

const CreateAccount = () => {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("loggedIn", "true");
    router.push("/mainpage");
  };

  return (
    <div className="page">
      {/* Left Form Section */}
      <div className="container">
        <div className="box">
          <Link href="/" className="back">
            &#8592;
          </Link>

          <h1>Sign Up</h1>
          <p className="text">Fill the form below to create your account</p>

          <form onSubmit={handleSubmit} noValidate>
            <input type="text" placeholder="Full Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <input type="password" placeholder="Confirm Password" />
            <button type="submit" className="btn">Sign Up</button>
            <button type="button" className="btn google">Sign up with Google</button>
          </form>

          <div className="link">
            Already have an account? <Link href="/login">Log In</Link>
          </div>
        </div>
      </div>

      {/* Right Graphic Section */}
      <div className="login">
        <div className="welcome">
          <h2>Thank you for joining <span>WRAPPED</span></h2>
          <p>Where music connects us all 🎵</p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
