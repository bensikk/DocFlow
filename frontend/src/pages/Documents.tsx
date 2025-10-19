import React, { useEffect, useState } from 'react'
import api from '../api'
import AddDocument from './AddDocument'

export default function Documents({ token }: { token: string }) {
  const [docs, setDocs] = useState<any[]>([])
  const [filter, setFilter] = useState('')

  useEffect(() => { load() }, [])
  async function load() {
    const resp = await api.get('/documents')
    setDocs(resp.data)
  }

  const shown = docs.filter(d => !filter || d.status?.toLowerCase().includes(filter.toLowerCase()) || d.title?.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <div className="card">
        <h2>Документи</h2>
        <div className="filters">
          <input placeholder="Фільтр за назвою або статусом" value={filter} onChange={e=>setFilter(e.target.value)} />
          <button onClick={load}>Оновити</button>
        </div>
        <AddDocument token={token} onCreated={load} />
        <table className="table">
          <thead>
            <tr><th>Назва</th><th>Тип</th><th>Сторінки</th><th>Статус</th></tr>
          </thead>
          <tbody>
            {shown.map(d => (
              <tr key={d.id}>
                <td>{d.title}</td>
                <td>{d.type}</td>
                <td>{d.pages}</td>
                <td>{d.status === 'IN_WORK' ? <span className="chip in-work">В роботі</span> : d.status === 'DONE_D3' ? <span className="chip done">Вже в Д-3</span> : <span className="chip error">Помилка</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
