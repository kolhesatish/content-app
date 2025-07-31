# ContentCraft - AI Social Media Content Generator

## Overview

ContentCraft is a full-stack web application that generates AI-powered social media content for Instagram and LinkedIn. The application features a modern React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration using Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Schema**: Drizzle schema definitions with Zod validation
- **Storage**: In-memory storage implementation with interface for database migration

### Design System
- **Theme**: Dark theme with purple/blue gradient accents
- **Components**: Fully accessible Radix UI components
- **Responsive**: Mobile-first responsive design
- **Typography**: Inter font family
- **Effects**: Glass morphism effects and gradient backgrounds

## Key Components

### Database Schema
- **Users Table**: User authentication with username/password
- **Content Generations Table**: Stores generated content with platform, type, topic, and JSON content
- **Relationships**: Content generations linked to users via foreign key

### API Endpoints
- **Content Generation**: 
  - `/api/content/instagram` - Generates Instagram posts, reels, and stories
  - `/api/content/linkedin` - Generates LinkedIn professional content
- **User Management**: User creation and retrieval endpoints

### Frontend Pages
- **Home**: Landing page with hero section, features, and testimonials
- **Instagram Generator**: Multi-step form for Instagram content creation
- **LinkedIn Generator**: Form for professional LinkedIn content
- **Navigation**: Fixed navigation with glass morphism effect

### Content Generation Features
- **Instagram**: Supports posts, reels, and stories with customizable styles
- **LinkedIn**: Professional content with industry-specific styling
- **Output**: Generated captions, hashtags, and content recommendations

## Data Flow

1. **User Input**: User selects platform and enters topic/preferences
2. **API Request**: Frontend sends structured request to backend
3. **Content Generation**: Backend processes request and generates content using mock AI functions
4. **Database Storage**: Generated content saved to database with user association
5. **Response**: Generated content returned to frontend for display
6. **User Interaction**: Copy functionality and regeneration options

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Query
- **UI Components**: Radix UI primitives, shadcn/ui components
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Utilities**: date-fns, wouter, lucide-react icons

### Backend Dependencies
- **Database**: Drizzle ORM, @neondatabase/serverless
- **Server**: Express.js, connect-pg-simple for sessions
- **Validation**: Zod schema validation
- **Utilities**: crypto for UUID generation

### Development Dependencies
- **Build Tools**: Vite, esbuild for server bundling
- **TypeScript**: Full TypeScript support across stack
- **Development**: tsx for development server, Replit integrations

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations in `migrations/` directory

### Environment Configuration
- **Development**: Uses tsx for hot reloading, Vite dev server
- **Production**: Compiled JavaScript with Node.js execution
- **Database**: Requires `DATABASE_URL` environment variable

### File Structure
- **Client**: All frontend code in `client/` directory
- **Server**: Backend code in `server/` directory  
- **Shared**: Common schemas and types in `shared/` directory
- **Configuration**: Root-level config files for tools and build

### Storage Implementation
- **Current**: In-memory storage for development/demo
- **Migration Path**: Interface-based design allows easy database integration
- **Schema**: Drizzle schema ready for PostgreSQL deployment

The application is designed for easy deployment on platforms like Replit, with proper environment variable configuration and database provisioning.