# AI-Assisted Job Application Tracker

A full-stack web application for tracking job applications with AI-powered features. Built with the **MERN stack** (MongoDB, Express, React, Node.js) + TypeScript.

## 🌟 Features

### Authentication
- Register and login with email and password
- JWT protected routes on frontend and backend
- User stays logged in after page refresh

### Kanban Board (Applications List)
- View all applications with status filters and sorting
- Five statuses: Applied, Phone Screen, Interview, Offer, Rejected
- Edit, view details, and delete applications
- Pagination for large datasets

### AI Job Description Parser
- Paste a job description and AI extracts: company, role, skills, seniority, location
- Auto-populates application fields
- Loading state during processing

### AI Resume Suggestions
- After parsing, generates 3-5 resume bullet points tailored to the job
- Each suggestion has a copy button

### Dashboard
- Career overview with application statistics
- AI Resume Score with skill breakdown
- Recent activity table

### Analytics Hub
- Application trends over time (area chart)
- Status distribution (donut chart)
- Top performing skills
- CSV export functionality

---

## 🛠️ Tech Stack

| Layer     | Technology                           |
|-----------|--------------------------------------|
| Frontend  | React 19, TypeScript, Vite, Recharts |
| Backend   | Node.js, Express                     |
| Database  | MongoDB with Mongoose                |
| Auth      | JWT with bcrypt                      |
| AI        | OpenAI API (JSON output mode)        |
| Styling   | Vanilla CSS (Design System)          |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key

### 1. Clone the repository
```bash
git clone https://github.com/shahidansari311/JOB_APPLIATION_TRACKER.git
cd JOB_APPLIATION_TRACKER
```

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/job-tracker
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Setup Frontend
```bash
cd client
npm install
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the application
In two separate terminals:

```bash
# Terminal 1 - Backend
cd server
npm run dev
```

```bash
# Terminal 2 - Frontend
cd client
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
├── client/                  # React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Layout/      # App layout with sidebar
│   │   │   ├── Modal/       # Detail & edit modals
│   │   │   ├── Sidebar/     # Navigation sidebar
│   │   │   └── TopBar/      # Top navigation bar
│   │   ├── config/          # API client config
│   │   ├── context/         # Auth & Toast contexts
│   │   ├── pages/           # Page components
│   │   │   ├── AddJob/      # Add new application
│   │   │   ├── Analytics/   # Analytics dashboard
│   │   │   ├── Applications/# Applications list
│   │   │   ├── Auth/        # Login/Register
│   │   │   └── Dashboard/   # Main dashboard
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Root component with routing
│   │   ├── index.css        # Design system CSS
│   │   └── main.tsx         # Entry point
│   └── package.json
│
├── server/                  # Express backend
│   ├── src/
│   │   ├── config/          # DB config
│   │   ├── constants/       # Status constants
│   │   ├── controller/      # Route handlers
│   │   ├── middleware/       # Auth & error middleware
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic (AI, Auth)
│   │   ├── utils/           # Helpers
│   │   └── validators/      # Request validation
│   └── package.json
```

---

## 🔑 Environment Variables

### Server (.env)
| Variable       | Description               | Required |
|----------------|---------------------------|----------|
| PORT           | Server port               | Yes      |
| MONGO_URI      | MongoDB connection string | Yes      |
| JWT_SECRET     | JWT signing secret        | Yes      |
| OPENAI_API_KEY | OpenAI API key            | Yes      |

### Client (.env)
| Variable      | Description      | Required |
|---------------|------------------|----------|
| VITE_API_URL  | Backend API URL  | Yes      |

---

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login user

### Applications (Protected)
- `GET /api/applications` — Get all applications
- `POST /api/applications` — Create application
- `GET /api/applications/:id` — Get single application
- `PUT /api/applications/:id` — Update application
- `DELETE /api/applications/:id` — Delete application
- `PATCH /api/applications/:id/status` — Update status (drag & drop)

### AI (Protected)
- `POST /api/ai/parse-jd` — Parse job description
- `POST /api/ai/resume-suggestions` — Generate resume suggestions
- `POST /api/ai/parse-and-create` — Parse JD + create application

---

## 🎨 Design Decisions

- **No CSS framework**: Used a custom CSS design system based on the "Intelligent Workspace" concept with design tokens for colors, typography, spacing, and elevation
- **Manrope + Inter fonts**: Dual-font strategy for editorial feel (headlines) and readability (body)
- **No-border principle**: UI uses surface color shifts and ambient shadows instead of borders
- **Gradient CTAs**: Primary buttons use a signature indigo gradient for premium feel
- **Component architecture**: Structured and reusable components with separate CSS modules
- **Service layer pattern**: API calls abstracted in a service layer, not in components
- **Context-based state**: Auth and Toast managed via React Context

---

## License

MIT
