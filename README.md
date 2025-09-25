# Training Tracker

## Overview

Training Tracker is a comprehensive full-stack web application designed for managing training programs, batches, user accounts (admins, trainers, trainees), progress tracking, and related workflows.

The backend is built with Django REST Framework, providing a robust API with authentication, permissions, and pagination.

The frontend uses React with Material-UI for a responsive user interface, including role-based dashboards and management components.

Key features include:

- Secure user authentication with JWT tokens and role-based access control (Admin, Trainer, Trainee).

- User management: Create, edit, delete trainer and trainee accounts with role-specific customizations (e.g., expertise for trainers, designations for trainees).

- Program and batch creation/management.

- Trainee progress tracking with status updates.

- Role-specific dashboards (Super Admin, Trainer, Trainee).

- Search, filtering, and pagination across data lists.

- Password reset functionality.

- Audit logging for actions.

## Quick Start

### Prerequisites

- Python 3.8+ and Node.js 14+

- Git

### Backend Setup

1. Clone the repository:

   ```
   git clone <repository-url>
   cd training_tracker
   ```

2. Create and activate a virtual environment:

   ```
   python -m venv venv
   # On Windows: venv\Scripts\activate
   # On macOS/Linux: source venv/bin/activate
   ```

3. Install Python dependencies:

   ```
   pip install -r requirements.txt
   ```

4. Apply database migrations:

   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Create the default super admin user:

   ```
   python manage.py create_default_admin
   ```

   - Username: `admin@Stack`

   - Email: `admin@stack.com`

   - Password: `St@ckly2025`

   - Role: `admin`

6. (Optional) Load sample data:

   ```
   python manage.py loaddata training/fixtures/sample_data.json
   ```

7. Start the Django development server (bind to all interfaces for frontend access):

   ```
   python manage.py runserver
   ```

   The API will be available at `http://127.0.0.1:8000/api/`.

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install Node dependencies:

   ```
   npm install
   ```

3. Start the React development server:

   ```
   npm start
   ```

   The app will open automatically at `http://localhost:3000`.

## Configuration

### Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///db.sqlite3  # Or PostgreSQL/MySQL
CORS_ALLOWED_ORIGINS=http://localhost:3000
FRONTEND_URL=http://localhost:3000
DEFAULT_FROM_EMAIL=noreply@example.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### API Base URL

The frontend API calls are configured in `frontend/src/services/api.js`.

Ensure `API_BASE_URL` matches your backend (default: `http://127.0.0.1:8000/api`).

### CORS Setup

To allow frontend requests, add the frontend origin to `CORS_ALLOWED_ORIGINS` in `training_tracker/settings.py` or via `.env`.

## Usage

1. **Login**: Open `http://localhost:3000/login` and sign in with the admin credentials.

   - Admins access the Super Admin Dashboard for full management.

   - Trainers/Trainees see role-specific views.

2. **User Management** (Admin only):

   - Navigate to "Users" in the dashboard.

   - Use tabs to filter by role: All, Trainers, Trainee.

   - Create new users: Select role; trainers get an "Expertise" field, trainees get a "Designation" dropdown (populated from designations API).

   - Edit users: Update details, including role-specific fields; changes save via PUT request.

   - Delete users: Confirm and remove.

   - Pagination: Navigate through results (20 per page by default).

3. **Other Features**:

   - **Programs/Batches**: Create programs, assign trainers/trainees to batches.

   - **Progress**: Trainers update trainee progress; trainees view their own.

   - **Register**: Self-registration available for new trainees at `/register`.

## API Endpoints

The API uses Django REST Framework with JWT authentication. Base URL: `/api/`.

- **Authentication**:

  - POST `/token/`: Login (returns access/refresh tokens).

  - POST `/token/refresh/`: Refresh token.

  - GET `/auth/user/`: Current user info.

- **Users** (Admin only):

  - GET/POST `/users/`: List/create users (supports `?role=trainer` filtering, pagination).

  - GET/PUT/DELETE `/users/{id}/`: Retrieve/update/delete user.

- **Other Resources**:

  - Programs: `/programs/`

  - Batches: `/batches/`

  - Progress Records: `/progress-records/`

  - Designations: `/designations/`

All list endpoints support pagination (`?page=1`), search (`?search=query`), and ordering.

## Testing

### Backend

- Run unit tests: `python manage.py test`

- API testing: Use tools like Postman or curl.

  - Example: `curl -H "Authorization: Bearer <token>" http://127.0.0.1:8000/api/users/?role=trainer`

- Edge cases: Invalid tokens (401), unauthorized actions, validation errors.

### Frontend

- Run tests: `cd frontend && npm test`

- Manual testing: Interact via browser; check Network tab for API calls, Console for errors.

- Role-based: Test as admin (full access), trainer (limited), trainee (view-only).

### End-to-End

- Login flow, user creation (trainer with expertise, trainee with designation), filtering/pagination, logout.

## Troubleshooting

### Connection Issues (ERR_CONNECTION_REFUSED)

If the frontend can't connect to the backend:

1. Ensure backend runs with `0.0.0.0:8000`.

2. Verify CORS: Add `http://localhost:3000` to `CORS_ALLOWED_ORIGINS`.

3. Check firewall/antivirus blocking port 3000.

4. Restart both servers after config changes.

5. Confirm API URL in `frontend/src/services/api.js`.

### Database

- If migrations fail: Delete `db.sqlite3` and re-run `migrate`.

- For production: Use PostgreSQL; update `DATABASES` in `settings.py`.

### Authentication Errors

- Clear localStorage (tokens) in browser dev tools.

- Ensure `is_staff=True` for admins in database.

## Deployment

- **Backend**: Use Gunicorn/NGINX; deploy to Heroku/AWS/DigitalOcean. Set production settings (DEBUG=False).

- **Frontend**: Build with `npm run build`; serve static files via NGINX or host on Vercel/Netlify.

- **Database**: Migrate to PostgreSQL for production.

- **Environment**: Use secure SECRET_KEY, proper email config for resets.

## Contributing

1. Fork the repository.

2. Create a feature branch: `git checkout -b feature/new-feature`.

3. Commit changes: `git commit -m 'Add new feature'`.

4. Push: `git push origin feature/new-feature`.

5. Open a Pull Request.

Use branch prefix `blackboxai/` for changes from this session.

## License

MIT License. See LICENSE file for details.
