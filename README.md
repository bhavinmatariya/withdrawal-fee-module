# Withdrawal Rate Module

This project is a **Range-Based Withdrawal Rate Module** built with **Node.js**, **Express**, **TypeScript**, and **Prisma**. It provides an API to manage withdrawal rate ranges, calculate fees based on amounts, and upload rate ranges from CSV or Excel files.


## Installation


### Steps


1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the environment variables:
   Create a `.env` file in the root directory with the following content:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/mydb"
   PORT=3000
   ```
   Replace `username`, `password`, and `mydb` with your PostgreSQL credentials and database name.

3. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

## Usage

### Start the Development Server
```bash
npm run dev
```
The server will run at **http://localhost:3000**.

### API Documentation
Access the Swagger API documentation at:
**http://localhost:3000/api/docs**

## API Endpoints

### Ranges Management
| Method | Endpoint             | Description                    |
|--------|---------------------|--------------------------------|
| POST   | `/api/ranges/upload` | Upload withdrawal rate ranges from CSV or Excel files |
| POST   | `/api/ranges`       | Create a new withdrawal rate range |
| PUT    | `/api/ranges/{id}`  | Update an existing withdrawal rate range |
| DELETE | `/api/ranges/{id}`  | Delete a withdrawal rate range |
| GET    | `/api/ranges`       | Get all withdrawal rate ranges |
| GET    | `/api/ranges/calculate?amount=1000` | Calculate withdrawal rate based on amount |

## Environment Variables

| Variable       | Description                |
|---------------|---------------------------|
| `DATABASE_URL` | PostgreSQL connection URL |
| `PORT`        | Port on which the server will run |

## Running Tests
To run unit and integration tests:
```bash
npm test
```