import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import querystring from 'querystring';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      password: hashedPassword,
      fullName: username, // Using username as fullName initially
      email: email || `${username}@wrapped.com`, // Use email if provided, otherwise fallback to temporary format
      isSpotifyConnected: false, // Set this to false until Spotify is linked
    });

    await user.save();

    // Use string form of ObjectId
    const userId = user.id;

   
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

     // Spotify login URL
    const spotifyLoginUrl = `https://accounts.spotify.com/authorize?` +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email user-top-read',
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      state: userId,
      show_dialog: 'true' 
    });
    // Log the URL for debugging purposes
    console.log("Generated Spotify Login URL:", spotifyLoginUrl);

    res.status(201).json({
      _id: user._id,
      message: 'User registered successfully',
      token,
      username: user.username,
      isSpotifyConnected: user.isSpotifyConnected,
      spotifyLoginUrl: spotifyLoginUrl 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});
// Fetch all users (without password)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Don't return passwords
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      username: user.username,  // Send username directly
      userId: user._id,
      isSpotifyConnected: user.isSpotifyConnected,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});
export default router;
