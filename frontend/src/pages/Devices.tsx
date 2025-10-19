import React, { useEffect, useState } from 'react'
import api from '../api'

function DeviceForm({ onDone }: { onDone: () => void }){
  const [name, setName] = useState('')
  const [inventoryNo, setInventoryNo] = useState('')
  const [type, setType] = useState('Принтер')
  async function submit(e: React.FormEvent){
    e.preventDefault()
    await api.post('/devices', { name, inventoryNo, type })
    onDone()
  }
  return (
    <form onSubmit={submit} className="card">
      <h3>Добавить технику</h3>
      <label>Название</label>
      <input value={name} onChange={e=>setName(e.target.value)} />
      <label>Инв.номер</label>
      <input value={inventoryNo} onChange={e=>setInventoryNo(e.target.value)} />
      <label>Тип</label>
      <input value={type} onChange={e=>setType(e.target.value)} />
      <button type="submit">Добавить</button>
    </form>
  )
}

export default function Devices(){
  const [devices, setDevices] = useState<any[]>([])
  useEffect(()=>{ load() }, [])
  async function load(){ const resp = await api.get('/devices'); setDevices(resp.data) }
  return (
    <div className="container">
      <h2>Техника</h2>
      <DeviceForm onDone={load} />
      <ul>
        {devices.map(d=> <li key={d.id}>{d.name} — {d.inventoryNo}</li>)}
      </ul>
    </div>
  )
}
