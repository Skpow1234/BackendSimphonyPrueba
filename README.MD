
# API Documentation Backend Test Symphony Semi-senior

This project is a backend developed with **NestJS** and **TypeScript** to manage services and assign them to users. It implements development best practices, following a modular architecture and using TypeORM for interaction with a **PostgreSQL** database.

There is no specific command for database migration, as the code is set up with automatic synchronization. This means that after completing the initial configuration (mentioned below) and running the command to start the server, the tables will be generated automatically.

## Features

- **User Management**: Allows users to register and authenticate using JWT, ensuring secure access to the API.
- **Service Management**: Provides endpoints to create, list, and delete services, allowing them to be assigned to users.
- **API Documentation**: The API is documented using **Swagger**, making it easier to interact with and test the endpoints.
- **Logical Deletion**: Logical deletion is implemented using the `deletedAt` field, allowing services to be tracked as deleted without losing historical data.

## Technologies Used

- **NestJS**: Framework for building server-side applications.
- **TypeScript**: A superset of JavaScript that adds static typing.
- **PostgreSQL**: Relational database management system.
- **TypeORM**: ORM that facilitates database interaction.
- **Swagger**: Tool for documenting and testing REST APIs.

This project has been designed to meet the requirements of the technical test, demonstrating key skills in backend development within a professional environment.

## Requirements

- Node.js (v22.0.0 or higher)
- PostgreSQL

## Steps to clone and run the project

1. Clone the repository:

   ```bash
   git clone https://github.com/Skpow1234/BackendSimphony
   ```

2. Access the project directory:

   ```bash
   cd PruebaBackendSymphony
   ```

3. In the project root, create a `.env` file with the following structure:

   ```bash
   DB_HOST=
   DB_PORT=
   DB_USERNAME=
   DB_PASSWORD=
   DB_NAME=
   JWT_SECRET=
   JWT_EXPIRES_IN=1h
   ```

4. Install the dependencies:

   ```bash
   npm install 
   ```

5. Run the seeders to load initial data:

   ```bash
   ts-node seed.ts
   ```

6. Start the server:

   ```bash
   npm run start:dev
   ```

7. To run unit tests:

   ```bash
   npm run test
   ```

## Instructions for accessing Swagger documentation

Once the server is running, you can access the Swagger documentation at the following URL:

   ```bash
   http://localhost:3000/api
   ```
