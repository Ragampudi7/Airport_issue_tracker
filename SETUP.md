# Airport Issue Tracker - Setup Instructions

## Project Overview
A comprehensive MEAN stack application for airport issue reporting and tracking with role-based access for staff and passengers.

## Features
- **Staff Dashboard**: Report issues and resolve them with red/yellow/green status tracking
- **Passenger Dashboard**: Report issues and view resolution status
- **SOS Portal**: Emergency reporting for urgent situations
- **Role-based Authentication**: Separate interfaces for staff and passengers
- **Real-time Issue Tracking**: Kanban-style dashboard for staff
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose
- **Frontend**: Angular 17 (Standalone Components)
- **Authentication**: JWT-based authentication
- **Styling**: SCSS with modern responsive design

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Backend Setup

1. Navigate to the backend directory:
```bash
cd "Airport Issue Tracker"
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/airport_facilities

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# Public Base URL (for password reset links)
PUBLIC_BASE_URL=http://localhost:3000
```

4. Start the backend server:
```bash
npm run dev
```
The backend will be available at `http://localhost:3000`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd "Airport Issue Tracker/frontend-angular"
```

2. Install dependencies:
```bash
npm install
```

3. Start the Angular development server:
```bash
npm start
```
The frontend will be available at `http://localhost:4200`

## Database Setup

1. Make sure MongoDB is running on your system
2. The application will automatically create the database and collections when you first run it
3. No additional database setup is required

## Usage

### For Staff
1. Register as a staff member with a department (Cabin Crew, Sanitation, Security, Maintenance)
2. Login to access the staff dashboard
3. Toggle between "Report Issue" and "Resolve Issues" modes
4. Report new issues or claim and resolve existing ones
5. Issues move through red (new) → yellow (in progress) → green (resolved) status

### For Passengers
1. Register as a passenger
2. Login to access the passenger dashboard
3. Report issues related to boarding or arrivals
4. View the status of your reported issues (red = under review, green = resolved)

### Emergency SOS Portal
1. Accessible without login at `/sos-portal`
2. For urgent medical, security, or safety emergencies
3. All SOS reports are automatically marked as highest priority

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/request-reset` - Password reset request
- `POST /api/auth/reset` - Password reset

### Incidents
- `GET /api/incidents` - Get incidents (filtered by user role)
- `POST /api/incidents` - Create new incident
- `GET /api/incidents/:id` - Get specific incident
- `PUT /api/incidents/:id` - Update incident
- `POST /api/incidents/:id/claim` - Claim incident (staff only)
- `POST /api/incidents/:id/resolve` - Resolve incident (staff only)
- `DELETE /api/incidents/:id` - Delete incident (staff only)
- `GET /api/incidents/meta/categories` - Get available categories

## Project Structure

```
Airport Issue Tracker/
├── src/
│   ├── models/
│   │   ├── User.js
│   │   └── Incident.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── incidents.js
│   ├── middleware/
│   │   └── auth.js
│   └── utils/
│       └── mailer.js
├── frontend-angular/
│   ├── src/
│   │   └── app/
│   │       ├── core/
│   │       │   ├── auth.service.ts
│   │       │   ├── auth.guard.ts
│   │       │   └── incidents.service.ts
│   │       └── pages/
│   │           ├── login/
│   │           ├── staff-dashboard/
│   │           ├── passenger-dashboard/
│   │           └── sos-portal/
├── server.js
└── package.json
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the MONGODB_URI in your .env file
   - For MongoDB Atlas, ensure your IP is whitelisted

2. **CORS Issues**
   - The backend is configured to allow all origins in development
   - For production, update CORS settings in server.js

3. **JWT Token Issues**
   - Ensure JWT_SECRET is set in your .env file
   - Clear browser storage if experiencing authentication issues

4. **Port Conflicts**
   - Backend runs on port 3000 by default
   - Frontend runs on port 4200 by default
   - Update PORT in .env file if needed

## Development Notes

- The application uses Angular standalone components (no NgModules)
- All forms use Angular Reactive Forms with validation
- The UI is fully responsive and mobile-friendly
- Real-time updates can be added using WebSockets in the future
- Email notifications can be configured using the mailer utility

## Production Deployment

1. Build the Angular frontend: `ng build --prod`
2. Update the backend to serve static files from the dist folder
3. Set up proper environment variables for production
4. Configure MongoDB Atlas for cloud database
5. Set up proper CORS policies
6. Use a process manager like PM2 for the Node.js backend

## License
This project is for educational purposes.
