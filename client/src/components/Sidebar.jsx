import React, { useState } from 'react'

export default function Sidebar({ context }){
  const { prefs, updatePrefs } = context
  const [time, setTime] = useState(prefs.checkin_time || '')
  const [tone, setTone] = useState(prefs.tone || 'warm')

  const save = () => {
    updatePrefs({ checkin_time: time, tone })
    alert(`Saved. Tone: ${tone}${time ? `, check-in: ${time}` : ''}`)
  }

  const emit = (tool) => {
    document.dispatchEvent(new CustomEvent('tool', { detail: { tool } }))
  }

  return (
    <div className="card">
      <h3>Quick Actions</h3>
      <button className="btn" onClick={() => emit('checkin')}>Daily Check‑in</button>
      <button className="btn" onClick={() => emit('breathing')}>Box Breathing</button>
      <button className="btn" onClick={() => emit('grounding')}>5‑Senses Grounding</button>
      <button className="btn" onClick={() => emit('journal')}>Journal Prompt</button>
      <button className="btn" onClick={() => emit('sleep')}>Sleep Wind‑down</button>

      <h3 style={{marginTop:12}}>Preferences</h3>
      <label className="row">
        <span>Check‑in time</span>
        <input type="time" value={time} onChange={e=>setTime(e.target.value)} />
      </label>
      <label className="row">
        <span>Tone</span>
        <select value={tone} onChange={e=>setTone(e.target.value)}>
          <option value="warm">Warm</option>
          <option value="coach">Coachy</option>
          <option value="concise">Concise</option>
        </select>
      </label>
      <button className="btn secondary" onClick={save}>Save</button>
    </div>
  )
}
