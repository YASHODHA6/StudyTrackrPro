# Student Study Tracker

A full-stack web application that helps students track their study sessions, manage tasks, send feedback, and view study statistics.

## Overview

This application provides a comprehensive study tracking system with:
- Study session logging with subject, hours, and date
- Todo task management with completion tracking
- Feedback submission system
- Statistics dashboard showing total hours, subjects tracked, and averages
- Report generation in JSON and TXT formats

## Project Architecture

### Frontend (React + TypeScript)
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query (React Query)
- **UI Components**: Custom components built with Radix UI primitives

### Backend (Express + Node.js)
- **Server**: Express.js on port 4000
- **Storage**: JSON file-based persistence (no database)
- **Data Files**: 
  - `data/sessions.json` - Study sessions
  - `data/todos.json` - Todo tasks
  - `data/feedback.json` - User feedback

### API Endpoints

**Study Sessions:**
- `POST /api/study` - Add new study session
- `GET /api/study` - Get all study sessions

**Statistics:**
- `GET /api/stats` - Get calculated study statistics

**Todos:**
- `POST /api/todo` - Add new todo task
- `GET /api/todo` - Get all todos
- `DELETE /api/todo/:id` - Delete a todo
- `POST /api/todo/:id/toggle` - Toggle todo completion

**Feedback:**
- `POST /api/feedback` - Submit feedback

**Reports:**
- `GET /api/report?format=json` - Download study report as JSON
- `GET /api/report?format=txt` - Download study report as TXT

## Data Models

### StudySession
```typescript
{
  id: string
  subject: string
  hours: number (0.5-24)
  date: string (ISO date)
}
```

### Todo
```typescript
{
  id: string
  task: string
  completed: boolean
}
```

### Feedback
```typescript
{
  id: string
  message: string
  timestamp: string (ISO datetime)
}
```

### StudyStats
```typescript
{
  totalHours: number
  numberOfSubjects: number
  averageHoursPerSubject: number
}
```

## Features

### Dashboard
- Statistics cards showing study metrics
- Recent study sessions preview
- Pending tasks preview

### Study Sessions
- Form to add new study sessions
- List of all recorded sessions
- Visual indicators with hours and dates

### Todos
- Add new tasks with inline form
- Toggle task completion with checkboxes
- Delete tasks
- Visual differentiation for completed tasks

### Feedback
- Text area for detailed feedback
- Success confirmation after submission
- Thank you message display

### Reports
- Download complete study data
- JSON format for programmatic access
- TXT format for human readability

## Design System

- **Colors**: Professional blue primary color with clean grays
- **Typography**: Inter font for readability
- **Spacing**: Consistent 4/6/8/12 spacing units
- **Components**: Shadcn/ui components for consistency
- **Interactions**: Hover effects and smooth transitions
- **Responsive**: Mobile-first design with tablet and desktop breakpoints

## Recent Changes

- Initial project setup with full-stack architecture
- Created all data schemas and TypeScript types
- Built complete React component library
- Implemented tab-based navigation system
- Added statistics calculation and display
- Created beautiful empty states and loading indicators

## Running the Application

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Access the app at: `http://localhost:5000`
4. Backend API available at: `http://localhost:5000/api/*`

**Note**: In the Replit environment, both frontend and backend run on the same port (5000) due to platform firewall constraints. All API endpoints are prefixed with `/api/`.

## Development Notes

- Backend uses in-memory storage with JSON file persistence
- All forms include validation using Zod schemas
- Real-time UI updates using React Query cache invalidation
- Beginner-friendly code with comprehensive comments
- No external database required - simple file-based storage
