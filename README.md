# Local-Volunteer-Radar

An SDP project for connecting volunteers with local volunteer opportunities.

## Project Structure

```
Local-Volunteer-Radar/
├── backend/              # Node.js/Express backend server
│   ├── server.js        # Main server file
│   ├── data/            # JSON file storage (gitignored)
│   └── README.md        # Backend documentation
└── Local-Volunteer-Radar/
    └── Frontend/        # React + Vite frontend
        ├── src/         # Source files
        └── public/      # Static assets
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ADIB3883/Local-Volunteer-Radar.git
cd Local-Volunteer-Radar
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../Local-Volunteer-Radar/Frontend
npm install
```

### Running the Application

You need to run both the backend and frontend servers.

#### 1. Start the Backend Server

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:5000`

#### 2. Start the Frontend Development Server

In a new terminal:

```bash
cd Local-Volunteer-Radar/Frontend
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

### Building for Production

#### Backend

The backend can be deployed as-is using Node.js on any hosting platform that supports Node.js applications.

#### Frontend

```bash
cd Local-Volunteer-Radar/Frontend
npm run build
```

This will create a `dist/` directory with the production build.

## Features

- **User Authentication**: Secure signup and login for volunteers and organizers
- **Volunteer Management**: Create and manage volunteer profiles with skills
- **Event Management**: Organizers can create and manage volunteer events
- **Event Registration**: Volunteers can register for events
- **Notifications**: Real-time notifications for users
- **Announcements**: Event-specific announcements
- **Admin Dashboard**: Administrative controls and analytics

## API Configuration

The frontend is configured to use the backend API. By default, it connects to `http://localhost:5000/api`.

To change the API URL for production, set the `VITE_API_URL` environment variable in the frontend:

```bash
# In Local-Volunteer-Radar/Frontend/.env
VITE_API_URL=https://your-production-api.com/api
```

## Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Tailwind CSS
- Lucide React (icons)

### Backend
- Node.js
- Express
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- CORS

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

See the LICENSE file for details.

