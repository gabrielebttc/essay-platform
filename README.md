# IELTS Essay Feedback Platform

A full-stack web application for IELTS writing feedback where students can submit essays and receive detailed feedback from examiners.

## Features

- **User Authentication**: Secure JWT-based authentication for students and admin
- **Essay Submission**: Students can submit IELTS Task 1 or Task 2 essays
- **Payment Integration**: Stripe integration for essay review payments
- **Admin Panel**: Interface for examiners to review and provide feedback
- **Email Notifications**: Automatic email notifications for submission status updates
- **Responsive Design**: Mobile-friendly interface built with React

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for development and building
- React Router for navigation
- Axios for API communication
- Tailwind CSS for styling

### Backend
- Node.js with Express and TypeScript
- PostgreSQL database
- JWT for authentication
- Stripe for payment processing
- Nodemailer for email notifications
- bcryptjs for password hashing

## Project Structure

```
ielts-essay-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── public/
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   └── package.json
└── README.md
```

## How to Run Locally

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ielts-essay-platform
```

### 2. Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE ielts_essay_platform_db;
```

2. Run the database schema:
```bash
psql -U posgres -d ielts_essay_platform_db -f server/src/config/schema.sql
```

### 3. Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Edit the `.env` file with your configuration:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ielts_essay_platform
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@ieltsessay.com
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 4. Frontend Setup

1. Open a new terminal and navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

### Default Admin Login

- **Email**: admin@ielts.com
- **Password**: admin123

## How to Deploy

### 1. Production Database

1. Set up a PostgreSQL database on your hosting provider (AWS RDS, Heroku Postgres, etc.)
2. Run the schema file on your production database
3. Update environment variables with production database credentials

### 2. Backend Deployment

1. Choose a hosting platform (Heroku, Render, AWS, Vercel, etc.)
2. Set environment variables in your hosting dashboard
3. Deploy the backend

**Example for Render:**
```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start production server
npm start
```

### 3. Frontend Deployment

1. Configure the production API URL in the frontend
2. Build the frontend:
```bash
npm run build
```

3. Deploy to your preferred hosting platform (Vercel, Netlify, AWS S3, etc.)

**Vite Configuration Update:**
Update `vite.config.ts` for production:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://your-backend-url.com',
        changeOrigin: true,
      },
    },
  },
})
```

## Key Configuration Locations

### 1. Database Configuration
**File**: `server/src/config/database.ts`
- PostgreSQL connection settings
- Connection pool configuration

### 2. Stripe Keys
**File**: `server/.env`
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 3. Email Configuration
**File**: `server/.env`
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@ieltsessay.com
```

### 4. JWT Secret
**File**: `server/.env`
```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 5. API Base URL
**File**: `client/src/services/api.ts`
```typescript
const API_BASE_URL = 'http://localhost:5000/api'
```

For production, update this to your backend URL.

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **JWT Secret**: Use a strong, unique JWT secret in production
3. **Database**: Use connection pooling and SSL in production
4. **Stripe**: Use test keys during development, live keys for production
5. **Email**: Use app-specific passwords for Gmail SMTP

## Development Notes

- The project uses TypeScript for type safety
- Backend runs on port 5000, frontend on port 3000
- API proxy is configured to avoid CORS issues
- Database schema includes proper indexes for performance
- Passwords are hashed using bcryptjs
- All API endpoints are protected with JWT middleware where required

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.