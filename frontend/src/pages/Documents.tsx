import React, { useEffect, useState } from 'react'
import api from '../api'
import AddDocument from './AddDocument'

export default function Documents({ token }: { token: string }) {
  const [docs, setDocs] = useState<any[]>([])
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => { load() }, [])
  async function load() {
    const resp = await api.get('/documents')
    setDocs(resp.data)
  }

  const shown = docs.filter(d => {
    const matchesText = !filter || d.status?.toLowerCase().includes(filter.toLowerCase()) || d.title?.toLowerCase().includes(filter.toLowerCase())
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter
    return matchesText && matchesStatus
  })

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Документи</h1>
          <div className="muted">Управління відсканованими документами</div>
        </div>
        <div>
          <button className="btn primary" onClick={()=>setShowAdd(true)}>+ Додати документ</button>
        </div>
      </div>

      <div className="card card-table">
        <div className="filters" style={{alignItems:'center'}}>
          <input className="search" placeholder="Пошук за номером справи або типом..." value={filter} onChange={e=>setFilter(e.target.value)} />
          <div className="filters-right">
            <select className="status-select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
              <option value="all">Всі статуси</option>
              <option value="IN_WORK">В роботі</option>
              <option value="DONE_D3">Вже в Д-3</option>
              <option value="ERROR">Помилка</option>
            </select>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr><th>Назва документа</th><th>Тип</th><th>Дата</th><th>Сторінок</th><th>Статус</th></tr>
          </thead>
          <tbody>
            {shown.map(d => (
              <tr key={d.id}>
                <td style={{fontWeight:700}}>{d.title}</td>
                <td>{d.type}</td>
                <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                <td>{d.pages}</td>
                <td>
                  <select defaultValue={d.status} onChange={async (e)=>{
                    const newStatus = e.target.value
                    try{ await api.put(`/documents/${d.id}/status`, { status: newStatus }); load() }catch(err){ console.error(err) }
                  }}>
                    <option value="IN_WORK">В роботі</option>
                    <option value="DONE_D3">Вже в Д-3</option>
                    <option value="ERROR">Помилка</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-content">
            <button className="modal-close" onClick={()=>setShowAdd(false)}>✕</button>
            <AddDocument token={token} onCreated={()=>{ setShowAdd(false); load() }} onClose={()=>setShowAdd(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
