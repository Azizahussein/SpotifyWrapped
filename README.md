# Wrapped Backend

This is the backend server for the Wrapped music application, providing authentication and Spotify integration.

## Features

- User authentication (register/login)
- Spotify account connection
- Fetch user's top tracks
- Secure JWT-based authentication
- User profile management
- Recent tracks tracking

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (Atlas recommended)
- Spotify Developer Account
- Git

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=3001
   MONGODB_URI=mongodb+srv://<username>:<password>@wrapped.tq0hh.mongodb.net/?retryWrites=true&w=majority
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SESSION_SECRET=your_session_secret
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:3000
   ```

## Running the Server

1. Start MongoDB (if using local)
2. Start the server:
   ```bash
   npm start
   ```
3. Server will run on port 3001

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login existing user
- GET `/api/auth/users` - List all users (for testing)

### Spotify Integration
- GET `/api/spotify/login?userId={userId}` - Initiate Spotify connection
- GET `/api/spotify/callback` - Spotify OAuth callback
- GET `/api/spotify/top-tracks?userId={userId}` - Get user's top tracks

## Environment Variables

- `PORT` - Server port (default: 3001)
- `MONGODB_URI` - MongoDB connection string
- `SPOTIFY_CLIENT_ID` - Spotify client ID
- `SPOTIFY_CLIENT_SECRET` - Spotify client secret
- `SESSION_SECRET` - Session secret key
- `JWT_SECRET` - JWT secret key
- `FRONTEND_URL` - Frontend URL

## Security

- All sensitive data is stored in environment variables
- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- CORS is configured to allow requests from frontend
