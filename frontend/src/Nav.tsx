import React, { useContext } from 'react'
import { AuthContext } from './AuthContext'

export default function Nav({ onSelect, active }: { onSelect: (s: string) => void, active?: string }){
  const { role, token, setToken } = useContext(AuthContext) as any
  const btn = (key:string, label:string) => (
    <button className={active === key ? 'active' : ''} onClick={()=>onSelect(key)}>{label}</button>
  )
  return (
    <div className="sidebar">
      <div className="brand">Судова Система</div>
      {btn('dashboard','Панель')}
      {btn('documents','Документи')}
      {btn('notifications','Сповіщення')}
      {btn('devices','Техніка')}
      {btn('profile','Профіль')}
      {btn('settings','Налаштування')}
      <div style={{ marginTop:'auto' }}>
        <div className="muted">Роль: {role || 'Guest'}</div>
        <button onClick={()=>{ setToken(null); }}>Вийти</button>
      </div>
    </div>
  )
}
