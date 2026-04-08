# AI Job Application Tracker — Frontend

A premium React + TypeScript frontend for the AI-Assisted Job Application Tracker. Built with Vite and a custom CSS design system inspired by editorial design principles.

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 8
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Icons:** React Icons (Ionicons 5)
- **Styling:** Vanilla CSS with custom design tokens

## Getting Started

### Prerequisites

- Node.js v18+
- Backend server running (see `../server/README.md`)

### Installation

```bash
cd client
npm install
```

### Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable       | Description                | Default                        |
|----------------|----------------------------|--------------------------------|
| `VITE_API_URL` | Backend API base URL       | `http://localhost:5000/api`    |

### Running the App

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

The dev server runs at `http://localhost:5173` by default.

## Project Structure

```
client/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout/          # AppLayout (sidebar + topbar + outlet)
│   │   ├── Modal/           # ApplicationDetail & EditApplication modals
│   │   ├── Sidebar/         # Navigation sidebar with brand & CTA
│   │   └── TopBar/          # Header with search, settings, user avatar
│   │
│   ├── config/
│   │   └── api.ts           # Axios instance with JWT interceptors
│   │
│   ├── context/
│   │   ├── AuthContext.tsx   # Authentication state & methods
│   │   └── ToastContext.tsx  # Toast notification system
│   │
│   ├── pages/
│   │   ├── Auth/            # Login & Register (split-panel design)
│   │   ├── Dashboard/       # Career overview with stats & insights
│   │   ├── Applications/    # Applications list with filters & pagination
│   │   ├── AddJob/          # Manual entry + AI auto-fill from JD
│   │   └── Analytics/       # Charts, skills, AI insights, CSV export
│   │
│   ├── services/
│   │   └── applicationService.ts  # API calls for applications & AI
│   │
│   ├── types/
│   │   └── application.ts   # TypeScript interfaces & status configs
│   │
│   ├── App.tsx              # Root component with routing & guards
│   ├── index.css            # Full design system (tokens + utilities)
│   └── main.tsx             # Entry point
│
├── .env.example             # Environment template
├── index.html               # HTML entry with SEO meta tags
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Pages

### 1. Authentication (`/login`)
- Split-panel layout: gradient hero branding + login/register form
- Toggle between Sign In and Create Account
- JWT stored in localStorage for session persistence

### 2. Dashboard (`/dashboard`)
- Stat cards: Total Applications, Interviews, Offers, Rejected
- AI Curator Insights with circular resume score gauge
- Skill match progress bars
- Recent activity table

### 3. Applications (`/applications`)
- Filterable by status, sortable by date/company
- Paginated table with status badges
- Click to view full details (modal) or edit
- AI-powered insight banner at the bottom

### 4. Add Job (`/add-job`)
- **Manual mode:** Fill in job title, company, status, notes
- **AI Auto-Fill mode:** Paste a job description, AI extracts all fields and generates resume suggestions
- Trust badges (Private Data, Auto-Analysis, Multi-Device Sync)

### 5. Analytics (`/analytics`)
- Area chart: applications over time
- Donut chart: pipeline status distribution
- Top performing skills from job data
- CSV export button
- AI-powered insights and upcoming reminders

## Design System

The UI follows the **"Intelligent Workspace"** design philosophy:

- **Dual-font strategy:** Manrope (headlines) + Inter (body) from Google Fonts
- **No-border principle:** UI structure uses surface color shifts and ambient shadows instead of borders
- **Gradient CTAs:** Primary buttons use an indigo gradient (`#3525CD → #4F46E5 → #6366F1`)
- **Glassmorphism:** Modals and floating panels use backdrop-blur
- **Ambient shadows:** Tinted, low-opacity shadows that look natural
- **Micro-animations:** fadeInUp, scaleIn, staggered children animations
- **Status colors:** Each Kanban status has a paired `color` + `background` token

### CSS Custom Properties (subset)

```css
--primary: #4F46E5;
--background: #F8F9FA;
--surface-container-lowest: #FFFFFF;
--font-display: 'Manrope';
--font-body: 'Inter';
--radius-lg: 1rem;
--shadow-lg: 0px 12px 32px rgba(25, 28, 29, 0.04);
```

## Architecture Decisions

1. **Context-based state:** Auth and Toast use React Context — no external state library needed for this scale
2. **Service layer:** API calls are in `services/`, not in components — keeps components focused on rendering
3. **Route protection:** `ProtectedRoute` and `PublicRoute` wrappers handle auth redirects
4. **CSS Modules (manual):** Each component has a co-located `.css` file instead of Tailwind utilities — gives full control over the premium design
5. **TypeScript types mirror backend:** `Application` interface matches the Mongoose schema exactly
6. **Toast notifications:** Custom toast system with auto-dismiss, no library dependency

## License

MIT
