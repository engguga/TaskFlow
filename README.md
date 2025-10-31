# TaskFlow

TaskFlow is a modern task management application with a Go backend and a React frontend. This README provides concise setup instructions, useful commands, and API references to run and develop the application locally.

## Key Features
- JWT-based user authentication
- Task CRUD with priorities, due dates and statuses
- Kanban-style task board with drag-and-drop
- Responsive UI for desktop and mobile
- PostgreSQL persistence
- Docker Compose for local development

## Prerequisites
- Go 1.21+
- Node.js 18+
- Docker & Docker Compose
- (Optional) Make

## Repository layout
- backend/ — Go API service
- frontend/ — React application
- docker/ — DB or infra definitions (if present)

## Backend — Quick Start
1. Change directory:
   ```
   cd backend
   ```
2. Copy and edit environment file:
   ```
   cp .env.example .env
   # edit .env to set DB credentials, JWT secret, etc.
   ```
3. Start PostgreSQL (from repo root or docker folder):
   ```
   docker-compose up -d
   ```
4. Download Go dependencies:
   ```
   go mod download
   ```
5. Run the backend:
   ```
   go run cmd/main.go
   ```
Default backend: http://localhost:8080

## Frontend — Quick Start
1. Change directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   # or: pnpm install
   ```
3. Start dev server:
   ```
   npm run dev
   ```
Default frontend: http://localhost:3000

## Common API Endpoints
- POST /api/auth/register — Register a new user
- POST /api/auth/login — Authenticate and receive a JWT
- GET /api/tasks — List tasks for authenticated user
- POST /api/tasks — Create a task
- PUT /api/tasks/:id — Update a task
- DELETE /api/tasks/:id — Delete a task

Protected endpoints require Authorization: Bearer <token>.

## Environment variables (example)
Set these in backend/.env (names may vary):
- DATABASE_URL or DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
- JWT_SECRET
- PORT (optional, default 8080)

## Testing & Development Tips
- Backend tests: `go test ./...`
- Frontend tests: `npm test` (or project-specific command)
- Use golangci-lint for Go and ESLint/Prettier for frontend
- Run DB in Docker Compose for a reproducible dev environment

## Contribution
- Open issues for bugs and features.
- Use feature branches and open PRs with a description and tests when applicable.
