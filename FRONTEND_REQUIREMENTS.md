# Frontend Integration Requirements for Spotify Authentication

## Backend API Endpoints

### 1. Spotify Authentication
- **Endpoint**: `GET /auth/spotify`
- **Purpose**: Initiates Spotify OAuth flow
- **Frontend Action**: Redirect user to this endpoint when they click "Connect with Spotify"

### 2. Spotify Callback
- **Endpoint**: `GET /auth/spotify/callback`
- **Purpose**: Handles Spotify OAuth callback
- **Frontend Action**: No direct action needed, backend will redirect to frontend with success/failure

### 3. Get User's Top Tracks
- **Endpoint**: `GET /api/top-tracks`
- **Purpose**: Retrieves user's top 3 tracks from the past month
- **Authentication**: Requires valid session
- **Response Format**:
```json
{
  "tracks": [
    {
      "trackId": "string",
      "trackName": "string",
      "artistName": "string",
      "albumArt": "string",
      "playedAt": "date"
    }
  ]
}
```

### 4. Check Spotify Connection Status
- **Endpoint**: `GET /api/spotify-status`
- **Purpose**: Check if user has connected their Spotify account
- **Authentication**: Requires valid session
- **Response Format**:
```json
{
  "isConnected": boolean,
  "username": "string"
}
```

## Implementation Requirements

1. After user registration/login, show a "Connect with Spotify" button if the user hasn't connected their account yet
2. Add a Spotify connection status indicator in the user profile/settings
3. Implement error handling for failed Spotify connections
4. Handle the redirect from Spotify OAuth flow (backend will redirect to frontend with success/error status)
5. Add loading states while fetching top tracks data

## Authentication Flow

1. User logs in/registers through existing authentication system
2. User clicks "Connect with Spotify" button
3. Frontend redirects to `/auth/spotify`
4. Backend handles Spotify OAuth
5. Backend redirects back to frontend with success/failure status
6. Frontend updates UI based on connection status

## Error Scenarios to Handle

1. User denies Spotify permissions
2. Spotify API is unavailable
3. Session expired
4. Token refresh failures

## Security Notes

1. All API endpoints require valid session cookies
2. Never store Spotify tokens in frontend
3. Always use HTTPS for API calls
4. Validate all API responses before rendering

## Environment Variables Needed

```
FRONTEND_URL=http://localhost:3000
SPOTIFY_CALLBACK_URL=${FRONTEND_URL}/auth/callback
```
