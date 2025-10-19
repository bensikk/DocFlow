# DocFlow backend

Stack: Node.js (Express), TypeScript, Prisma, PostgreSQL

Quick start:

1. Copy `.env.example` to `.env` and adjust values.
2. Start Postgres: `docker-compose up -d`
3. Install deps: `npm install` in `backend/`.
4. Generate prisma client: `npm run prisma:generate`.
5. Run migration: `npm run prisma:migrate`.
6. Seed DB: `npm run seed`.
7. Start dev server: `npm run dev`.

PowerShell (Windows) quick commands:

```powershell
cd "C:\Users\oleks\OneDrive\Рабочий стол\DocFlow"
docker-compose up -d
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

Example API calls:

- Login:
	POST /auth/login { "email": "admin@court.local", "password": "Admin123!" }
- Create document (auth header: Bearer <token>):
	POST /documents { "caseNumber": "634/563/25", "type": "Ухвала", "pages": 4 }

