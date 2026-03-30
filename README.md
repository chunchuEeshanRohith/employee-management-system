# Employee Management System

A full-stack application with a Spring Boot backend and a React/Vite frontend.

## 📁 Project Structure

- **`backend/`**: Spring Boot implementation (Maven).
- **`frontend/`**: React application (Vite).

## 🚀 Getting Started

### 1. Prerequisites
- Java 17+
- Node.js 18+
- MySQL (Aiven)

### 2. Environment Setup
Create a `.env` file in the root based on `.env.example`:

```bash
cp .env.example .env
```

### 3. Running the Backend
```bash
cd backend
# Set your environment variables first (export/set)
./mvnw spring-boot:run
```

### 4. Running the Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Deployment

- **Frontend**: Deploy the `frontend/` folder to Vercel/Netlify. Set `VITE_API_BASE_URL` to your production backend URL.
- **Backend**: Deploy the `backend/` folder to Render/Heroku. Ensure database environment variables are set in the dashboard.
