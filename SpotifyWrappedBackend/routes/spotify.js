import express from 'express';
import querystring from 'querystring';
import fetch from 'node-fetch';
import User from '../models/User.js';

const router      = express.Router();
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;      // e.g. http://localhost:3001/api/spotify/callback
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
// 1) Kick off the OAuth flow
router.get('/login', (req, res) => {
  console.log('→ REDIRECT_URI in /login:', REDIRECT_URI);
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const authQuery = querystring.stringify({
    response_type: 'code',
    client_id:     process.env.SPOTIFY_CLIENT_ID,
    scope:         'user-read-private user-read-email user-top-read',
    redirect_uri:  REDIRECT_URI,
    state:         userId
  });

  res.redirect(`https://accounts.spotify.com/authorize?${authQuery}`);
});

// 2) Handle the callback & exchange code for tokens
router.get('/callback', async (req, res) => {
  const { code, state: userId } = req.query;
  if (!code || !userId) {
    return res.redirect(`${FRONTEND_URL}/error?message=missing_code_or_state`);
  }

  try {
    // Exchange code for access/refresh tokens
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' +
          Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')
      },
      body: querystring.stringify({
        grant_type:   'authorization_code',
        code,
        redirect_uri: REDIRECT_URI
      })
    });
    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      console.error('Spotify token error:', tokenData.error);
      return res.redirect(`${FRONTEND_URL}/error?message=spotify_token_error`);
    }

    // Fetch the user profile from Spotify
    const profileRes = await fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
    });
    const profile = await profileRes.json();

    // Find & update our User record
    const user = await User.findById(userId);
    if (!user) {
      return res.redirect(`${FRONTEND_URL}/error?message=user_not_found`);
    }

    user.spotifyId           = profile.id;
    user.spotifyAccessToken  = tokenData.access_token;
    user.spotifyRefreshToken = tokenData.refresh_token;
    user.tokenExpiresAt      = new Date(Date.now() + tokenData.expires_in * 1000);
    user.isSpotifyConnected  = true;
    await user.save();

    // Redirect back to the front-end with success
    res.redirect(
      `${FRONTEND_URL}/mainpage?userId=${userId}&success=true`
    );

  } catch (err) {
    console.error('Error in Spotify callback:', err);
    res.redirect(`${FRONTEND_URL}/error?message=exception`);
  }
});

// 3) (Optional) Expose top-tracks endpoint here as well
router.get('/top-tracks', async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user?.isSpotifyConnected) {
      return res.status(400).json({ error: 'Spotify not connected for this user' });
    }

    // Refresh token if expired
    if (new Date() >= user.tokenExpiresAt) {
      const refreshRes = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' +
            Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString('base64')
        },
        body: querystring.stringify({
          grant_type:    'refresh_token',
          refresh_token: user.spotifyRefreshToken
        })
      });
      const refreshData = await refreshRes.json();
      if (refreshData.error) {
        console.error('Token refresh error:', refreshData.error);
        return res.status(401).json({ error: 'Failed to refresh Spotify token' });
      }

      user.spotifyAccessToken = refreshData.access_token;
      user.tokenExpiresAt     = new Date(Date.now() + refreshData.expires_in * 1000);
      await user.save();
    }

    // Fetch top tracks
    const tracksRes = await fetch(
      'https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term',
      { headers: { 'Authorization': `Bearer ${user.spotifyAccessToken}` } }
    );
    const tracksData = await tracksRes.json();
    if (tracksData.error) {
      console.error('Spotify API error:', tracksData.error);
      return res.status(500).json({ error: 'Failed to fetch top tracks' });
    }

    // Map to a simpler shape
    const tracks = tracksData.items.map(t => ({
      trackId:    t.id,
      trackName:  t.name,
      artistName: t.artists[0]?.name,
      albumArt:   t.album.images[0]?.url
    }));

    res.json({ tracks });

  } catch (err) {
    console.error('Error fetching top tracks:', err);
    res.status(500).json({ error: 'Failed to fetch top tracks' });
  }
});

export default router;
