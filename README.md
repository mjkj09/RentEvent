## 📋 Project Description

RentEvent is a comprehensive web platform that connects venue owners with event organizers. The system provides an intuitive interface for browsing, booking, and managing event venues across various categories.

### Key Features:
- 🏢 **For Venue Owners**: Create and manage rental listings, handle customer inquiries
- 🎉 **For Event Organizers**: Search venues, filter by category/location/price, save favorites
- ❤️ **Favourites System**: Add venues to favourites for later
- ⭐ **Review System**: Rate and review venues after events
- 🔐 **Secure Authentication**: JWT with refresh tokens, role-based access control (owner/renter)
- 📧 **Email Notifications**: Automated emails via SendInBlue (Brevo) for booking requests

## 🏗️ System Architecture

```
                           ┌─────────────────┐
                           │   Web Browser   │
                           └────────┬────────┘
                                    │
                        ┌───────────▼───────────┐
                        │  FRONTEND (React)     │
                        │  - Port: 5173         │
                        │  - Vite Dev Server    │
                        │  - Material-UI        │
                        └───────────┬───────────┘
                                    │ HTTP/REST
                        ┌───────────▼───────────┐
                        │  BACKEND (Express)    │
                        │  - Port: 5000         │
                        │  - JWT Auth           │
                        │  - RESTful API        │
                        └─────┬─────────┬───────┘
                              │         │
                    ┌─────────▼───┐ ┌───▼──────────┐
                    │   MongoDB   │ │  RabbitMQ    │
                    │ Port: 27017 │ │ Port: 5672   │
                    │             │ │ UI: 15672    │
                    └─────────────┘ └──────────────┘
                                            │
                                    ┌───────▼────────┐
                                    │ Email Service  │
                                    │    (Brevo)     │
                                    └────────────────┘
```

## 🛠️ Technologies Used

### Frontend
- **React 19.0.0** - Modern UI library for building user interfaces
  - *Justification*: Latest version with improved performance, component-based architecture, excellent ecosystem
- **Material-UI (MUI) 7.0.2** - React component library
  - *Justification*: Consistent design system, built-in responsiveness, accessibility features
- **React Router DOM 7.4.1** - Client-side routing
  - *Justification*: Industry standard for React SPAs, supports nested routes and data loading
- **Axios 1.9.0** - HTTP client
  - *Justification*: Request/response interceptors for token handling, automatic JSON transformation
- **Vite 6.2.0** - Build tool and dev server
  - *Justification*: Lightning-fast HMR, optimized production builds, better DX than webpack
- **Emotion** - CSS-in-JS styling (used by MUI)
  - *Justification*: Dynamic styling, better performance than runtime CSS
- **Zxcvbn 4.4.2** - Password strength estimator
  - *Justification*: Provides realistic password strength feedback to users

### Backend
- **Node.js + Express 4.21.2** - Server framework
  - *Justification*: JavaScript across the stack, mature ecosystem, excellent performance
- **MongoDB + Mongoose 8.12.1** - NoSQL database and ODM
  - *Justification*: Flexible schema for diverse venue types, excellent Node.js integration
- **JWT (jsonwebtoken 9.0.2)** - Authentication
  - *Justification*: Stateless authentication, supports refresh token pattern
- **Bcrypt 6.0.0** - Password hashing
  - *Justification*: Industry standard for password security, resistance to timing attacks
- **Multer 2.0.1** - File upload handling
  - *Justification*: Streamlined multipart/form-data handling, memory and disk storage options
- **Joi 17.13.3** - Data validation
  - *Justification*: Schema-based validation, clear error messages, extensive validation rules
- **RabbitMQ (amqplib 0.10.8)** - Message queue
  - *Justification*: Async processing for emails, improved system resilience
- **SendInBlue SDK 8.5.0** - Email service
  - *Justification*: Reliable email delivery, transactional email support, good free tier
- **Swagger (swagger-jsdoc 6.2.8 + swagger-ui-express 5.0.1)** - API documentation
  - *Justification*: Interactive API documentation, helps with frontend-backend coordination

### DevOps & Development Tools
- **Docker** - Containerization (Dockerfiles present)
  - *Justification*: Consistent development environments, easy deployment
- **Nodemon 3.1.9** - Development server
  - *Justification*: Auto-restart on file changes, improves developer productivity
- **ESLint 9.21.0** - Code linting
  - *Justification*: Maintains code quality, catches potential bugs early
- **CORS 2.8.5** - Cross-origin resource sharing
  - *Justification*: Enables frontend-backend communication across different ports
- **Cookie-parser 1.4.7** - Cookie handling
  - *Justification*: Secure httpOnly cookie management for refresh tokens

