# MeetLink

### Full-Stack Video Conferencing Platform

MeetLink is a full-stack web application for joining video meetings, sharing screens, and exchanging messages in real time. It combines a React frontend, an Express backend, Socket.IO signaling, WebRTC media connections, and MongoDB. Users can register, sign in, join meetings with a code, and view their meeting history. Guests can enter a meeting code from the landing page and join through a username lobby without creating an account.

[Live Demo](https://meetlink-frontend.onrender.com) · [GitHub](https://github.com/Parth-Gorasiya/MeetLink)

> **Demo note:** MeetLink uses Render's free-tier backend hosting. After inactivity, the first request may take 50 seconds or longer while the service starts.

## Features

### Authentication and protected pages

- Registration and login with username/password credentials.
- Password hashing and verification with bcrypt.
- Random authentication tokens generated with Node.js crypto.
- Tokens stored in the browser's local storage and checked against user records for meeting-history requests.
- Authentication guard for the home and history pages.
- Logout by removing the locally stored token.

### Meetings and guest access

- Join meetings using a shared meeting code.
- Join as a guest through a meeting-code dialog on the landing page.
- Username lobby before entering a video call.
- Shareable meeting URLs.
- Local video preview and remote participant video display.
- Participant join and leave notifications through Socket.IO.
- Camera and microphone controls.
- Screen sharing through the browser's display-capture API.

### Real-time chat and meeting history

- In-meeting chat delivered through Socket.IO.
- Unread message count.
- Chat history replayed to participants joining an active room.
- Meeting codes and dates displayed on the history page.
- Meeting-history records stored in MongoDB for authenticated users.
- Token validation before saving or retrieving a user's history.

### Validation and error handling

- Required-field checks for registration and login.
- Meeting-code and token validation for history requests.
- Appropriate error responses for missing credentials, invalid tokens, and duplicate usernames.
- Backend startup error handling for database connection failures.
- Camera and microphone permission error logging.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Routing | React Router |
| UI | Material UI, CSS |
| HTTP client | Axios |
| Backend | Node.js, Express.js |
| Real-time signaling and chat | Socket.IO, socket.io-client |
| Audio and video | WebRTC, browser MediaDevices APIs |
| Database | MongoDB Atlas, Mongoose |
| Authentication | bcrypt, Node.js crypto, localStorage |
| Configuration | dotenv, environment variables |
| Development | nodemon, Git, GitHub |
| Hosting | Render Static Site and Render Web Service |

## Architecture

MeetLink uses a separate React frontend and Express backend. React renders the interface and manages browser media. Express handles authentication and meeting-history requests, while Socket.IO exchanges signaling messages and chat events. WebRTC carries media between participants.

The main project structure is:

```text
MeetLink/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── socketManager.js
│   │   │   └── userController.js
│   │   ├── models/
│   │   │   ├── meetingModel.js
│   │   │   └── userModels.js
│   │   ├── routes/
│   │   │   └── userRoutes.js
│   │   └── app.js
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Authentication.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── History.jsx
│   │   │   └── VideoMeet.jsx
│   │   ├── styles/
│   │   ├── utils/
│   │   │   └── withAuth.jsx
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
└── .gitignore
```

The application has three main communication paths:

- **REST:** React uses Axios to call Express endpoints for registration, login, and meeting history.
- **Signaling and chat:** Socket.IO forwards WebRTC offers, answers, ICE candidates, participant events, and text messages.
- **Media:** WebRTC peer connections transmit audio, camera video, and shared-screen video between participants.

## Run Locally

### 1. Prerequisites

- Node.js and npm.
- Git.
- A MongoDB connection string.
- A browser with WebRTC and media-device support.
- Camera and microphone permissions for video calls.

### 2. Clone the repository

```bash
git clone https://github.com/Parth-Gorasiya/MeetLink.git
cd MeetLink
```

### 3. Install dependencies

Install backend dependencies:

```bash
cd backend
npm ci
```

In a second terminal, install frontend dependencies from the repository root:

```bash
cd frontend
npm ci
```

### 4. Configure backend environment variables

Create a `.env` file inside `backend/`:

```env
PORT=8000
MONGO_URL=YOUR_MONGODB_CONNECTION_STRING
FRONTEND_URL=http://localhost:5173
```

Use the actual frontend origin if Vite runs on a different port. Keep `.env` out of Git.

Allow the backend's connection IP in your MongoDB Atlas project's IP access list.

### 5. Configure frontend backend URLs

The deployed frontend uses the hosted backend URL. To run against your local backend, update the Axios client in `frontend/src/contexts/AuthContext.jsx`:

```js
const client = axios.create({
    baseURL: "http://localhost:8000/api/v1/users",
});
```

Update the Socket.IO server URL in `frontend/src/pages/VideoMeet.jsx`:

```js
const server_url = "http://localhost:8000";
```

Restore the deployed URLs before publishing the frontend, or refactor these values into Vite environment variables.

### 6. Start the application

In the backend terminal:

```bash
npm run dev
```

In the frontend terminal:

```bash
npm run dev
```

Open the frontend URL printed by Vite, typically `http://localhost:5173`.

The backend test endpoint is `http://localhost:8000/home`.

## Route Overview

### Frontend routes

| Route | Purpose | Access |
|---|---|---|
| `/` | Landing page and guest meeting-code dialog | Public |
| `/auth` | Login and registration | Public |
| `/home` | Enter a meeting code and access history/logout | Login required by frontend guard |
| `/history` | View saved meeting history | Login required by frontend guard |
| `/:url` | Username lobby and video meeting | Public, including guests |

### Backend endpoints

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/home` | Basic backend response | Public |
| POST | `/api/v1/users/register` | Register a user | Public |
| POST | `/api/v1/users/login` | Authenticate and issue a token | Public |
| POST | `/api/v1/users/add_to_activity` | Save a meeting code | Valid token in request body |
| GET | `/api/v1/users/get_all_activity` | Retrieve meeting history | Valid token in query parameters |

## Authentication and Authorization

Registration hashes the user's password with bcrypt before saving it. Login verifies the password, generates a random token using `crypto.randomBytes(20)`, and saves that token on the user record. The frontend stores the returned token in local storage.

History endpoints look up the user by token and use that user's username to save or retrieve meeting records. The frontend's `withAuth` wrapper checks for a locally stored token before rendering protected pages; the backend independently validates the token for history operations.

The tokens are opaque random strings, rather than JWTs. A new login replaces the token saved on the user record, invalidating previously issued tokens. Logout currently removes the browser's copy; it does not revoke the server-side token.

Guest meetings remain accessible without registration.

## Data Relationships

| Model | Relevant fields | Purpose |
|---|---|---|
| User | `name`, `username`, `password`, `token` | Account details, password hash, and current token |
| Meeting | `user_id`, `meetingCode`, `date` | A user's saved meeting code and date |

Meeting history associates records with a user through `user_id`, which stores the username. It does not currently use a Mongoose ObjectId reference to the user.

Chat messages and active participant lists are maintained in backend memory rather than MongoDB.

## Meeting and Guest Join Behavior

An authenticated user enters a meeting code from the home page. The application saves the code to their history before navigating to the meeting URL.

A guest clicks **Join as Guest**, enters the same code, and navigates directly to the meeting lobby without saving authenticated history. The lobby asks for a username before connecting.

For example, both participants can use:

```text
https://meetlink-frontend.onrender.com/team123
```

The current socket implementation uses the full page URL as the room identifier. Participants should therefore use the same frontend origin and exact meeting URL.

Meeting codes identify rooms; there is no separate host approval or meeting-existence check. Entering a different code opens a different room.

## WebRTC and Screen Sharing

The browser requests camera and microphone access and attaches the local media stream to the preview video. Socket.IO forwards the signaling information needed to establish WebRTC peer connections.

Screen sharing uses `navigator.mediaDevices.getDisplayMedia()`. The browser asks the user to choose a screen, window, or tab, and the selected stream is used by the meeting's media logic.

Media permissions require a secure context, such as HTTPS or localhost. Screen-sharing and shared-audio capabilities vary by browser and selected capture source.

Socket.IO provides signaling and chat; it does not serve as a video-media relay.

## Socket Events and Chat Behavior

| Event | Direction | Purpose |
|---|---|---|
| `join-call` | Client → server | Register a participant in a room |
| `user-joined` | Server → clients | Announce a participant and room member IDs |
| `signal` | Bidirectional through server | Forward WebRTC signaling to a socket ID |
| `chat-message` | Bidirectional through server | Send messages and replay active-room history |
| `user-left` | Server → clients | Notify remaining participants of a departure |

The server keeps room connections and messages in memory. New participants receive the stored messages for that room. When the last participant disconnects, the room and its messages are removed. A backend restart also clears this data.

## Validation and Error Handling

Authentication handlers check required inputs and return errors for invalid credentials or duplicate users. History handlers reject missing or invalid tokens and empty meeting codes.

Database and controller errors are logged on the backend, while clients receive error responses. The server connects to MongoDB before listening for requests and exits if startup fails.

The frontend handles failed history requests and logs meeting-join or media-permission errors. The combined camera/microphone request requires access to both devices; a failure in either can reject the request.

## Deployment

MeetLink uses:

- **Frontend:** Render Static Site — [meetlink-frontend.onrender.com](https://meetlink-frontend.onrender.com)
- **Backend:** Render Web Service — [meetlink-backend-fqky.onrender.com](https://meetlink-backend-fqky.onrender.com/home)
- **Database:** MongoDB Atlas

### Backend settings

| Setting | Value |
|---|---|
| Root directory | `backend` |
| Build command | `npm ci` |
| Start command | `npm start` |

Configure these variables in the backend hosting environment:

```env
MONGO_URL=YOUR_MONGODB_CONNECTION_STRING
FRONTEND_URL=https://meetlink-frontend.onrender.com
```

The server reads the hosting provider's `PORT` environment variable. Express and Socket.IO CORS configurations use `FRONTEND_URL`.

Allow all outbound IP ranges shown under the backend service's **Connect → Outbound** panel in MongoDB Atlas Network Access.

### Frontend settings

| Setting | Value |
|---|---|
| Root directory | `frontend` |
| Build command | `npm ci && npm run build` |
| Publish directory | `dist` |

Configure a React Router fallback:

| Source | Destination | Action |
|---|---|---|
| `/*` | `/index.html` | Rewrite |

Both the Axios API URL and Socket.IO URL must point to the deployed HTTPS backend. The current frontend configuration keeps these URLs in source code and does not require frontend environment variables.

## Current Scope and Limitations

- MeetLink is a portfolio video-conferencing application.
- Meeting codes provide room selection, without host approval, waiting rooms, or room passwords.
- Call recording and scheduled meetings are not implemented.
- Meeting history records codes joined through the authenticated home page; it is not an attendance or call-duration report.
- Chat and room membership are stored in memory and are lost when the backend restarts.
- The current token system has no automatic expiry or server-side logout revocation.
- The current WebRTC configuration uses a STUN server without a configured TURN relay. Calls may fail on restrictive networks.
- Peer-to-peer connections are intended for small meetings; an SFU media architecture is not implemented.
- Screen sharing and shared audio depend on browser capabilities.
- Free-tier backend startup can delay initial requests.

## Author

**Parth Gorasiya**

[GitHub](https://github.com/Parth-Gorasiya) · [LinkedIn](https://www.linkedin.com/in/parth-gorasiya)

