import React, { useContext, useState } from 'react'
import Login from './pages/Login'
import Documents from './pages/Documents'
import Devices from './pages/Devices'
import Nav from './Nav'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import { AuthProvider, AuthContext } from './AuthContext'

function AppInner(){
  const [view, setView] = useState('dashboard')
  const { token } = useContext(AuthContext)
  const [guestView, setGuestView] = useState<'login'|'register'>('login')
  if (!token) return (
    <div className="main">
      <div className="login-card card">
        {guestView === 'login' ? <Login onLogin={()=>{}} onSwitch={(v)=>setGuestView(v)} /> : <Register onSwitch={()=>setGuestView('login')} />}
      </div>
    </div>
  )
  return (
    <div className="app">
      <Nav onSelect={setView} active={view} />
      <div className="main">
        <div className="topbar">
          <h3>Ласкаво просимо до Судової Системи</h3>
        </div>
  {view === 'dashboard' && <Dashboard />}
  {view === 'documents' && <Documents token={token} />}
  {view === 'notifications' && <Notifications />}
  {view === 'devices' && <Devices />}
  {view === 'profile' && <Profile />}
  {view === 'settings' && <Settings />}
      </div>
    </div>
  )
}

export default function App(){
  return <AuthProvider><AppInner /></AuthProvider>
}
