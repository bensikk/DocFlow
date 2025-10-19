import React, { useState, useContext } from 'react'
import api from '../api'
import { AuthContext } from '../AuthContext'

export default function Register({ onSwitch }: { onSwitch?: ()=>void }){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setToken } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function submit(e: React.FormEvent){
    e.preventDefault()
    setError(null)
    setLoading(true)
    try{
      const resp = await api.post('/auth/register', { email, password })
      setToken(resp.data.token)
    }catch(err:any){ setError(err?.response?.data?.message || 'Помилка') }
    finally{ setLoading(false) }
  }
  return (
    <div className="login-card card">
      <h2>Реєстрація</h2>
      <p className="muted">Створіть обліковий запис</p>
      <form onSubmit={submit}>
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
        <label>Пароль</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div style={{ color:'var(--danger)', marginBottom:8 }}>{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Зачекайте...' : 'Зареєструватися'}</button>
      </form>
      <div style={{ marginTop:12 }}>
        <span className="muted">Вже маєте акаунт? </span>
        <button type="button" onClick={()=>onSwitch?.()} style={{ marginLeft:8, background:'transparent', color:'var(--accent)', padding:0, border:0, cursor:'pointer' }}>Увійти</button>
      </div>
    </div>
  )
}
