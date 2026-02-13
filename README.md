# Trello clone app

RESTful backend application inspired by tools like Trello and Jira.  
Built as a learning and portfolio project with focus on clean architecture, validation, and testing.

---

## What this project demonstrates

- Building a REST API with Node.js and Express
- Authentication and authorization using JWT
- MongoDB data modeling with Mongoose
- Layered architecture (controllers, repositories, middleware)
- Request validation using Joi
- Email-based user invitations
- Writing end-to-end tests
- Error handling and protected routes

---

## Core Features

### Authentication
- User signup and login
- Password hashing
- JWT-based authorization

### Boards
- Create and fetch boards
- Assign users with roles
- Invite users via email
- Accept board invitations

### Columns
- Create and update columns
- Set default column per board

### Tickets
- Create tickets with validation
- Assign tickets to users
- Fetch single ticket
- Update ticket fields

---

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT
- Joi
- Nodemailer
- Mocha, Chai

---

## Project Structure

```
trello-clone/
│
└── master/
    │
    ├── src/                              # Main backend source code
    │
    │   ├── config/                       # Configuration and external services
    │   │   ├── database.js               # MongoDB connection setup
    │   │   └── mailservice.js            # Email invitation service configuration
    │   │
    │   ├── controllers/                  # Business logic and request handling
    │   │   ├── boards/                   # Board management logic
    │   │   ├── columns/                  # Column management logic
    │   │   ├── tickets/                  # Ticket management logic
    │   │   └── users/                    # Authentication and user management logic
    │   │
    │   ├── docs/                         # API documentation files
    │   │   ├── boards.yaml               # Swagger/OpenAPI documentation for boards
    │   │   └── users.yaml                # Swagger/OpenAPI documentation for users
    │   │
    │   ├── middlewares/                  # Middleware layer
    │   │   ├── validations/
    │   │   │   └── index.js              # Joi validation schemas
    │   │   └── index.js                  # JWT authentication and general middleware
    │   │
    │   ├── models/                       # MongoDB Mongoose schemas
    │   │   ├── board.js                  # Board data model
    │   │   ├── column.js                 # Column data model
    │   │   ├── invitation.js             # Invitation data model
    │   │   ├── ticket.js                 # Ticket data model
    │   │   └── user.js                   # User data model
    │   │
    │   ├── repositories/                 # Database access and query logic
    │   │   ├── boards/                   # Board database operations
    │   │   ├── columns/                  # Column database operations
    │   │   ├── ticket/                   # Ticket database operations
    │   │   └── users/                    # User database operations
    │   │
    │   ├── routes/                       # API route definitions
    │   │   ├── boards/                   # Board-related routes
    │   │   ├── users/                    # User authentication routes
    │   │   └── index.js                  # Main route entry point
    │   │
    │   ├── tests/                        # End-to-end test suite
    │   │   ├── user.js                   # Test user setup
    │   │   ├── boards.test.js            # Board functionality tests
    │   │   └── users.test.js             # User authentication tests
    │   │
    │   ├── utils/                        # Helper utility functions
    │   │   └── index.js
    │   │
    │   └── app.js                        # Express app initialization
    │
    ├── .env                              # Environment variables
    ├── .eslintrc.js                      # ESLint configuration
    ├── .gitignore                        # Git ignore rules
    ├── package.json                      # Project dependencies and scripts
    └── package-lock.json
```

---

## API Endpoints

### Users

| Method | Endpoint | Description |
|----------|-------------|----------------|
| POST | /users/login | Authenticates user and returns JWT token |
| POST | /users/signup | Registers new user account |
| POST | /users/invite | Sends board invitation email to user |

---

###  Boards

| Method | Endpoint | Description |
|----------|-------------|----------------|
| GET | /boards | Retrieves all boards assigned to authenticated user |
| POST | /boards | Creates a new board |
| GET | /boards/:id | Retrieves single board details |
| PUT | /boards/:boardId | Updates board details |
| GET | /boards/:id/join/:code | Accepts board invitation using invitation code |

---

###  Columns

| Method | Endpoint | Description |
|----------|-------------|----------------|
| POST | /boards/columns | Creates new column inside board |
| PUT | /boards/columns/:columnId | Updates column data |

---

###  Tickets

| Method | Endpoint | Description |
|----------|-------------|----------------|
| POST | /boards/:boardId/tickets | Creates new ticket inside board |
| GET | /boards/:boardId/ticket/:id | Retrieves ticket details |
| PUT | /boards/:boardId/ticket/:id | Updates ticket fields |

---

## API Notes

###  Authentication
- JWT middleware protects all private routes.
- Token is required for board, column, and ticket operations.

---

###  Invitation System
- Users can invite collaborators via email.
- Invitations include a unique join code.
- Invited users can accept invitations via dedicated endpoint.

---


## Getting Started

These instructions will help you clone, build, and run the project locally for development and testing.

---

## Prerequisites

Make sure you have the following installed on your machine:

- Node.js (v16 or later)
- npm
- MongoDB (local installation or MongoDB Atlas)

Verify installations:

- node -v
- npm -v
- mongod --version


---

## Clone the Repository

- git clone https://github.com/babacicemir/trello-app

## Install Dependencie

- npm install


---

## Environment Variables

Create a `.env` file in the root of the project.

## Running the Application

Start the development server:
    -npm run dev

The server will start at: https://localhost:3000/

## Running Tests

Tests use a separate test database to avoid affecting development data.
E2E tests are implemented for this project.

Run all tests:
    -npm test

Notes:
- Tests automatically connect to the test database
- No additional configuration is required
- Database connection is handled internally in test setup

## Test Coverage

Tests cover:
- User authentication
- Board creation and retrieval
- Column creation and updates
- Ticket creation, fetching, and updating
- Validation and error cases

Testing stack:
- Mocha
- Chai

## Notes

- All sensitive routes are protected with JWT middleware
- Validation errors return meaningful messages
- Clean separation of concerns across layers

## Author

Babačić Emir
