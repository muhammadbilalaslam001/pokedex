# Pokedex Application

This is a modern Pokedex application built with Next.js, TypeScript, Prisma, tRPC, and Material UI.

## Features

### Part 1: Single Pokemon Search
- Create a Pokemon by name
- Display Pokemon details including ID, name, types, and sprite image
- Debounced search with instant feedback
- Toast notifications for search results

### Part 2: Multiple Pokemon Search
- Query multiple Pokemon at once using comma-separated names
- Display a list of Pokemon with pagination (5 per page)
- Clean and responsive UI

### Part 3: Filterable Pokedex
- Filter Pokemon by type with an intuitive dropdown
- Display a complete Pokedex with pagination (5 per page)
- Visual type indicators with appropriate colors

### Enhanced Features
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive Design**: Mobile-friendly layout with collapsible navigation
- **Pagination**: Display Pokemon in manageable chunks
- **Debounced Search**: Efficient API calls with typing feedback
- **Toast Notifications**: User-friendly feedback on actions
- **Loading States**: Clear visual indicators during data fetching
- **Clean UI**: Modern design with consistent styling

## Tech Stack

- **Next.js**: React framework for the frontend
- **TypeScript**: Type safety for JavaScript
- **Prisma**: ORM for database access
- **SQLite**: Simple SQL database for development
- **tRPC**: End-to-end type-safe API
- **Material UI**: Component library for styling
- **React Hot Toast**: Toast notifications
- **use-debounce**: Debounced search functionality

## Getting Started

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Set up the database and seed data
   ```bash
   npm run setup
   ```
4. Start the development server
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `src/app`: Next.js app router
- `src/components`: React components
- `src/server`: tRPC and Prisma server setup
- `src/contexts`: Context providers (theme)
- `prisma`: Prisma schema and seed data

## API Routes

- `GET/POST /api/trpc/pokemon.getPokemonByName`: Get a single Pokemon by name
- `GET/POST /api/trpc/pokemon.getPokemonByNames`: Get multiple Pokemon by names
- `GET/POST /api/trpc/pokemon.getPokemonByType`: Get Pokemon filtered by type
- `GET/POST /api/trpc/pokemon.getAllTypes`: Get all available Pokemon types
