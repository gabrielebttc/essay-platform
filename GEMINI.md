# Project Overview

This is a full-stack web application for an IELTS Essay Feedback Platform. Students can submit IELTS essays and receive detailed feedback from examiners. The platform is structured as a monorepo with a `client` directory for the frontend and a `server` directory for the backend.

## Key Features
- **Student Portal**: Submit essays, view submission history, and see detailed feedback.
- **Admin Portal**: Review student submissions, provide detailed feedback (including scores and a corrected version), and view a history of all submissions.
- **Multiple Reviews**: The system supports multiple feedback cycles for a single essay submission.
- **Payments**: Integration with Stripe for payment processing.

# Technologies Used

### Frontend (`client/`)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router
- **Styling**: Tailwind CSS (via CDN)
- **API Communication**: Axios

### Backend (`server/`)
- **Framework**: Node.js with Express and TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT with `bcryptjs` for password hashing.
- **Payments**: Stripe

# Database Schema

The PostgreSQL database consists of the following main tables:
- `users`: Stores student and admin information.
- `essays`: Contains the original essay content submitted by students. Each essay has a unique `id`.
- `essay_feedback`: Stores all feedback associated with an essay. Crucially, this table has a **many-to-one relationship** with the `essays` table (via `essay_id`), allowing a single essay to have multiple reviews. Each feedback entry has its own unique `id`.
- `payments`: Tracks payment status for submissions.
- `essay_types`: Defines different essay categories (e.g., Task 1, Task 2) and their prices.

# Building and Running

## Frontend (`client/`)
To start the frontend development server:
```bash
cd client
npm install
npm run dev
```
The client will be available at `http://localhost:3000`.

## Backend (`server/`)
To start the backend server:
```bash
cd server
npm install
# Ensure you have a .env file configured based on .env.example
npm run dev
```
The server will run on `http://localhost:5000`.

## Testing
No explicit `test` scripts were found in the `package.json` files.