## Prerequisites

- Node.js (v16+)
- npm
- (Optional) MongoDB Atlas or local MongoDB; backend expects `MONGO_URI` set in `.env`.

---

## Quick start — Backend

1. Go to backend folder and install dependencies:

```bash
cd backend
npm install
```

2. Uncomment MONGO_URI in `.env` file :

3. Run in development (nodemon):

```bash
npm run dev
# or run directly
node src/index.js
```

4. Backend API (local default base URL `http://localhost:5001`)

- POST /api/auth/register — Register a user
- POST /api/auth/login — Login; returns JSON { token }
- All product endpoints are protected (Authorization: Bearer <token>):
  - GET /api/products
  - GET /api/products/:id
  - POST /api/products
  - PUT /api/products/:id
  - DELETE /api/products/:id

Example login curl (replace host/port if different):

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"name":"alice","password":"S3cret123"}'
```

To call protected endpoints, use the returned token:

```bash
TOKEN=<paste-token-here>
curl -H "Authorization: Bearer $TOKEN" http://localhost:5001/api/products
```

---

## Quick start — Frontend

1. Go to frontend folder and install dependencies:

```bash
cd frontend
npm install
```

2. Development (Vite): set API URL if backend runs on a non-default port

```bash
npm run dev
```
