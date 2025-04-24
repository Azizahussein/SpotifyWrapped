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

  // Dummy data for friends 
  const friendsSongs = [
    {
      username: "friend_1",
      songName: "Friend's Song 1",
      artistName: "Artist 1",
      albumArt: "https://upload.wikimedia.org/wikipedia/en/b/b2/Olivia_Rodrigo_-_SOUR.png", 
      date: "April 11, 2025",
      likes: 8
    },
    {
      username: "friend_2",
      songName: "Friend's Song 2",
      artistName: "Artist 2",
      albumArt: "https://m.media-amazon.com/images/I/71pxGj4RoVS.jpg", 
      date: "April 10, 2025",
      likes: 12
    },
    {
      username: "friend_3",
      songName: "Friend's Song 3",
      artistName: "Artist 3",
      albumArt: "https://d3vhc53cl8e8km.cloudfront.net/hello-staging/wp-content/uploads/2017/11/17171334/Top100Covers_Jon-Hopkins-Immunity.jpg", 
      date: "April 10, 2025",
      likes: 15
    },
    {
      username: "friend_4",
      songName: "Friend's Song 4",
      artistName: "Artist 4",
      albumArt: "https://www.billboard.com/wp-content/uploads/2022/05/bad-bunny-cover-art-2022-billboard-1240.jpg?w=1024", 
      date: "April 08, 2025",
      likes: 6
    }
  ];

  useEffect(() => {
    const fetchTopTrack = async () => {
      const userId = localStorage.getItem("userId"); // Fetch userId from localStorage
      const username = localStorage.getItem("username"); // Fetch username from localStorage
  
      if (!userId) { // If userId is not found, display error 
        setError("No userId found in localStorage.");
        setLoading(false);
        return;
      }
  
      try {
        const res = await fetch(`http://localhost:5001/api/spotify/top-tracks?userId=${userId}`);
        const data = await res.json();
  
        // Check if API response is successful and contains valid top tracks data
        if (res.ok && data.tracks && data.tracks.length > 0) {
          const firstTrack = data.tracks[0]; // Get the first track from the top tracks
          setTopSong({
            username: username || "You", 
            songName: firstTrack.trackName,
            artistName: firstTrack.artistName, 
            albumArt: firstTrack.albumArt, 
            date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), // Date
            likes: Math.floor(Math.random() * 20) + 1 // Random likes for display/demo
          });
        } else {
          setError(data.error || "Failed to fetch top tracks."); // Show error if no top tracks
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
  likes={topSong.likes}
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
  {friendsSongs.map((friend, idx) => (
    <SongCard
      key={idx}
      variant="small"
      username={friend.username}
      songName={friend.songName}
      artistName={friend.artistName}
      albumArt={friend.albumArt}
      date={friend.date}
      likes={friend.likes}
    />
  ))}
</div>
      </section>
    </div>
  );
};

export default MainPage;
