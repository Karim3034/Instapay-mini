# Mini-InstaPay Angular Frontend

This project is an Angular implementation of the Mini-InstaPay frontend, designed to work with the existing microservices architecture.

## Project Structure

The project follows a standard Angular application structure:

- `src/app/components`: Contains all Angular components (login, register, dashboard, transactions)
- `src/app/services`: Contains services for API communication (auth, transaction, user)
- `src/app`: Contains the main application module and routing configuration
- `Dockerfile`: Multi-stage build for production deployment
- `nginx.conf`: Nginx configuration for serving the Angular application

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Angular CLI (`npm install -g @angular/cli`)
- Docker and Docker Compose

## Development Setup

1. Install dependencies:
   ```
   cd frontend-angular
   npm install
   ```

2. Run the development server:
   ```
   ng serve
   ```

3. Access the application at `http://localhost:4200`

## Building for Production

1. Build the application:
   ```
   ng build --prod
   ```

2. The build artifacts will be stored in the `dist/instapay-frontend` directory.

## Docker Deployment

1. Ensure Docker Desktop is running
2. Build and run the containers:
   ```
   docker-compose up -d
   ```
3. Access the application at `http://localhost`

## API Integration

The Angular frontend communicates with the backend microservices through the API Gateway. The following services are used:

- `AuthService`: Handles user authentication (login, register, logout)
- `UserService`: Manages user profile and account operations
- `TransactionService`: Handles financial transactions and history

## Components

### Login Component
- Provides user authentication functionality
- Validates user credentials
- Redirects to dashboard on successful login

### Register Component
- Allows new users to create an account
- Validates registration form inputs
- Provides feedback on registration success/failure

### Dashboard Component
- Displays user account information
- Shows recent transactions
- Provides quick access to common actions (send money, deposit, withdraw)

### Transactions Component
- Displays transaction history
- Allows filtering by transaction type and date range
- Provides pagination for large transaction lists

## Troubleshooting

If you encounter issues with Docker, ensure that:
1. Docker Desktop is running
2. You have sufficient permissions to access the Docker daemon
3. The Docker daemon is properly configured

For Docker connection errors like "unable to connect to Docker daemon", try:
- Restarting Docker Desktop
- Running Docker commands with administrator privileges
- Checking Docker Desktop logs for specific errors