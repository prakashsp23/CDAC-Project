## Project Overview

This repository uses npm as the package manager and includes a React frontend.

### Tech Stack
- **Frontend**: React (Vite), React Router
- **Styling**: **Tailwind CSS**
- **UI Components**: **shadcn/ui**
- **Linting**: ESLint

## Prerequisites
- Node.js (LTS recommended)
- npm (comes with Node.js)

## Getting Started

### Frontend
1. Navigate to the frontend app:
```sh
cd client
```
2. Install dependencies:
```sh
npm i
```
3. Start the dev server:
```sh
npm run dev
```
The dev server will print a local URL (usually `http://localhost:5173`).

### Common npm Scripts (client)
- `npm run dev`: Start the Vite dev server
- `npm run build`: Build for production
- `npm run preview`: Preview the production build locally

## UI Guidelines
- Use **Tailwind CSS** utility classes for layout and styling
- Prefer **shadcn/ui** components for consistent design primitives
  - Docs: [shadcn/ui](https://ui.shadcn.com/)
  - Tailwind: [Tailwind CSS](https://tailwindcss.com/)

## Repository Structure
```
Project/
  client/          # React app (Vite)
    src/
      components/  # Reusable UI components (incl. shadcn/ui wrappers)
      App.jsx
    eslint.config.js
    package.json
  README.md
```

## Notes
- Always use npm for installing and running scripts.
- Follow existing component patterns and Tailwind conventions.
