import React, { useEffect, useRef, useState } from 'react'
import Message from './Message.jsx'
import { chatCompletion } from '../lib/api.js'

const SAFETY_PATTERNS = [
  /suicide|kill myself|want to die|end my life/i,
  /harm (myself|someone)|hurt (myself|someone)/i,
  /no reason to live|can't go on|cant go on/i,
  /voices telling me/i
]

function safetyCheck(text){
  return SAFETY_PATTERNS.some(rx => rx.test(text))
}

function crisisResponse(){
  return `I’m really sorry you’re going through this. You deserve support.
Are you in immediate danger right now?

If you are, please contact local emergency services. You can also reach your country’s crisis line. 
If you’d like, I can help you find options. Would you like a short grounding exercise or to talk more?`
}

export default function Chat({ context }){
  const { prefs, onMood } = context
  const [messages, setMessages] = useState([
    { role:'system', text: 'You are CalmMate, a supportive, non-clinical companion.'},
    { role:'ai', text: `Hi, I’m CalmMate — here for gentle support. I’m not a clinician. 
Would you like to do a quick check‑in?` }
  ])
  const inputRef = useRef(null)
  const logRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const add = (role, text) => setMessages(m => [...m, { role, text }])

  useEffect(() => {
    const onTool = (e) => {
      const t = e.detail.tool
      if (t === 'checkin') checkin()
      if (t === 'breathing') breathing()
      if (t === 'grounding') grounding()
      if (t === 'journal') journal()
      if (t === 'sleep') sleep()
    }
    document.addEventListener('tool', onTool)
    return () => document.removeEventListener('tool', onTool)
  }, [])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages])

  const checkin = () => add('ai', `How are you feeling today? (Okay / Meh / Anxious / Low / Calm)`)
  const breathing = () => add('ai', `Box Breathing (4×): In 4 • Hold 4 • Out 4 • Hold 4. Type "start" to pace.`)
  const grounding = () => add('ai', `5‑Senses Grounding:
• 5 things you can see
• 4 you can touch
• 3 you can hear
• 2 you can smell
• 1 you can taste
Type "guide" to go step by step.`)
  const journal = () => add('ai', `Let's journal: What’s on your mind right now? I’ll reflect it back and we’ll pick one tiny next step.`)
  const sleep = () => add('ai', `Sleep wind‑down: dim lights, slow breathing, and a 2‑minute “worry dump”. Type "start breathing" for pacing or "gratitude" to note one thing you’re grateful for.`)

  const sendToLLM = async (userText) => {
    setLoading(true); setError(null)
    try{
      const history = messages.filter(m => m.role !== 'system').map(m => ({
        role: m.role === 'ai' ? 'assistant' : m.role,
        content: m.text
      }))
      const reply = await chatCompletion([...history, { role:'user', content: userText }])
      add('ai', reply)
    }catch(e){
      setError(e.message || 'Something went wrong')
    }finally{
      setLoading(false)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const text = inputRef.current.value.trim()
    if (!text) return
    add('user', text)
    inputRef.current.value = ''

    // client-side safety precheck
    if (safetyCheck(text)){
      add('ai', crisisResponse())
      return
    }
    // mood quick map
    if (['okay','meh','anxious','low','calm','🙂','😕','😣','😔','😌'].includes(text.toLowerCase())){
      const normalized = ({'🙂':'okay','😕':'meh','😣':'anxious','😔':'low','😌':'calm'}[text.toLowerCase()]) || text.toLowerCase()
      onMood(normalized)
    }
    // call backend (server does its own safety check too)
    sendToLLM(text)
  }

  return (
    <div className="chat card">
      <div ref={logRef} className="chat-log">
        {messages.filter(m=>m.role!=='system').map((m,i)=>(
          <Message key={i} role={m.role}>
            {m.text.split('\n').map((line, idx) => <span key={idx}>{line}<br/></span>)}
          </Message>
        ))}
      </div>
      <form className="chat-form" onSubmit={onSubmit}>
        <input ref={inputRef} className="chat-input" placeholder="Type a message…" autoComplete="off" />
        <button className="send-btn" aria-label="Send" disabled={loading}>➤</button>
        {loading && <span className="status">thinking…</span>}
        {error && <span className="status">error: {error}</span>}
      </form>
    </div>
  )
}
