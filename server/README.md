# AI-Assisted Job Application Tracker — Backend API

A Node.js + Express backend for tracking job applications on a Kanban board with AI-powered job description parsing and resume suggestions.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT with bcryptjs
- **AI:** OpenAI API (GPT-4o-mini) with JSON output mode
- **Validation:** express-validator

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- OpenAI API key

### Installation

```bash
cd server
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT token signing |
| `OPENAI_API_KEY` | OpenAI API key for AI features |

### Running the Server

```bash
# Development (auto-restarts on changes)
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and get JWT token | No |

### User

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/users/me` | Get current user profile | Yes |

### Applications (CRUD)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/applications` | Create a new application | Yes |
| GET | `/api/applications` | Get all user applications | Yes |
| GET | `/api/applications/:id` | Get application by ID | Yes |
| PUT | `/api/applications/:id` | Update an application | Yes |
| PATCH | `/api/applications/:id/status` | Update status only (Kanban drag) | Yes |
| DELETE | `/api/applications/:id` | Delete an application | Yes |

### AI Features

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/ai/parse-jd` | Parse a job description | Yes |
| POST | `/api/ai/resume-suggestions` | Generate resume bullet points | Yes |
| POST | `/api/ai/parse-and-create` | Parse JD + create application | Yes |

### Board & Stats

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/jobs/board` | Get applications grouped by status | Yes |
| GET | `/api/jobs/stats` | Get dashboard statistics | Yes |

## Project Structure

```
server/
├── src/
│   ├── config/          # Database connection
│   ├── constants/       # Status enums, roles
│   ├── controller/      # Route handlers (thin)
│   ├── jobs/            # Scheduled tasks (stretch goal)
│   ├── middleware/       # Auth & error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express route definitions
│   ├── services/        # Business logic layer
│   ├── utils/           # Shared helpers
│   ├── validators/      # Input validation rules
│   ├── app.js           # Express app setup
│   └── server.js        # Entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Architecture Decisions

1. **Service Layer Pattern:** AI logic and business rules live in `services/`, not in route handlers, keeping controllers thin and testable.
2. **Standardized Responses:** All endpoints return `{ success, message, data }` via `apiResponse.js`.
3. **Global Error Handler:** Gracefully handles Mongoose, JWT, and application errors without crashing.
4. **Kanban Status Endpoint:** Dedicated `PATCH /:id/status` for efficient drag-and-drop updates.
5. **OpenAI JSON Mode:** Uses `response_format: { type: "json_object" }` for reliable structured AI output.
