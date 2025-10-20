import React, { useContext, useState } from 'react'
import { AuthContext } from './AuthContext'

function Icon({ name }: { name: string }){
  switch(name){
    case 'dashboard':
      return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="13" y="12" width="8" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>)
    case 'documents':
      return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5"/><path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5"/></svg>)
    case 'notifications':
      return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" stroke="currentColor" strokeWidth="1.3"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>)
    case 'devices':
      return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M7 2v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M17 2v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>)
    case 'profile':
      return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.3"/></svg>)
    case 'settings':
      return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" stroke="currentColor" strokeWidth="1.3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2.89 18.9l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.67 0 1.24-.29 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 6.1 2.89l.06.06c.5.5 1.18.66 1.82.33.7-.35 1.5-.57 2.33-.57s1.63.22 2.33.57c.64.33 1.32.17 1.82-.33l.06-.06A2 2 0 1 1 19.4 5.1l-.06.06c-.5.5-.66 1.18-.33 1.82.35.7.57 1.5.57 2.33s-.22 1.63-.57 2.33c-.33.64-.17 1.32.33 1.82z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>)
    default:
      return null
  }
}

export default function Nav({ onSelect, active }: { onSelect: (s: string) => void, active?: string }){
  const { role, token, setToken, user } = useContext(AuthContext) as any
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem('sidebar_collapsed') === '1' } catch(e){ return false }
  })

  function toggleCollapsed(){
    const next = !collapsed
    setCollapsed(next)
    try { localStorage.setItem('sidebar_collapsed', next ? '1' : '0') } catch(e){}
  }

  const items: Array<{ key:string; label:string }> = [
    { key:'dashboard', label:'Панель' },
    { key:'documents', label:'Документи' },
    { key:'notifications', label:'Сповіщення' },
    { key:'devices', label:'Техніка' },
    { key:'profile', label:'Профіль' },
    { key:'settings', label:'Налаштування' }
  ]

  const btn = (key:string, label:string) => (
    <button
      key={key}
      className={`nav-button ${active === key ? 'active' : ''}`}
      onClick={()=>{ onSelect(key); setOpen(false) }}
      aria-current={active === key ? 'page' : undefined}
    >
      <span className="icon"><Icon name={key} /></span>
      <span className="label">{label}</span>
    </button>
  )

  return (
  <div className={`sidebar ${open ? 'open' : ''} ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-top">
        <div className="account-top">
          <div className="avatar">{user && user.email ? user.email.charAt(0).toUpperCase() : 'G'}</div>
          <div className="acct-info">
            <div className="acct-email">{user && user.email ? user.email : 'Guest'}</div>
            <div className="muted">Роль: {role || 'Guest'}</div>
          </div>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* collapse / expand button */}
          <button
            className="collapse-btn"
            onClick={toggleCollapsed}
            aria-pressed={collapsed}
            title={collapsed ? 'Відкрити панель' : 'Сховати панель'}
          >
            {/* chevron arrow: points left when expanded (rotated), points right when collapsed */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>

          

          
        </div>
      </div>

      <nav aria-label="Main navigation">
        {items.map(i => (
          <div key={i.key} title={collapsed ? i.label : undefined}>{btn(i.key, i.label)}</div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={()=>{ setToken(null); }} aria-label="Sign out">Вийти</button>
      </div>
    </div>
  )
}
