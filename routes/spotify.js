import express from 'express';
import querystring from 'querystring';
import User from '../models/User.js';

const router = express.Router();

// Initiate Spotify OAuth
router.get('/login', (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const scope = 'user-read-private user-read-email user-top-read';
  
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      state: userId, // Pass the user ID from the query
      show_dialog: 'true' 
    }));
});

// Spotify OAuth callback
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  console.log("Received state:", state);  // Log the state to verify
  const userId = state; // This is the user ID we passed earlier

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.redirect('http://localhost:3000/error?message=user_not_found');
    }

    // Exchange code for tokens
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64')
      },
      body: querystring.stringify({
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    });

    const data = await response.json();
    if (data.error) {
      console.error('Spotify token error:', data.error);
      return res.redirect('http://localhost:3000/error?message=spotify_token_error');
    }

    // Get user profile from Spotify
    const profileResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': 'Bearer ' + data.access_token
      }
    });

    const profile = await profileResponse.json();

    // Update user with Spotify info
    user.spotifyId = profile.id;
    user.spotifyAccessToken = data.access_token;
    user.spotifyRefreshToken = data.refresh_token;
    user.tokenExpiresAt = new Date(Date.now() + data.expires_in * 1000);
    user.isSpotifyConnected = true;
    await user.save();

    // Redirect back to frontend with success
    res.redirect('http://localhost:3000/mainpage?success=true');
  } catch (error) {
    console.error('Spotify callback error:', error);
    res.redirect('http://localhost:3000/error');
  }
});

// Get user's top tracks (refreshes token if expired)
router.get('/top-tracks', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user || !user.isSpotifyConnected) {
      return res.status(400).json({ error: 'User not found or Spotify not connected' });
    }

    // Refresh token if expired
    if (new Date() >= user.tokenExpiresAt) {
      console.log('Token expired, refreshing...');
      const refreshResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
          ).toString('base64')
        },
        body: querystring.stringify({
          grant_type: 'refresh_token',
          refresh_token: user.spotifyRefreshToken
        })
      });

      const refreshData = await refreshResponse.json();
      console.log('Refresh token response:', refreshData);

      if (refreshData.error) {
        console.error('Token refresh error:', refreshData.error);
        return res.status(401).json({ error: 'Failed to refresh token' });
      }

      user.spotifyAccessToken = refreshData.access_token;
      user.tokenExpiresAt = new Date(Date.now() + refreshData.expires_in * 1000);
      await user.save();
    }

    console.log("Using access token:", user.spotifyAccessToken);

    const tracksResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term', {
      headers: {
        'Authorization': 'Bearer ' + user.spotifyAccessToken
      }
    });

    const data = await tracksResponse.json();
    console.log("Spotify top tracks response:", data);

    if (data.error) {
      console.error('Spotify API error:', data.error);
      return res.status(500).json({ error: 'Failed to fetch top tracks', details: data.error });
    }

    const tracks = data.items.map(track => ({
      trackId: track.id,
      trackName: track.name,
      artistName: track.artists[0].name,
      albumArt: track.album.images[0]?.url
    }));

    user.topTracks = tracks;
    await user.save();

    res.json({ tracks });
  } catch (error) {
    console.error('Unhandled error in /top-tracks:', error);
    res.status(500).json({ error: 'Failed to fetch top tracks' });
  }
});

export default router;