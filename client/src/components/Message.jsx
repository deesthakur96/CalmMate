import React from 'react'

export default function Message({ role, children }){
  return (
    <div className={`msg ${role}`}>
      <div className="avatar">{role === 'ai' ? '🫶' : '🙂'}</div>
      <div className="bubble">{children}</div>
    </div>
  )
}
