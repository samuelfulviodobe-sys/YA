# Note Be - Productivity & Notes Application

## Overview

Note Be is a comprehensive productivity application that combines note-taking with proven productivity techniques. The app helps users capture thoughts, organize information, and improve their workflow through integrated Pomodoro timer, Kaizen goal tracking, and Eisenhower Matrix task prioritization. Built as a full-stack web application with a focus on clean design and user experience inspired by productivity tools like Notion, Linear, and Todoist.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and data fetching

**UI Component System**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Design system follows "New York" style variant from shadcn
- Custom CSS variables for theming with light/dark mode support
- Typography: Inter (UI) and JetBrains Mono (timers/data display)

**State Management Strategy**
- Server state: TanStack Query with optimistic updates and cache invalidation
- Local UI state: React hooks (useState, useContext)
- Theme state: Context API with localStorage persistence
- Form state: React Hook Form with Zod validation

**Routing Structure**
- `/` - Notes list page
- `/notes/:id` - Note editor (`:id` can be "new" for creating notes)
- `/calendar` - Calendar view with note timeline
- `/productivity` - Productivity tools (Pomodoro, Kaizen, Eisenhower)
- `/settings` - Application settings and data export

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routes
- TypeScript for type safety across the stack
- RESTful API design with JSON payloads

**Data Storage**
- In-memory storage (MemStorage class) for development/testing
- Drizzle ORM configured for PostgreSQL (production-ready schema defined)
- Database schema includes tables for: notes, pomodoro_sessions, kaizen_goals, eisenhower_tasks
- Migration system via Drizzle Kit for schema versioning

**API Design Patterns**
- CRUD operations for all resource types (notes, sessions, goals, tasks)
- Validation using Zod schemas derived from Drizzle schema definitions
- Error handling with appropriate HTTP status codes (400, 404, 500)
- Request logging middleware for debugging and monitoring

**Development Workflow**
- Vite middleware integration for HMR in development
- Custom error overlay plugin for runtime error visibility
- Separate build processes for client (Vite) and server (esbuild)

### Data Schema Design

**Notes Table**
- UUID primary keys with automatic generation
- Support for title, content (rich text), tags (array), favorite flag
- Automatic timestamps for creation and updates
- Full-text search capabilities planned

**Productivity Features**
- Pomodoro sessions: Track duration and type (work/break)
- Kaizen goals: Daily improvement goals with completion status
- Eisenhower tasks: Priority matrix classification (urgent/important quadrants)

### External Dependencies

**Core UI Libraries**
- Radix UI: Accessible, unstyled component primitives for building the design system
- Tailwind CSS: Utility-first CSS framework with custom configuration
- class-variance-authority & clsx: Conditional class name composition
- Lucide React: Icon library for consistent iconography

**Data Management**
- @tanstack/react-query: Async state management and caching
- react-hook-form: Performant form handling with minimal re-renders
- @hookform/resolvers: Form validation integration
- zod: Schema validation for runtime type checking
- drizzle-zod: Bridge between Drizzle schemas and Zod validation

**Database & ORM**
- Drizzle ORM: Type-safe SQL query builder
- @neondatabase/serverless: PostgreSQL driver optimized for serverless environments
- drizzle-kit: Migration and schema management tools

**Date Handling**
- date-fns: Lightweight date manipulation and formatting library

**Development Tools**
- tsx: TypeScript execution for development server
- esbuild: Fast JavaScript bundler for production builds
- @replit/vite-plugin-*: Replit-specific development enhancements

**Design System Foundation**
- Custom CSS variables defined in index.css for theming
- Elevation system using opacity overlays (--elevate-1, --elevate-2)
- Consistent spacing scale using Tailwind's spacing primitives (2, 4, 6, 8, 12, 16)
- Border radius system: lg (9px), md (6px), sm (3px)