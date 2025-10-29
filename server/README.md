# CalmMate (Server)

Node + Express backend with:
- Safety pre-check & crisis response
- Proxy to OpenAI Chat Completions (optional; uses OPENAI_API_KEY)
- Fallback local heuristic if no API key is set

## Run
```bash
npm install
cp .env.example .env
# add your OPENAI_API_KEY to .env (optional)
npm run dev   # or: npm start
```

Defaults:
- PORT=8787
- CORS allow origin: http://localhost:5173 (client dev server)
