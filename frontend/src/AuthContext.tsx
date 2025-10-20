import React, { createContext, useState } from 'react'
import { setAuthToken } from './api'

export const AuthContext = createContext({ token: '' , setToken: (t: string | null)=>{}, role: '', user: null as any })

export function AuthProvider({ children }: { children: React.ReactNode }){
  const [token, setTokenState] = useState<string | null>(localStorage.getItem('token'))
  const [role, setRole] = useState('')
  const [user, setUser] = useState<any>(null)

  async function loadMe(tok?: string){
    try{
      setAuthToken(tok ?? token ?? undefined)
      const resp = await fetch('http://localhost:3000/auth/me', { headers: { Authorization: `Bearer ${tok ?? token}` } })
      if (resp.ok){ const data = await resp.json(); setRole(data.role); setUser(data) }
      else { setRole(''); setUser(null) }
    }catch(e){ setRole(''); setUser(null) }
  }

  function setToken(t: string | null){
    setTokenState(t)
    if (t) { localStorage.setItem('token', t); setAuthToken(t); loadMe(t) }
    else { localStorage.removeItem('token'); setAuthToken(undefined); setRole(''); setUser(null) }
  }

  // on mount / token change try to load user info
  React.useEffect(()=>{ if (token) loadMe() }, [token])
  return <AuthContext.Provider value={{ token: token ?? '', setToken: setToken as any, role, user }}>{children}</AuthContext.Provider>
}
