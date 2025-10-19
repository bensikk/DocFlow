import React, { useState, useContext } from 'react'
import api, { setAuthToken } from '../api'
import { AuthContext } from '../AuthContext'

export default function Login({ onLogin, onSwitch }: { onLogin?: (token: string) => void, onSwitch?: (view:'login'|'register')=>void }) {
  const [email, setEmail] = useState('admin@court.local')
  const [password, setPassword] = useState('Admin123!')
  const { setToken } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const resp = await api.post('/auth/login', { email, password })
      const token = resp.data.token
      setAuthToken(token)
      setToken(token)
      onLogin && onLogin(token)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Не вдалося увійти')
    } finally { setLoading(false) }
  }

  return (
    <div className="login-card card">
      <h2>Вхід до DocFlow</h2>
      <p className="muted">Введіть ваші облікові дані</p>
      <form onSubmit={submit}>
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
        <label>Пароль</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <div style={{ color: 'var(--danger)', marginBottom: 8 }}>{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Зачекайте...' : 'Увійти'}</button>
      </form>
      <div style={{ marginTop:12 }}>
        <span className="muted">Немає аккаунта? </span>
        <button type="button" onClick={()=>onSwitch?.('register')} style={{ marginLeft:8, background:'transparent', color:'var(--accent)', padding:0, border:0, cursor:'pointer' }}>Зареєструватися</button>
      </div>
    </div>
  )
}
