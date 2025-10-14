# Airport Facilities – Maintenance Reporting & Tracking (MEAN-lite)

A minimal MEAN-style app (MongoDB, Express, AngularJS, Node) to digitize maintenance issue reporting and tracking for airport facilities.

## Features
- Submit new incidents with title, location, category, priority, and description
- List, search, and filter incidents
- Update incident status (Open, In Progress, Resolved, Closed)
- Simple dashboard counts by status

## Quick start

1. Prerequisites: Node 18+, MongoDB running locally or a connection string.
2. Install dependencies:

```bash
npm install
```

3. Create `.env` (optional) to override defaults:

```bash
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/airport_facilities
```

4. Run the server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## API
- POST `/api/incidents` create incident
- GET `/api/incidents` list incidents; optional `status`, `priority`, `category`, `q`
- GET `/api/incidents/:id` get by id
- PUT `/api/incidents/:id` update fields
- DELETE `/api/incidents/:id` delete

## Notes
- Uses AngularJS for simplicity; you can swap for modern Angular later.
- Aligns with the brief: categories as catalog, incident management, basic routing, dashboards.


