"use client";

import React from "react";
import Navbar from "../components/NavBar";
import "../components/styles/Navbar.css";
import "../components/styles/Contact.css";

const Contact = () => {
  return (
    <div>
      <Navbar />

      <section className="section">
        <h2>Contact Us</h2>
        <div className="box contact-box">
          <b>We’d love to hear from you! Send us a message and we’ll get back to you soon.</b>

          <form className="form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" placeholder="Your Name" />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" placeholder="your@email.com" />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message:</label>
              <textarea id="message" rows="5" placeholder="Your message here..." />
            </div>

            <button type="submit">Send Message</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;

