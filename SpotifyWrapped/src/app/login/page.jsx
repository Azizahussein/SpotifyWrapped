"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../components/styles/Login.css";

const API = "http://localhost:3001";

export default function Login() {
  const router = useRouter();
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user.id);

    router.push(`/mainpage?userId=${data.user.id}&success=false`);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <p className="error">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="btn">Log In</button>
    </form>
  );
}