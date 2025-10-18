# ScienceTutor - Interactive Learning Platform

## Overview
An interactive science tutoring platform designed for KS3, GCSE, and A-Level students. The platform provides comprehensive learning materials and practice exercises across Biology, Chemistry, and Physics.

## Purpose
Help high school students (ages 11-18) master science concepts through:
- Structured learning paths organized by curriculum level
- Interactive lessons with clear explanations
- Practice exercises with instant feedback
- Progress tracking to monitor learning

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **Storage**: In-memory storage (MemStorage)
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS with custom design system

## Architecture

### Data Model
- **Topics**: Science topics organized by subject (biology/chemistry/physics) and level (KS3/GCSE/A-Level)
- **Lessons**: Educational content for each topic with structured learning materials
- **Exercises**: Practice questions (multiple-choice, true-false, short-answer) with instant feedback
- **Progress**: Session-based tracking of completed lessons and exercise scores

### Pages
1. **Home** (`/`) - Landing page with curriculum level and subject selection
2. **Topics** (`/topics`) - Browse topics with filtering by subject and level
3. **Topic Detail** (`/topic/:id`) - View lessons within a topic with progress tracking
4. **Lesson** (`/lesson/:id`) - Read lesson content with navigation between lessons
5. **Exercises** (`/exercises/:lessonId`) - Practice exercises with instant feedback

### Design System
- **Primary Color**: Trust blue (#2563eb) for headers and primary actions
- **Subject Colors**:
  - Biology: Green (#22c55e)
  - Chemistry: Teal (#14b8a6)
  - Physics: Purple (#a855f7)
- **Typography**: Inter for UI and body text, JetBrains Mono for formulas
- **Spacing**: Consistent use of Tailwind spacing (2, 4, 6, 8, 12, 16, 24)
- **Components**: Clean, student-friendly design with clear layouts and intuitive navigation

## Features
- [x] Home page with level and subject selection
- [x] Topic browsing with search and filters
- [x] Lesson viewer with navigation
- [x] Interactive exercises with multiple question types
- [x] Instant feedback with explanations
- [x] Progress tracking per session
- [x] Dark mode support
- [x] Responsive design for mobile and desktop

## API Endpoints
- `GET /api/topics` - Get all topics
- `GET /api/topics/:id` - Get a specific topic
- `GET /api/topics/:id/lessons` - Get lessons for a topic
- `GET /api/lessons/:id` - Get a specific lesson
- `GET /api/lessons/:id/exercises` - Get exercises for a lesson
- `POST /api/exercises/submit` - Submit an exercise answer

## Development
The application uses a schema-first development approach:
1. Data schemas defined in `shared/schema.ts`
2. Storage interface in `server/storage.ts`
3. API routes in `server/routes.ts`
4. Frontend components consume the API using React Query

## User Preferences
- Clean, easy-to-follow design for high school students
- Focus on readability and intuitive navigation
- Educational content should be accessible and engaging
