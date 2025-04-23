# Spotify Wrapped

A full-stack application that integrates with Spotify to create personalized music experiences.

## Project Structure

- `/src` - Frontend Next.js application
- `/app.js` - Backend Express server
- `/models` - Database models
- `/routes` - API routes
- `/scripts` - Utility scripts

## Features

### Frontend
- Modern Next.js application
- Responsive UI with Tailwind CSS
- Real-time updates
- User-friendly interface

### Backend
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

### Frontend

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser

### Backend

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   PORT=3001
   MONGODB_URI=mongodb+srv://<username>:<password>@wrapped.tq0hh.mongodb.net/?retryWrites=true&w=majority
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SESSION_SECRET=your_session_secret
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:3000
   ```

3. Start MongoDB (if using local)
4. Start the backend server:
   ```bash
   npm run backend
   ```

## Running the Application

1. Start the backend server:
   ```bash
   npm run backend
   ```

2. In a new terminal, start the frontend:
   ```bash
   npm run dev
   ```

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new)
