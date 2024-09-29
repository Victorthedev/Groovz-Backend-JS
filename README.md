# Groovz - Spotify Playlist Generator

Groovz is a web application that allows users to create custom Spotify playlists based on a seed track. It uses the Spotify Web API to authenticate users, fetch their playlists, and generate new playlists with recommended tracks.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [License](#license)

## Features

- Spotify OAuth 2.0 authentication
- Fetch user's Spotify playlists
- Create custom playlists based on a seed track
- Error handling and logging

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm (v6 or later)
- A Spotify Developer account and registered application

## Installation

1. Clone the repository:
- git clone https://github.com/yourusername/groovz.git
- cd groovz

2. Install the dependencies:
- npm install

## Configuration

1. Create a `.env` file in the root directory of the project.

2. Add the following environment variables to the `.env` file:
- CLIENT_URL=http://localhost:5173
- PORT=4000
- SPOTIFY_CLIENT_ID=your_spotify_client_id
- SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
- SPOTIFY_REDIRECT_URI=http://localhost:4000/auth/callback

Replace `your_spotify_client_id` and `your_spotify_client_secret` with your actual Spotify application credentials.

## Usage

To start the server, run:
- npm start

The server will start running on `http://localhost:4000` (or the port specified in your `.env` file).

## API Endpoints

### Authentication

- `GET /auth/login`: Initiates the Spotify OAuth 2.0 login process
- `GET /auth/callback`: Handles the Spotify OAuth 2.0 callback

### Playlists

- `GET /playlist`: Fetches the user's Spotify playlists
  - Query parameters:
    - `offset` (optional): The index of the first playlist to return (default: 0)
    - `limit` (optional): The maximum number of playlists to return (default: 20)

- `POST /playlist/create`: Creates a new playlist based on a seed track
  - Request body:
    ```json
    {
      "seedTrackId": "spotify:track:1234567890abcdef"
    }
    ```
  - Query parameters:
    - `userId`: The Spotify user ID for whom to create the playlist

## Project Structure
.
├── controllers
│ ├── authController.js
│ └── playlistController.js
├── routes
│ ├── authRoutes.js
│ └── playlistRoutes.js
├── services
│ └── spotifyService.js
├── utils
│ └── spotifyApi.js
├── .env
├── .gitignore
├── package.json
├── README.md
└── server.js

- `controllers/`: Contains the logic for handling requests and responses
- `routes/`: Defines the API routes and maps them to controller functions
- `services/`: Implements the business logic and interacts with external APIs
- `utils/`: Houses utility functions and configurations
- `server.js`: The main entry point of the application

## License

This project is licensed under the MIT License.