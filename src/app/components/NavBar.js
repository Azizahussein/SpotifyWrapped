"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Button from "./Button";
import "./styles/Navbar.css";

function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem("loggedIn");
    if (loginStatus === "true") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [pathname]);

  function handleButtonClick() {
    if (isLoggedIn) {
      localStorage.setItem("loggedIn", "false");
      setIsLoggedIn(false);
      router.push("/");
    } else {
      router.push("/login");
    }
  }

  let buttonText = "Login";
  if (pathname === "/mainpage" && isLoggedIn) {
    buttonText = "Logout";
  }

  return (
    <nav className="navbar">
      <div className="left">
        <h1 className="logo">Wrapped</h1>
        <div className="menu">
          <span className="option">Home</span>
          <span>|</span>
          <span className="option">About Us</span>
          <span>|</span>
          <span className="option">Contact Us</span>
        </div>
      </div>

      <div className="right">
        <div onClick={handleButtonClick}>
          <Button text={buttonText} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
