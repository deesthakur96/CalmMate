import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()
const PORT = process.env.PORT || 8787
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || '*'

app.use(cors({ origin: ALLOW_ORIGIN, credentials: true }))
app.use(express.json())

const SAFETY_PATTERNS = [
  /suicide|kill myself|want to die|end my life/i,
  /harm (myself|someone)|hurt (myself|someone)/i,
  /no reason to live|can't go on|cant go on/i,
  /voices telling me/i
]

function crisisReply(){
  return `I’m really sorry you’re going through this. You deserve support.
Are you in immediate danger right now?

If you are, please contact local emergency services. You can also reach your country’s crisis line. 
If you’d like, I can help you find options. Would you like a short grounding exercise or to talk more?`
}

const SYSTEM_PROMPT = `You are CalmMate, an AI companion for mental health support.
Goals: listen empathetically, validate feelings, offer brief skills (breathing, grounding, journaling, sleep hygiene), and encourage professional help when appropriate.
Boundaries: You are not a therapist; do not diagnose or give medical instructions. Avoid prescriptive medication, treatment plans, or crisis counseling.
Style: warm, concise, trauma-informed, strengths-based, judgment-free.
Safety: If you detect self-harm, harm to others, or inability to care for self, respond with supportive language and encourage contacting local emergency services or crisis resources. Always offer opt-in short exercises. Do not provide medical advice.`

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body || {}
    if(!Array.isArray(messages)) return res.status(400).send('messages[] is required')

    // Basic server-side safety check
    const last = messages[messages.length - 1]?.content || ''
    if (SAFETY_PATTERNS.some(rx => rx.test(last))) {
      return res.json({ reply: crisisReply() })
    }

    if(!OPENAI_API_KEY){
      // Fallback local heuristic (no external call)
      const t = last.toLowerCase()
      if (t.includes('breath') || t.includes('anx')) {
        return res.json({ reply: "Let’s try box breathing: In 4 • Hold 4 • Out 4 • Hold 4 (×4). Want me to pace it?" })
      }
      if (t.includes('sleep')) {
        return res.json({ reply: "We can do a quick wind‑down: slow breathing + a 2‑minute “worry dump”. Want to start?" })
      }
      return res.json({ reply: "I hear you. That sounds tough. Would a 2‑minute reset or a quick grounding help right now?" })
    }

    // Call OpenAI Chat Completions (compatible prompt format)
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.6
    }

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    })

    if(!r.ok){
      const text = await r.text()
      return res.status(502).send(text)
    }
    const data = await r.json()
    const reply = data.choices?.[0]?.message?.content || "I'm here with you."
    res.json({ reply })
  } catch (e) {
    console.error(e)
    res.status(500).send('Server error')
  }
})

app.get('/', (_, res) => res.send('CalmMate server up'))

app.listen(PORT, () => {
  console.log(`CalmMate server running on http://localhost:${PORT}`)
})
