import React, { useState } from 'react'
import axios from 'axios'

export default function AddDocument({ token, onCreated }: { token: string, onCreated: () => void }){
  const [caseNumber, setCaseNumber] = useState('')
  const [type, setType] = useState('Ухвала')
  const [customType, setCustomType] = useState('')
  const [pages, setPages] = useState(1)
  const [processNumber, setProcessNumber] = useState('')
  const [file, setFile] = useState<File | null>(null)

  async function submit(e: React.FormEvent){
    e.preventDefault()
    const realType = customType || type
    const resp = await axios.post('http://localhost:3000/documents', { caseNumber, type: realType, pages, processNumber }, { headers: { Authorization: `Bearer ${token}` } })
    const doc = resp.data
    if (file){
      const fd = new FormData(); fd.append('file', file)
      await axios.post(`http://localhost:3000/documents/${doc.id}/upload`, fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } })
    }
    onCreated()
  }

  return (
    <form onSubmit={submit} className="card">
      <h3>Добавить документ</h3>
      <label>Номер дела</label>
      <input value={caseNumber} onChange={e=>setCaseNumber(e.target.value)} />
      <label>Тип</label>
      <select value={type} onChange={e=>setType(e.target.value)}>
        <option>Ухвала</option>
        <option>Клопотання</option>
        <option>Повідомлення</option>
        <option>Лист</option>
        <option>Справа</option>
        <option>Протокол</option>
      </select>
  <label>Или введите свой тип</label>
  <input value={customType} onChange={e=>setCustomType(e.target.value)} />
      {type === 'Справа' && (
        <>
          <label>Номер провадження</label>
          <input value={processNumber} onChange={e=>setProcessNumber(e.target.value)} />
        </>
      )}
      <label>Кількість сторінок</label>
      <input type="number" value={pages} onChange={e=>setPages(Number(e.target.value))} />
      <label>Файл (скан)</label>
      <input type="file" onChange={e=>setFile(e.target.files?e.target.files[0]:null)} />
      <button type="submit">Добавить</button>
    </form>
  )
}
