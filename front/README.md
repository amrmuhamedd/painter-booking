# Adam Painter Booking - Frontend

## Introduction

Welcome to the Adam Painter Booking frontend application. This React-based platform provides a comprehensive solution for managing painter bookings, with separate interfaces for customers and painters. The system features secure authentication, intuitive scheduling, and real-time availability management.

## Features

### Authentication & Security
- **Secure Authentication**: Using HTTP-only cookies for refresh tokens and localStorage for access tokens
- **Protected Routes**: Role-based access control for customers and painters
- **Token Auto-Refresh**: Seamless token refresh mechanism
- **Complete Auth Flow**: Registration, login, and logout functionality

### Customer Features
- **Booking Scheduling**: Easy-to-use interface for requesting painting services
- **Date & Time Selection**: Flexible calendar and time picker
- **Booking Management**: View, track, and cancel bookings
- **Suggestions System**: Alternative time slot recommendations when preferred slots are unavailable

### Painter Features
- **Availability Management**: Set and manage available time slots
- **Booking Overview**: View assigned jobs and upcoming work
- **Schedule Management**: Tools to organize painting appointments

## Tech Stack

This application is built using the following modern technologies:

- **React**: Frontend JavaScript library for building user interfaces
- **Redux Toolkit**: State management with simplified Redux configuration
- **TypeScript**: Strongly-typed programming for better code quality and developer experience
- **Axios**: Promise-based HTTP client for API requests with interceptors for token handling
- **Ant Design**: Comprehensive UI component library for professional interfaces
- **Day.js**: Lightweight date-time manipulation library
- **Vite**: Next generation frontend tooling for faster development

## Authentication Security

The authentication system implements a secure approach:

- **Access Tokens**: Stored in localStorage for short-lived authentication
- **Refresh Tokens**: Stored as HTTP-only cookies, making them inaccessible to JavaScript and protected against XSS attacks
- **Auto Refresh**: Automatic token refresh when access tokens expire

## Getting Started

### Prerequisites

Before running the frontend application, make sure you have:

1. Node.js (v14 or higher) and yarn installed
2. The backend API running (see backend README for setup instructions)
3. PostgreSQL database configured and migrations run

### Installation

Follow these instructions to run the frontend locally:

1. Clone the project repository to your local machine:

   ```bash
   git clone <repository_url>
   cd <project_directory>/front
   ```

2. Create a `.env` file in the front directory and configure the environment variables:

   ```bash
   VITE_ENV_API_BASE_URL=http://localhost:5000
   ```

3. Install dependencies:

   ```bash
   yarn install
   ```

4. Start the development server:

   ```bash
   yarn dev
   ```

5. Build for production:

   ```bash
   yarn build
   ```

The development server will be available at `http://localhost:5173`

## API Integration

This frontend integrates with the Adam Painter Booking NestJS backend with the following key endpoints:

### Authentication
- `/auth/login`: User login with email/password
- `/auth/register`: User registration 
- `/auth/refresh`: Refresh access tokens
- `/auth/logout`: User logout and token invalidation

### Bookings
- `/bookings/request/authenticated`: Create a new booking as authenticated user
- `/bookings/me`: Get current customer's bookings
- `/bookings/painter`: Get assigned painter's bookings
- `/bookings/:id`: Get booking details
- `/bookings/:id/cancel`: Cancel a booking

### Availability
- `/availability`: Create and get availability slots
- `/availability/me`: Get painter's own availability slots

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components like navigation
│   └── scheduling/      # Booking and scheduling components
├── pages/               # Page components for routing
├── services/            # API service integrations
├── store/               # Redux store configuration
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
