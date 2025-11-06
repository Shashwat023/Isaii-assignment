# Isaii - Project Documentation

## Project Overview
Isaii is a full-stack web application built with Next.js (React) for the frontend and Node.js/Express for the backend. This document provides an overview of the project structure and setup instructions.

## Project Structure

### Frontend (`/app`, `/components`, `/public`, `/styles`)
- `/app`: Next.js 13+ app directory containing page routes and layouts
- `/components`: Reusable React components
- `/public`: Static assets (images, fonts, etc.)
- `/styles`: Global styles and theme configurations

### Backend (`/server`)
- `/controllers`: Request handlers for different routes
- `/middleware`: Express middleware functions
- `/models`: Database models and schemas
- `/routes`: API route definitions
- `/services`: Business logic and external service integrations
- `/utils`: Utility functions and helpers
- `server.js`: Main server entry point

### Configuration Files
- `.env` and `.env.local`: Environment variables (not committed to version control)
- `package.json`: Project dependencies and scripts
- `next.config.mjs`: Next.js configuration
- `tsconfig.json`: TypeScript configuration
- `postcss.config.mjs`: PostCSS configuration

## Prerequisites

- Node.js (v16 or later)
- npm or pnpm (recommended)
- MongoDB (or your preferred database)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Isaii
   ```

2. **Install dependencies**
   ```bash
   # Using pnpm (recommended)
   pnpm install
   
   # Or using npm
   npm install
   
   # Install server dependencies
   cd server
   npm install
   cd ..
   ```

3. **Environment Setup**
   - Create a `.env.local` file in the root directory with the following variables:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:5000
     # Add other frontend environment variables here
     ```
   - Create a `.env` file in the `/server` directory with your backend environment variables:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     # Add other backend environment variables here
     ```

4. **Start the development server**
   ```bash
   # Start frontend (from root directory)
   pnpm dev
   # or
   npm run dev
   
   # In a separate terminal, start the backend
   cd server
   node server.js
   ```

5. **Build for production**
   ```bash
   # Build the Next.js application
   pnpm build
   
   # Start the production server
   pnpm start
   ```

## Available Scripts

- `dev`: Start development server
- `build`: Create production build
- `start`: Start production server
- `lint`: Run ESLint

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

[Add your license information here]
