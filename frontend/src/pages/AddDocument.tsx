import React, { useState } from 'react'
import axios from 'axios'

export default function AddDocument({ token, onCreated, onClose }: { token: string, onCreated: () => void, onClose?: ()=>void }){
  const [caseNumber, setCaseNumber] = useState('')
  const [type, setType] = useState('Ухвала')
  const [customType, setCustomType] = useState('')
  const [pagesStr, setPagesStr] = useState('1')
  const [processNumber, setProcessNumber] = useState('')
  const [file, setFile] = useState<File | null>(null)

  async function submit(e: React.FormEvent){
    e.preventDefault()
  const realType = customType || type
  // extract integer from pagesStr (accept '56', '56стр', 'сторінок 56' etc.)
  const pagesParsed = parseInt((pagesStr || '').toString().replace(/[^0-9]/g, ''), 10) || 1
  const resp = await axios.post('http://localhost:3000/documents', { caseNumber, type: realType, pages: pagesParsed, processNumber }, { headers: { Authorization: `Bearer ${token}` } })
    const doc = resp.data
    if (file){
      const fd = new FormData(); fd.append('file', file)
      await axios.post(`http://localhost:3000/documents/${doc.id}/upload`, fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } })
    }
    onCreated()
  }

  return (
    <form onSubmit={submit} className="add-doc-form">
      <h3>Додати документ</h3>
      <div className="muted">Заповніть інформацію про новий документ</div>

      <label>Номер справи</label>
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

      <label>Або введіть свій тип</label>
      <input value={customType} onChange={e=>setCustomType(e.target.value)} />

      {type === 'Справа' && (
        <>
          <label>Номер провадження</label>
          <input value={processNumber} onChange={e=>setProcessNumber(e.target.value)} />
        </>
      )}

  <label>Кількість сторінок</label>
  <input type="text" value={pagesStr} onChange={e=>setPagesStr(e.target.value)} placeholder="56" />

      <label>Файл (скан)</label>
      <input type="file" onChange={e=>setFile(e.target.files?e.target.files[0]:null)} />

      <div style={{display:'flex', gap:10, marginTop:10}}>
        <button type="submit" className="btn primary">Додати</button>
        <button type="button" className="btn" onClick={()=>onClose && onClose()}>Скасувати</button>
      </div>
    </form>
  )
}
