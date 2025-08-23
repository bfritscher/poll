
# Poll Application

A real-time polling application built with Vue.js (Quasar) frontend and Node.js (Express + Socket.io) backend.

## Architecture

- **Frontend**: Quasar (Vue.js) SPA served by Nginx
- **Backend**: Node.js Express server with Socket.io for real-time communication
- **Database**: SQLite
- **Deployment**: Docker containers with GitHub Actions CI/CD

## Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

- `JWT_SHARED_SECRET`: Secret key for JWT authentication (required)
- `NODE_ENV`: Environment (production/development)

## Container Images

- `ghcr.io//poll-frontend:latest`
- `ghcr.io/your-username/poll/poll-backend:latest`

## Sources

Avatar icons from http://www.flaticon.com/packs/profession-avatars
