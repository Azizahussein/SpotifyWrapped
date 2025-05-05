import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import "../components/styles/SongCard.css";


const SongCard = ({ variant = "small", username, songName, artistName, albumArt, date, likes }) => {

  const [currentLikes, setCurrentLikes] = useState(isNaN(Number(likes)) ? 0 : Number(likes));
  const [liked, setLiked] = useState(false);

  const handleLikeClick = () => {
    setLiked(!liked);
    setCurrentLikes(liked ? currentLikes - 1 : currentLikes + 1);
  };

  return (
    <div className={`song-card ${variant}`}>
      <img className="album-art" src={albumArt} alt={`${songName} album art`} />
      <div className="song-info">
        <h4>{songName}</h4>
        <p><strong>Artist:</strong> {artistName}</p>
        <p><strong>Shared by:</strong> {username}</p>
        <p><strong>Date:</strong> {date}</p>
      </div>
      <div className="likes">
        <button className="like-button" onClick={handleLikeClick}>
          <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} className={liked ? "liked" : ""} />
          <span>{currentLikes}</span>
        </button>
      </div>
    </div>

  
  );
};

export default SongCard;
