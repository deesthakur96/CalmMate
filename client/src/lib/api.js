export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787'

export async function chatCompletion(messages){
  const res = await fetch(`${API_BASE}/api/chat`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ messages })
  })
  if(!res.ok){
    const t = await res.text()
    throw new Error(t || 'Request failed')
  }
  const data = await res.json()
  return data.reply
}
