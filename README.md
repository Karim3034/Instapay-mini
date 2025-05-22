# InstaPay - Microservices Payment Application

InstaPay is a microservices-based payment application built with Spring Boot, Angular, and PostgreSQL.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Kubernetes](https://kubernetes.io/docs/setup/) (optional, for Kubernetes deployment)
- [kubectl](https://kubernetes.io/docs/tasks/tools/) (optional, for Kubernetes deployment)
- [Java 21+](https://www.oracle.com/java/technologies/downloads/) (for local development)
- [Maven](https://maven.apache.org/download.cgi) (for local development)
- [Node.js and npm](https://nodejs.org/) (for frontend development)

## Project Structure

The project consists of the following microservices:

- **Discovery Service**: Eureka server for service discovery
- **Config Server**: Centralized configuration server
- **User Service**: Manages user accounts and authentication
- **Transaction Service**: Handles payment transactions
- **Reporting Service**: Generates reports and analytics
- **API Gateway**: Routes requests to appropriate services
- **Frontend**: Angular-based web interface

## Running the Application

### Option 1: Using Docker Compose (Recommended)

1. Clone the repository:
   ```
   git clone <repository-url>
   cd InstaPay
   ```

2. Build and start all services:
   ```
   docker-compose up -d
   ```

3. To stop all services:
   ```
   docker-compose down
   ```

4. To stop all services and remove volumes:
   ```
   docker-compose down -v
   ```

### Option 2: Using Kubernetes

1. Create the namespace:
   ```
   kubectl apply -f kubernetes/namespace.yaml
   ```

2. Deploy PostgreSQL:
   ```
   kubectl apply -f kubernetes/postgres.yaml
   ```

3. Deploy the Discovery Service:
   ```
   kubectl apply -f kubernetes/discovery-service.yaml
   ```

4. Deploy the User Service:
   ```
   kubectl apply -f kubernetes/user-service.yaml
   ```

5. Deploy other services (if Kubernetes configurations are available):
   ```
   kubectl apply -f kubernetes/<service-name>.yaml
   ```

### Option 3: Local Development

1. Start PostgreSQL:
   ```
   docker-compose up -d postgres
   ```

2. Run each service individually:
   ```
   cd discovery-service
   ./mvnw spring-boot:run
   
   cd ../config-server
   ./mvnw spring-boot:run
   
   cd ../user-service
   ./mvnw spring-boot:run
   
   cd ../transaction-service
   ./mvnw spring-boot:run
   
   cd ../reporting-service
   ./mvnw spring-boot:run
   
   cd ../api-gateway
   ./mvnw spring-boot:run
   ```

3. Run the frontend:
   ```
   cd frontend
   npm install
   npm start
   ```

## Accessing the Application

After starting the application, you can access:

- Frontend: http://localhost:80
- API Gateway: http://localhost:8080
- Eureka Dashboard: http://localhost:8761
- Config Server: http://localhost:8888
- User Service: http://localhost:8081
- Transaction Service: http://localhost:8082
- Reporting Service: http://localhost:8083

## API Documentation

- Swagger UI for User Service: http://localhost:8081/swagger-ui.html
- Swagger UI for Transaction Service: http://localhost:8082/swagger-ui.html
- Swagger UI for Reporting Service: http://localhost:8083/swagger-ui.html

## Troubleshooting

- If services fail to start, check the logs:
  ```
  docker-compose logs <service-name>
  ```

- Ensure all required ports are available (5432, 8080, 8081, 8082, 8083, 8761, 8888)

- If database initialization fails, you may need to uncomment the statements in init-db.sql

## Development

For development purposes, you can run individual services locally while others run in Docker. Make sure to update the application.properties files to point to the correct service URLs.