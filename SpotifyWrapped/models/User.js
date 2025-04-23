import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema({
  trackId: String,
  trackName: String,
  artistName: String,
  albumArt: String,
  playedAt: Date
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  spotifyId: {
    type: String,
    default: undefined,
    sparse: true,
    index: { unique: true, sparse: true }
  },
  spotifyAccessToken: {
    type: String
  },
  spotifyRefreshToken: {
    type: String
  },
  tokenExpiresAt: {
    type: Date
  },
  isSpotifyConnected: {
    type: Boolean,
    default: false
  },
  recentTracks: [trackSchema],
  topTracks: [trackSchema],
  lastUpdated: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);
