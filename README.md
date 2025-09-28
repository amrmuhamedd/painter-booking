# Painter Booking System

A full-stack application for scheduling and managing painter bookings with reliable concurrency handling and automated painter assignment.

## Project Overview

This system enables painters to publish their availability and customers to book services. The system automatically assigns the most suitable painter based on various factors like ratings, workload, and availability fit. It also provides features to prevent race conditions when multiple customers try to book the same time slot.

### Key Features

- **Painter Availability Management**: Painters can add, view, and delete availability slots
- **Customer Booking System**: Customers can request bookings for specific time windows
- **Automatic Painter Assignment**: System assigns the optimal painter for each booking
- **Concurrency Handling**: Database-level exclusion constraints prevent double booking
- **Alternative Slot Recommendations**: When no painter is available, system suggests alternatives

## Tech Stack

### Backend
- NestJS with TypeScript
- PostgreSQL with TypeORM
- JWT-based authentication
- Database-level constraints for concurrency control

### Frontend
- React with TypeScript
- Redux Toolkit for state management
- Ant Design component library
- React Router for navigation
- Axios for API requests

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- Yarn package manager

### Database Setup

1. Create a PostgreSQL database for the application
2. Make sure the PostgreSQL `btree_gist` extension is available (required for exclusion constraints)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd adam-painter-booking/backend
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your database credentials and other settings:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   DB_DATABASE=your_db_name
   ```

5. Run database migrations:
   ```bash
   yarn migration:run
   ```

6. Start the backend development server:
   ```bash
   yarn start:dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd adam-painter-booking/front
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with the backend API URL:
   ```
   VITE_ENV_API_BASE_URL=http://localhost:5000
   ```

5. Start the frontend development server:
   ```bash
   yarn dev
   ```

## Usage Guide

### Authentication

The application uses JWT-based authentication. Users need to:
1. Register using the signup form
2. Login to access the dashboard

### Painter Workflow

1. Navigate to the **Painter Dashboard**
2. Under "Manage Availability", add new availability slots with the date/time picker
3. View your existing availability slots in the table below
4. Switch to the "Upcoming Bookings" tab to see assigned bookings

### Customer Workflow

1. Navigate to the **Customer Dashboard**
2. Use the booking request form to select your desired date and time
3. If painters are available, your booking will be confirmed automatically
4. If no painter is available, the system will suggest alternative time slots
5. View your bookings under the "My Bookings" tab

## Concurrency Handling

The system prevents race conditions when multiple customers try to book the same painter at the same time using:

1. **PostgreSQL Exclusion Constraints**: Database-level protection against overlapping bookings
2. **Transactional Booking Creation**: Ensures atomicity of booking operations
3. **Idempotent API Design**: Prevents duplicate bookings with client request IDs

## Painter Assignment Strategy

When multiple painters are available for a time slot, the system selects the optimal painter based on:

1. **Rating**: Higher-rated painters are prioritized
2. **Workload Balance**: Painters with fewer existing bookings are favored
3. **Time Slot Fit**: The system minimizes leftover time (painter idle time)

## Project Structure

### Backend

- `/src/authentication`: User authentication and session management
- `/src/scheduling`: Core scheduling logic including:
  - `/entities`: Database models for painters, availabilities, and bookings
  - `/repositories`: Data access layer with specialized query methods
  - `/services`: Business logic for availability and booking operations
  - `/controllers`: API endpoints for the scheduling system
- `/src/migrations`: Database migration files

### Frontend

- `/src/components/scheduling`: Reusable UI components for the scheduling system
- `/src/pages`: Page components for different views
- `/src/services`: API service wrappers for backend communication
- `/src/store`: Redux store configuration and slices

