import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as SpotifyStrategy } from 'passport-spotify';
import session from 'express-session';
import authRoutes from './routes/auth.js';
import spotifyRoutes from './routes/spotify.js';
import User from './models/User.js';

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wrapped_db';
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Spotify Strategy
passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/api/spotify/callback',
    },
    async (accessToken, refreshToken, expires_in, profile, done) => {
      try {
        let user = await User.findOne({ spotifyId: profile.id });

        if (!user) {
          user = new User({
            spotifyId: profile.id,
            username: profile.displayName,
            fullName: profile.displayName,
            email: profile.emails[0]?.value,
            spotifyAccessToken: accessToken,
            spotifyRefreshToken: refreshToken,
            tokenExpiresAt: new Date(Date.now() + expires_in * 1000),
            isSpotifyConnected: true
          });
          await user.save();
        } else {
          user.spotifyAccessToken = accessToken;
          user.spotifyRefreshToken = refreshToken;
          user.tokenExpiresAt = new Date(Date.now() + expires_in * 1000);
          user.isSpotifyConnected = true;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority'
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/spotify', spotifyRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
