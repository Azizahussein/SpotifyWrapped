import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "../components/styles/SongCard.css";

const SongCard = ({ variant = "small", username, songName, artistName, albumArt, date, likes }) => {
  return (
    <div className={`song-card ${variant}`}>
      <img className="album-art" src={albumArt} alt={`${songName} album art`} />
      <div className="song-info">
        <h4>{songName}</h4>
        <p><strong>Artist:</strong> {artistName}</p>
        <p><strong>Shared by:</strong> {username}</p>
        <p><strong>Date:</strong> {date}</p>
        <p><FontAwesomeIcon icon={faHeart} className="icon" /> {likes}</p>
      </div>
    </div>
  );
};

export default SongCard;
