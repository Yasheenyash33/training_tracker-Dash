# Training Tracker Frontend

A React-based frontend application for the Training Tracker system, built with Material-UI and connected to a Django REST API backend.

## Features

- **Authentication System**: Login/logout functionality with JWT tokens
- **Dashboard**: Overview of training statistics and quick actions
- **Programs Management**: Create, read, update, and delete training programs
- **Batches Management**: Manage training batches with program assignments
- **Progress Tracking**: Monitor trainee progress across different topics
- **User Management**: Admin interface for managing system users
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **React 18**: Frontend framework
- **Material-UI**: Component library for consistent UI
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication
- **React Hook Form**: Form handling (ready for implementation)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Django backend running on `http://127.0.0.1:8000`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Removes the single build dependency

## API Configuration

The frontend is configured to connect to the Django backend at `http://127.0.0.1:8000/api`. Make sure:

1. The Django server is running
2. CORS is properly configured in Django settings
3. Authentication endpoints are accessible

## User Roles

The application supports different user roles:

- **Admin**: Full access to all features including user management
- **Trainer**: Can manage batches and view progress
- **Trainee**: Can view their own progress and enrolled batches

## Components Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard and overview
│   ├── programs/       # Program management
│   ├── batches/        # Batch management
│   ├── progress/       # Progress tracking
│   ├── users/          # User management
│   └── layout/         # Layout and navigation
├── contexts/           # React contexts (Auth, etc.)
├── services/           # API service functions
└── App.js             # Main application component
```

## Development Notes

- The application uses JWT tokens for authentication
- All API calls are handled through the centralized API service
- Material-UI theme is configured with custom colors
- Responsive design implemented using Material-UI's grid system
- Error handling is implemented for all API calls

## Future Enhancements

- Real-time notifications
- Advanced reporting and analytics
- File upload for training materials
- Email notifications
- Mobile app version
