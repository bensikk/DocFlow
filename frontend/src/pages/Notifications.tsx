import React from 'react'

export default function Notifications(){
  const items = [
    { id:1, text: 'Тонер в принтері ABC — 10%', when: '2025-10-19' },
    { id:2, text: 'Новий документ: 634/563/25 ухвала 4стр', when: '2025-10-19' }
  ]
  return (
    <div>
      <h2>Сповіщення</h2>
      {items.map(it => (
        <div key={it.id} className="notif">
          <div style={{ flex:1 }}>{it.text}</div>
          <div className="meta">{it.when}</div>
        </div>
      ))}
    </div>
  )
}
