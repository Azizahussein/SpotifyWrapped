"use client";
import React from "react";
import "./styles/Button.css";

const Button = ({ text }) => {
  return (
    <button className="nbtn">
      {text}
    </button>
  );
};

export default Button;