## 📦 System Requirements

- Docker & Docker Compose (recommended)
- OR manually install:
  - Node.js >= 18.0.0
  - npm >= 9.0.0
  - MongoDB >= 6.0
  - RabbitMQ >= 3.13.7

## 🚀 Installation Instructions

### 1. Clone Repository
```bash
git clone https://github.com/mjkj09/RentEvent.git
cd RentEvent
```

### 2. Environment Configuration

#### Create root `.env` file (in project root directory)
```env
# Brevo (SendInBlue) Configuration
BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_EMAIL=noreply@yourdomain.com
```

#### Create server `.env` file (in `server/` directory)
```env
# Required Environment Variables
JWT_SECRET=your_super_secret_jwt_key_here_min_32_characters
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_min_32_characters
NODE_ENV=development

# Brevo (SendInBlue) - same as root .env
BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_EMAIL=noreply@yourdomain.com

# Optional (defaults will be used if not specified)
PORT=5000
MONGODB_URI=mongodb://mongo:27017/rentevent
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
CLIENT_URL=http://localhost:5173
```

### 3. Run with Docker Compose

```bash
# Build and start all services in detached mode
docker compose up --build -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Stop and remove all data (volumes)
docker compose down -v
```

### 4. Access the Application

After running Docker Compose, the following services will be available:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation (Swagger)**: http://localhost:5000/api/v1/docs/
- **RabbitMQ Management UI**: http://localhost:15672
    - Default credentials: `guest` / `guest`
- **MongoDB**: mongodb://localhost:27017

### 5. Alternative: Manual Setup (without Docker)

If you prefer to run services manually:

#### Backend Setup
```bash
cd server
npm install

# Make sure MongoDB and RabbitMQ are running locally
# Start the backend
npm run dev
```

#### Frontend Setup
```bash
cd client
npm install

# Start the frontend
npm run dev
```

## 🧪 Testing

### Initial Setup
The application starts with an empty database. Users need to register new accounts to begin using the platform.

### Registration Process
1. Navigate to http://localhost:5173
2. Click on "Get Started"
3. Switch to "Sign Up" mode
4. Create an account as either:
    - **Event Organizer (Renter)**: Browse and book venues
    - **Venue Owner**: List and manage venues (requires company setup)

### API Testing
Use the Swagger documentation at `http://localhost:5000/api/v1/docs/` to test API endpoints directly.

## 📁 Project Structure
```
rentevent/
├── .env                      # Root environment variables (Brevo config)
├── docker-compose.yml        # Docker orchestration file
├── README.md                 # This file
│
├── client/                   # React Frontend
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── api/             # API configuration and endpoints
│   │   ├── components/      # Reusable React components
│   │   ├── constants/       # Application constants
│   │   ├── contexts/        # React Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # Business logic services
│   │   ├── theme/           # Material-UI theme configuration
│   │   ├── utils/           # Helper functions
│   │   ├── views/           # Page components
│   │   ├── App.jsx          # Main application component
│   │   ├── index.css        # Global styles
│   │   └── main.jsx         # Application entry point
│   ├── Dockerfile           # Frontend container config
│   ├── index.html           # HTML template
│   └── package.json         # Frontend dependencies
│
└── server/                   # Node.js Backend
    ├── config/              # Configuration files
    ├── controllers/         # Request handlers
    ├── docs/                # API documentation
    ├── middleware/          # Express middleware
    ├── models/              # Mongoose schemas
    ├── public/              # Public assets
    ├── repositories/        # Data access layer
    ├── routes/              # API route definitions
    ├── services/            # Business logic
    │   ├── auth.service.js
    │   ├── company.service.js
    │   ├── email.service.js
    │   ├── queue.service.js
    │   ├── request.service.js
    │   ├── review.service.js
    │   ├── user.service.js
    │   └── venue.service.js
    ├── utils/               # Utility functions
    │   ├── AppError.js      # Custom error class
    ├── .env                 # Backend environment variables
    ├── Dockerfile           # Backend container config
    ├── index.js             # Server entry point
    └── package.json         # Backend dependencies
```

## 🔒 Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT tokens with short expiration (15 minutes) + refresh tokens (30 days)
- Input validation using Joi schemas
- CSRF protection via httpOnly cookies
- CORS configured for trusted origins only
- File upload restrictions (type and size validation)
- Request sanitization to prevent XSS attacks
- Role-based access control (RBAC)
- Secure password requirements enforced with zxcvbn

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Author

- Mikołaj Munik - *CS Student at Cracow University of Technology* - [GitHub](https://github.com/mjkj09)
