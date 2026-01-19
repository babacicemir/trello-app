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
