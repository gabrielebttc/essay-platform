# Project Overview

This is a full-stack web application for an IELTS Essay Feedback Platform. Students can submit IELTS Task 1 or Task 2 essays and receive detailed feedback from examiners. The platform includes secure user authentication (JWT-based), Stripe integration for payments, an admin panel for examiners, and automatic email notifications.

## Technologies Used

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router
- **API Communication**: Axios
- **Styling**: Tailwind CSS

### Backend
- **Framework**: Node.js with Express and TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT, bcryptjs for password hashing
- **Payments**: Stripe
- **Email Notifications**: Nodemailer

## Architecture

The application follows a client-server architecture:
-   **Client**: A React application located in the `client/` directory, responsible for the user interface and interacting with the backend API.
-   **Server**: A Node.js/Express application located in the `server/` directory, handling API requests, database interactions, authentication, payments, and email notifications.

# Building and Running

## Prerequisites

-   Node.js (v18 or higher)
-   PostgreSQL (v12 or higher)
-   Git

## Local Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ielts-essay-platform
```

### 2. Database Setup

1.  Create a PostgreSQL database:
    ```sql
    CREATE DATABASE ielts_essay_platform_db;
    ```
2.  Run the database schema and seed data:
    ```bash
    psql -U postgres -d ielts_essay_platform_db -f server/src/config/schema.sql
    psql -U postgres -d ielts_essay_platform_db -f server/src/config/seed.sql
    ```

### 3. Backend Setup

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    ```bash
    cp .env.example .env
    # Edit the .env file with your specific configurations for DB, JWT, Stripe, and Email.
    ```
4.  Start the backend server:
    ```bash
    npm run dev
    ```
    The backend will run on `http://localhost:5000`.

### 4. Frontend Setup

1.  Open a new terminal and navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend development server:
    ```bash
    npm run dev
    ```
    The frontend will run on `http://localhost:3000`.

## Testing

The `README.md` does not explicitly mention testing commands. It is recommended to check `package.json` files for potential `test` scripts.

# Development Conventions

## Project Structure
-   Frontend (`client/`): Organizes components, pages, services, and types.
-   Backend (`server/`): Structures configuration, controllers, middleware, models, routes, and utilities.

## Coding Standards
-   The project utilizes TypeScript for enhanced type safety across both frontend and backend.

## Security Considerations
-   **Environment Variables**: `.env` files must never be committed to version control.
-   **JWT Secret**: Use a strong, unique secret key for JWT in production environments.
-   **Database**: Employ connection pooling and SSL for production database connections.
-   **Stripe**: Use test keys during development and switch to live keys for production.
-   **Email**: For services like Gmail SMTP, use app-specific passwords.

## API Endpoints
-   Backend API: `http://localhost:5000`
-   Frontend: `http://localhost:3000`
-   API Health Check: `http://localhost:5000/api/health`

## Default Admin Login
-   **Email**: `admin@ielts.com`
-   **Password**: `admin123`

## Deployment Notes
-   Separate deployment steps are required for the frontend and backend.
-   Environment variables must be configured on the hosting platform.
-   Vite configuration for the frontend needs to be updated with the production backend URL.