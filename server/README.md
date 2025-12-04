# ShadowMaster Backend Server

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional, defaults are fine for development):
```bash
PORT=3001
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

3. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

- `GET /health` - Health check
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signout` - Sign out user
- `GET /api/auth/me` - Get current user
- `GET /api/users` - List all users (admin only)
- `PUT /api/users/:id` - Update user (admin only)

## Data Storage

User data is stored in JSON files at `data/users/{userId}.json`

