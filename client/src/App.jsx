import React, { useState, useMemo } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Chat from './components/Chat.jsx'

export default function App(){
  const [prefs, setPrefs] = useState({ tone: 'warm', checkin_time: '' })
  const [streak, setStreak] = useState(0)
  const [todayMood, setTodayMood] = useState('—')
  const [lastCheckin, setLastCheckin] = useState(null)

  const updatePrefs = (next) => setPrefs(p => ({...p, ...next}))

  const onMood = (mood) => {
    setTodayMood(mood)
    const today = new Date().toDateString()
    if (lastCheckin !== today) {
      setStreak(s => s + 1)
      setLastCheckin(today)
    }
  }

  const context = useMemo(() => ({
    prefs, updatePrefs, streak, todayMood, onMood
  }), [prefs, streak, todayMood])

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="logo">🫶</div>
          <div className="titles">
            <h1>CalmMate</h1>
            <p>Your AI mental health companion</p>
          </div>
        </div>
        <div className="disclaimer">
          Support tool only — not a clinician. If you're in immediate danger, call local emergency services.
        </div>
      </header>

      <main className="main">
        <aside className="sidebar">
          <Sidebar context={context} />
          <div className="card small">
            <h3>Today</h3>
            <div>Mood: <strong>{todayMood}</strong></div>
            <div>Streak: <strong>{streak}</strong> days</div>
          </div>
        </aside>
        <section>
          <Chat context={context} />
        </section>
      </main>

      <footer className="footer">
        © 2025 CalmMate. Local prototype UI.
      </footer>
    </div>
  )
}
