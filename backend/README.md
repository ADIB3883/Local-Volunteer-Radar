# Local Volunteer Radar - Backend

This is the backend server for the Local Volunteer Radar application. It provides REST API endpoints for user authentication, event management, and data persistence.

## Features

- User authentication (volunteers, organizers, and admin)
- Password hashing with bcrypt
- JWT token-based authentication
- File-based data storage (JSON files)
- CORS enabled for cross-origin requests

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 5000 by default. You can change this by setting the `PORT` environment variable.

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
JWT_SECRET=your-secret-key-here
```

**Important**: Change the `JWT_SECRET` in production for security.

## API Endpoints

### Authentication

#### Volunteer Signup
- **POST** `/api/auth/signup/volunteer`
- Body: `{ fullName, email, password, phoneNumber, address, skills }`

#### Organizer Signup
- **POST** `/api/auth/signup/organizer`
- Body: `{ organizationName, email, password, phoneNumber, organizationType, description, address }`

#### Login
- **POST** `/api/auth/login`
- Body: `{ email, password, userType }`

### Events

- **GET** `/api/events` - Get all events
- **POST** `/api/events` - Create a new event
- **PUT** `/api/events/:id` - Update an event

### Registrations

- **GET** `/api/registrations` - Get all registrations
- **POST** `/api/registrations` - Create a new registration

### Notifications

- **GET** `/api/notifications` - Get all notifications
- **POST** `/api/notifications` - Create a new notification
- **PUT** `/api/notifications/:id` - Update a notification

### Announcements

- **GET** `/api/announcements` - Get all announcements
- **POST** `/api/announcements` - Create a new announcement

### Health Check

- **GET** `/api/health` - Check server status

## Data Storage

Data is stored in JSON files in the `backend/data/` directory:
- `volunteers.json` - Volunteer user accounts
- `organizers.json` - Organizer user accounts
- `events.json` - Event data
- `registrations.json` - Event registrations
- `notifications.json` - User notifications
- `announcements.json` - Event announcements

**Note**: The `data/` directory is excluded from git via `.gitignore`.

## Security

- Passwords are hashed using bcrypt before storage
- JWT tokens expire after 7 days
- CORS is configured to allow cross-origin requests
- Admin credentials are hardcoded for demo purposes (email: admin@gmail.com, password: admin123)

## Deployment

For production deployment:

1. Set the `JWT_SECRET` environment variable to a secure random string
2. Consider using a proper database instead of JSON files for better scalability
3. Set up proper logging and error monitoring
4. Use HTTPS for all communications
5. Configure CORS to only allow requests from your frontend domain
