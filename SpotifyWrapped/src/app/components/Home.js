import React from 'react';
import Navbar from './NavBar';
import Link from 'next/link';
import './styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <Navbar />

      <div className="section" id="home">
        <h1>Welcome</h1>
        <h2>To Wrapped!</h2>
        <p>
          Explore your top songs, artists, and genres in a fun and simple way. 
          Discover what your friends are listening to, share your vibes, and connect through music.
        </p>
        <Link href="/createaccount">
          <button className="getstarted">Get Started</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;