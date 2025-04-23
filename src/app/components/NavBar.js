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
    setIsLoggedIn(loginStatus === "true");
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

  function navigateTo(path) {
    router.push(path);
  }

  let buttonText = "Login";
  if (pathname === "/mainpage" && isLoggedIn) {
    buttonText = "Logout";
  }

  return (
    <nav className="navbar">
      <div className="left">
        <h1 className="logo" onClick={() => navigateTo("/mainpage")} style={{ cursor: "pointer" }}>
          Wrapped
        </h1>
        <div className="menu">
          <span className="option" onClick={() => navigateTo("/mainpage")}>Home</span>
          <span>|</span>
          <span className="option" onClick={() => navigateTo("/about")}>About Us</span>
          <span>|</span>
          <span className="option" onClick={() => navigateTo("/contact")}>Contact Us</span>
        </div>
      </div>

      <div className="right" onClick={handleButtonClick}>
        <Button text={buttonText} />
      </div>
    </nav>
  );
}

export default Navbar;

