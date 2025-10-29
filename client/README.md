# CalmMate (Client)

React + Vite front-end for the CalmMate AI companion.

## Run
```bash
npm install
npm run dev
```
Then open http://localhost:5173

## Configure backend
The client expects a server running at http://localhost:8787 (default) with a POST /api/chat endpoint.
You can change the URL in `src/lib/api.js` if needed.
