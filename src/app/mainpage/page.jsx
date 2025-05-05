"use client";

import React, { useEffect, useState } from 'react';
import "../components/styles/MainPage.css"; 
import Navbar from "../components/NavBar";
import SongCard from "../components/SongCard"; 
import "../components/styles/Navbar.css"; 
import "../components/styles/SongCard.css"; 

const MainPage = () => {
  const [topSong, setTopSong] = useState(null);
  const [loading, setLoading] = useState(true);

  const [friendsSongs, setFriendsSongs] = useState([]);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchFriendsTracks = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
  
      try {
        const res = await fetch(`http://localhost:5001/api/spotify/friends-top-tracks?userId=${userId}`);
        const data = await res.json();
  
        if (res.ok && data.friends) {
          const formatted = data.friends.map(friend => ({
            username: friend.username,
            songName: friend.topTrack.trackName,
            artistName: friend.topTrack.artistName,
            albumArt: friend.topTrack.albumArt,
            date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            likes: Math.floor(Math.random() * 20) + 1
          }));
          setFriendsSongs(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch friends' top tracks:", err);
      }
    };
  
    fetchFriendsTracks();
  }, []);
  
  const handleFriendLike = (index) => {
    setFriendsSongs(prevSongs => {
      const updated = [...prevSongs];
      updated[index].likes += 1;
      return updated;
    });
  };

  useEffect(() => {
    const fetchTopTrack = async () => {
      const userId = localStorage.getItem("userId"); 
      const username = localStorage.getItem("username"); 
  
      if (!userId) { 
        const [error, setError] = useState(null);
        setLoading(false);
        return;
      }
  
      try {
        const res = await fetch(`http://localhost:5001/api/spotify/top-tracks?userId=${userId}`);
        const data = await res.json();
  
        
        if (res.ok && data.tracks && data.tracks.length > 0) {
          const firstTrack = data.tracks[0]; 
          setTopSong({
            username: username || "You", 
            songName: firstTrack.trackName,
            artistName: firstTrack.artistName, 
            albumArt: firstTrack.albumArt, 
            date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), 
            likes: Math.floor(Math.random() * 20) + 1 
          });
        } else {
          setError(data.error || "Failed to fetch top tracks.");
        }
      } catch (err) {
        console.error("Failed to fetch top track:", err);
        setError("Failed to fetch top track."); 
      } finally {
        setLoading(false);
      }
    };
  
    fetchTopTrack(); 
  }, []);

  return (
    <div>
      <Navbar />

      {/* Top Song */}
      <section className="section">
        <h2>Top Song of the Week</h2>
        <div className="box">
          {loading ? (
            <p>Loading your top song...</p>
          ) : topSong ? (
            <SongCard
  variant="large"
  username={topSong.username}
  songName={topSong.songName}
  artistName={topSong.artistName}
  albumArt={topSong.albumArt}
  date={topSong.date}
  onLike={() => {
    setTopSong(prev => ({
      ...prev,
      likes: prev.likes + 1
    }));
  }}
/>

          ) : (
            <p>No top track found. Make sure you're connected to Spotify.</p>
          )}
        </div>
        <a href="#" className="link">← Previous Weeks</a>
      </section>

      {/* Friends */}
      <section className="section section-friends">
        <h3>What Your Friends Are Listening To:</h3>
        <div className="grid">
    {friendsSongs.length > 0 ? (
      friendsSongs.map((friend, idx) => (
        <SongCard
          key={idx}
          username={friend.username}
          songName={friend.songName}
          artistName={friend.artistName}
          albumArt={friend.albumArt}
          date={friend.date}
          onLike={() => handleFriendLike(idx)}
              />
      ))
    ) : (
      <p>No friends' top tracks found.</p>
    )}
</div>
      </section>
    </div>
  );
};

export default MainPage;
