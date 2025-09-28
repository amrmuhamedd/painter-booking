# Painter Booking System API Documentation

## Introduction

Welcome to the Painter Booking System API documentation. This API enables customers to book skilled painters for various painting jobs and allows painters to manage their availability. The system implements secure authentication with role-based access control, ensuring that only painters can manage availability slots and only customers can book appointments.


## Tech Stack

The Painter Booking System API is built using the following technologies:

- **Nest.js**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **PostgreSQL**: Robust relational database with support for complex queries and transactions.
- **TypeORM**: ORM for TypeScript and JavaScript that simplifies database operations.
- **JWT (JSON Web Tokens)**: For secure authentication and role-based authorization.
- **HTTP-only Cookies**: For secure storage of refresh tokens to prevent XSS attacks.
- **Swagger/OpenAPI**: For comprehensive API documentation.
- **Bcrypt**: For hashing and securing user passwords.
- **Class-Validator & Class-Transformer**: Used for request validation and data transformation.
- **Cookie-Parser**: For parsing and handling HTTP cookies.



## Features

### Authentication
- **User Registration**: Securely create painter or customer accounts with role-specific profile information.
- **User Login**: Authenticate users and issue role-embedded access tokens.
- **Secure Token Handling**: Access tokens contain user role information for authorization.
- **Token Refreshing**: Refresh expired access tokens using secure HTTP-only cookie refresh tokens.
- **User Logout**: Securely invalidate refresh tokens and clear cookies upon logout.

### Role-Based Access Control
- **Painter-Specific Features**: Only users with the painter role can create and manage availability slots.
- **Customer-Specific Features**: Only users with the customer role can book appointments with painters.
- **Role Validation**: Guards ensure endpoints are accessed only by users with appropriate roles.

### Scheduling System
- **Availability Management**: Painters can add, view, and remove their availability slots.
- **Booking System**: Customers can book available time slots with painters.
- **Conflict Prevention**: System prevents double-booking of painters through database constraints.
- **Booking Suggestions**: When conflicts occur, the system suggests alternative available time slots.
- **Painter Matching**: Intelligent painter selection based on availability and other criteria.


## Getting Started

Follow these instructions to run the project locally:

1. Clone the project repository to your local machine:

   ```bash
   git clone <repository_url>
   cd <project_directory>/backend
   ```

2. Create a `.env` file in the project root and configure the following environment variables:

```bash
# Database Configuration - URL-based approach
## Local Development
DATABASE_URL=postgres://postgres:your_password@localhost:5432/painter_booking

## Production with Neon PostgreSQL
# Use this connection string format for Neon database
DATABASE_URL=postgres://neondb_owner:your_password@your-project-id.neon.tech/neondb?sslmode=require

# JWT Authentication
JWT_SECRET=your_jwt_secret_key # Secret for access token
RT_SECRET=your_refresh_token_secret_key # Secret for refresh token

# Server Configuration
PORT=3000 # API server port
CORS_ORIGIN=http://localhost:5173 # Frontend URL for CORS configuration
```

3. Install dependencies:

```bash
yarn install
```

4. Set up the database:

```bash
# Generate a new migration (only needed if schema changes or first setup)
npm run migration:generate src/migrations/initialSchema

# Run migrations to create database tables
npm run migration:run

# Optional: Seed initial data
npm run seed
```

> **IMPORTANT**: Always run migrations before starting the project for the first time or after pulling changes that include database schema modifications.

5. Start the development server:

```bash
yarn start:dev
```

The API documentation will be available at: `http://localhost:3000/api/docs`


## Security Implementation

This API implements enhanced security features to protect user authentication and data:

- **Role-Based Access Control**: Endpoints are protected with role-specific guards to ensure proper authorization.
- **JWT with Role Information**: Access tokens include user role information for secure authorization.
- **HTTP-only Cookies**: Refresh tokens are stored in HTTP-only cookies to prevent XSS attacks.
- **Access Token Security**: Access tokens are short-lived and delivered in response bodies for client-side usage.
- **Secure Cookie Configuration**: In production environments, cookies are configured with secure flag (HTTPS only) and SameSite policy to prevent CSRF attacks.
- **Session Management**: Each user session is tracked and can be invalidated server-side.
- **Database Concurrency Protection**: Booking creation uses transactions to prevent race conditions.
- **Database Constraints**: Exclusion constraints prevent overlapping bookings for the same painter.

## API Authentication & Authorization Flow

1. **Registration**: Users register as either a painter or customer with role-specific information.
2. **Login**: User receives access token containing their role in response body and refresh token in HTTP-only cookie.
3. **Accessing Protected Routes**: Client includes access token in Authorization header, which is validated for both authentication and role authorization.
4. **Role-Based Access**: Guards validate that the user has the appropriate role for the endpoint being accessed.
5. **Token Expiration**: When access token expires, client calls refresh endpoint to get a new token with the same role information.
6. **Logout**: Refresh token cookie is cleared and the token is invalidated server-side.

## Booking Flow

1. **Availability Creation**: Painters create availability slots (painter role required).
2. **Slot Booking**: Customers book available slots (customer role required).
3. **Conflict Resolution**: System prevents double-bookings and provides alternative suggestions when conflicts arise.
4. **Booking Management**: Customers can view and cancel their bookings, painters can view their assigned bookings.

## API Endpoints

Please refer to the Swagger documentation at `/api/docs` for detailed information on each endpoint and how to use them.

## Database Schema

The system uses the following main entities:
- **User**: Stores user information with role (painter or customer) and role-specific profile data
- **Availability**: Records time slots when painters are available for bookings
- **Booking**: Records appointments between customers and painters
- **Session**: Tracks user authentication sessions

---

If you have any questions or encounter issues, feel free to reach out for assistance.
