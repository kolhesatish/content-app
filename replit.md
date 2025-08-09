# ContentCraft - AI Social Media Content Generator

## Overview

ContentCraft is a full-stack web application that generates AI-powered social media content for Instagram and LinkedIn. The application has been converted from React + Vite + TypeScript to Next.js with JavaScript. It features a modern Next.js frontend with shadcn/ui components and Next.js API routes for content generation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with JavaScript
- **Routing**: Next.js App Router with file-based routing
- **UI Library**: shadcn/ui components built on Radix UI primitives (converted to JS)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query (React Query) for client state
- **Build Tool**: Next.js built-in bundler

### Backend Architecture
- **Framework**: Next.js API Routes with JavaScript
- **API**: RESTful endpoints using Next.js route handlers
- **Content Generation**: Mock AI content generation functions
- **Database**: Ready for PostgreSQL integration with Drizzle ORM
- **Schema**: Available for future database integration

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
  - `/api/content/instagram` - Next.js API route for Instagram posts, reels, and stories
  - `/api/content/linkedin` - Next.js API route for LinkedIn professional content

### Frontend Pages
- **Home** (`/`): Landing page with hero section, features, and testimonials
- **Instagram Generator** (`/instagram`): Multi-step form for Instagram content creation
- **LinkedIn Generator** (`/linkedin`): Form for professional LinkedIn content
- **Navigation**: Fixed navigation with glass morphism effect across all pages

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
- **Frontend**: Next.js builds the entire application with SSR/SSG capabilities
- **API Routes**: Next.js API routes handle server-side logic
- **Static Assets**: Next.js optimizes images and static files automatically

### Environment Configuration
- **Development**: Next.js dev server with hot reloading
- **Production**: Next.js production build with optimizations
- **Database**: Ready for `DATABASE_URL` environment variable integration

### File Structure
- **App Directory**: Next.js App Router structure in `src/app/`
- **Components**: Reusable UI components in `src/components/`
- **API Routes**: Server-side logic in `src/app/api/`
- **Shared**: Common utilities and configurations in `src/lib/`
- **Configuration**: Root-level Next.js config files

### Storage Implementation
- **Current**: In-memory storage for development/demo
- **Migration Path**: Interface-based design allows easy database integration
- **Schema**: Drizzle schema ready for PostgreSQL deployment

## Recent Changes (2024)

**Content Generation Enhancement & Authentication Fixes (August 2025)**
- ✓ Fixed MongoDB ObjectId authentication issue that was causing 401 errors
- ✓ Implemented multiple content variations (5 options) for both Instagram and LinkedIn
- ✓ Enhanced AI prompts to generate clean JSON without markdown formatting
- ✓ Added proper content display with individual copy options for each variation
- ✓ Improved content structure with style/tone labels and complete post copying
- ✓ Fixed content parsing and fallback mechanisms for robust AI response handling
- ✓ Authentication now works seamlessly across all content generation endpoints
- ✓ Users can now choose from multiple professionally generated content options

**Project Migration to Replit Environment & Authentication Fixes (August 2025)**
- ✓ Successfully migrated project from Replit Agent to standard Replit environment
- ✓ Fixed missing cross-env dependency that was preventing Next.js from starting
- ✓ Verified Next.js application starts properly on port 5000 with hot reloading
- ✓ Fixed authentication localStorage issues with browser/server compatibility
- ✓ Enhanced authentication flow with proper state management and error handling
- ✓ Configured all required environment variables (MONGODB_URI, JWT_SECRET, GEMINI_API_KEY)
- ✓ Fixed content generation API routes for both Instagram and LinkedIn
- ✓ Maintained all existing functionality including Gemini AI integration and MongoDB authentication
- ✓ Ensured proper security practices and client/server separation
- ✓ Application now runs cleanly in Replit with full authentication and content generation working

**Project Conversion to Next.js + JavaScript**
- ✓ Converted from React + Vite + TypeScript to Next.js + JavaScript
- ✓ Migrated all components from TypeScript to JavaScript
- ✓ Converted Express.js API to Next.js API routes
- ✓ Updated routing from Wouter to Next.js App Router
- ✓ Preserved all existing functionality and UI design
- ✓ Maintained dark glassy UI theme and responsive design

**Added Gemini AI Integration & MongoDB Authentication (Latest)**
- ✓ Integrated Google Gemini AI for real content generation
- ✓ Added MongoDB database with user authentication using JWT
- ✓ Implemented credit system: 5 initial credits, 2 daily credits (expire in 24 hours)
- ✓ Created authentication components (login/register forms, auth modal)
- ✓ Updated content generators to require authentication and use credits
- ✓ Added user navigation with credit display and logout functionality
- ✓ Enhanced API routes with proper authentication checks and Gemini AI calls
- ✓ Improved error handling for insufficient credits and authentication

**Current Features:**
- Real AI content generation using Gemini 2.0 Flash
- User registration/login with JWT authentication
- Credit-based usage system (freemium model)
- Protected content generation endpoints
- MongoDB integration for user data and credit tracking
- Daily credit refresh system
- Responsive authentication UI components

The application is designed for easy deployment on platforms like Replit and Vercel, with Next.js providing excellent performance and SEO capabilities.