import React, { createContext, useState } from 'react'
import { setAuthToken } from './api'

export const AuthContext = createContext({ token: '' , setToken: (t: string)=>{}, role: '' })

export function AuthProvider({ children }: { children: React.ReactNode }){
  const [token, setTokenState] = useState<string | null>(localStorage.getItem('token'))
  const [role, setRole] = useState('')
  async function loadMe(tok?: string){
    try{
      setAuthToken(tok ?? token ?? undefined)
      const resp = await fetch('http://localhost:3000/auth/me', { headers: { Authorization: `Bearer ${tok ?? token}` } })
      if (resp.ok){ const data = await resp.json(); setRole(data.role) }
    }catch(e){ setRole('') }
  }
  function setToken(t: string | null){
    setTokenState(t)
    if (t) { localStorage.setItem('token', t); setAuthToken(t); loadMe(t) }
    else { localStorage.removeItem('token'); setAuthToken(undefined); setRole('') }
  }
  // on mount try to load role
  React.useEffect(()=>{ if (token) loadMe() }, [])
  return <AuthContext.Provider value={{ token: token ?? '', setToken: setToken as any, role }}>{children}</AuthContext.Provider>
}
