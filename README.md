# CalmMate AI Health Companion

This zip contains:
- `client/` — React + Vite front-end
- `server/` — Node + Express backend with safety pre-check + optional OpenAI proxy

## Quick start (two terminals)
**Server**
```bash
cd server
npm install
cp .env.example .env
# set OPENAI_API_KEY (optional). Without it, server returns a helpful local fallback.
npm run dev
```

**Client**
```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173

### Notes
- This app is a **support tool**, not a clinician. It avoids diagnosis or medical advice and shows a crisis response when high‑risk phrases are detected.
- Replace the model in `server/server.js` if you prefer another provider.
- Configure CORS/ports in `.env` and `vite.config.js` as needed.
