import React from 'react'

export default function Dashboard(){
  return (
    <div className="center">
      <div className="topbar">
        <div>
          <h2>Панель керування</h2>
          <div className="muted">Огляд системи, останні дії та статистика.</div>
        </div>
      </div>

      <div className="grid-4" style={{marginTop:18}}>
        <div className="card stat-card">
          <div className="muted">Всього техніки</div>
          <h3>0</h3>
        </div>
        <div className="card stat-card">
          <div className="muted">Потребує уваги</div>
          <h3>0</h3>
        </div>
        <div className="card stat-card">
          <div className="muted">Документів</div>
          <h3>1</h3>
        </div>
        <div className="card stat-card">
          <div className="muted">Оброблено сьогодні</div>
          <h3>0</h3>
        </div>
      </div>

      <div className="grid-main" style={{marginTop:18}}>
        <div className="card large-panel">
          <h3>Стан техніки</h3>
          <div className="muted" style={{paddingTop:12}}>Немає техніки, яка потребує уваги</div>
        </div>
        <div className="card large-panel">
          <h3>Останні документи</h3>
          <ul className="doc-list" style={{marginTop:12}}>
            <li>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <strong>634/456/56 ухвала 56стр</strong>
                  <div className="muted">18.10.2025</div>
                </div>
                <div className="chip done">Вже в Д-3</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
