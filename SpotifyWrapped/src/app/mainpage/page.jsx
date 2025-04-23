"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import "../components/styles/MainPage.css";

const API = "http://localhost:3001";

export default function MainPage() {
  const params = useSearchParams();
  const userId  = params.get("userId");
  const success = params.get("success");
  const [tracks, setTracks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!userId) {
      setError("Missing userId—please log in.");
      setLoading(false);
      return;
    }

    fetch(`${API}/api/spotify/top-tracks?userId=${encodeURIComponent(userId)}`, {
      headers: { 
        "Authorization": `Bearer ${localStorage.getItem("token")}` 
      }
    })
      .then(res => res.json())
      .then(json => {
        if (json.error) throw new Error(json.error);
        setTracks(json.tracks);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <p>Loading your top tracks…</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <div className="mainpage">
      {success === "true" && (
        <div className="banner">🎉 Spotify linked successfully!</div>
      )}
      <h1>Your Top Tracks</h1>
      <ul className="track-list">
        {tracks.map(t => (
          <li key={t.trackId} className="track-item">
            <img src={t.albumArt} width={50} height={50} alt="" />
            <span>{t.trackName} — {t.artistName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
