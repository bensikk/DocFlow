import React, { useEffect, useState } from 'react'
import api from '../api'

function DeviceForm({ device, onDone, onClose }: { device?: any, onDone: () => void, onClose?: () => void }){
  const [name, setName] = useState('')
  const [inventoryNo, setInventoryNo] = useState('')
  const [location, setLocation] = useState('')
  const [type, setType] = useState('Принтер')

  useEffect(()=>{
    if(device){
      setName(device.name || '')
      setInventoryNo(device.inventoryNo || '')
      setLocation(device.location || '')
      setType(device.type || 'Принтер')
    } else {
      setName('')
      setInventoryNo('')
      setLocation('')
      setType('Принтер')
    }
  }, [device])

  async function submit(e: React.FormEvent){
    e.preventDefault()
    const payload = { name, inventoryNo, type, location }
    if(device && device.id){
      await api.put(`/devices/${device.id}`, payload)
    } else {
      await api.post('/devices', payload)
    }
    onDone()
    onClose && onClose()
  }
  return (
    <form onSubmit={submit} className="add-device-form">
      <h3>{device ? 'Редагувати техніку' : 'Додати техніку'}</h3>
      <label>Назва</label>
      <input value={name} onChange={e=>setName(e.target.value)} />
      <label>Інв. номер</label>
      <input value={inventoryNo} onChange={e=>setInventoryNo(e.target.value)} />
      <label>Кабінет</label>
      <input value={location} onChange={e=>setLocation(e.target.value)} />
      <label>Тип</label>
      <input value={type} onChange={e=>setType(e.target.value)} />
      <div style={{display:'flex', gap:10, marginTop:10}}>
        <button type="submit" className="btn primary">{device ? 'Оновити' : 'Додати'}</button>
        <button type="button" className="btn" onClick={()=>onClose && onClose()}>Скасувати</button>
      </div>
    </form>
  )
}

export default function Devices(){
  const [devices, setDevices] = useState<any[]>([])
  // modalDevice: undefined = closed, null = add, object = edit
  const [modalDevice, setModalDevice] = useState<any | null | undefined>(undefined)
  useEffect(()=>{ load() }, [])
  async function load(){ const resp = await api.get('/devices'); setDevices(resp.data) }

  async function removeDevice(id: string){
    if(!confirm('Видалити цю техніку?')) return
    await api.delete(`/devices/${id}`)
    load()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Техніка</h1>
          <div className="muted">Керування пристроями та їх станом</div>
        </div>
        <div>
          <button className="btn primary" onClick={()=>setModalDevice(null)}>+ Додати техніку</button>
        </div>
      </div>

      <div className="cards-grid">
        {devices.map(d => (
          <div className="device-card card" key={d.id}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
              <div className="device-top">
                <div className="device-avatar">A</div>
                <div>
                  <div style={{fontWeight:700}}>{d.name}</div>
                  <div className="muted">{d.type} • {d.inventoryNo}</div>
                  <div className="muted">{d.location}</div>
                </div>
              </div>
              <div style={{display:'flex', gap:8, alignItems:'center'}}>
                <button className="btn primary" onClick={()=>setModalDevice(d)}>Ред.</button>
                <button className="btn danger" onClick={()=>removeDevice(d.id)}>Видал.</button>
              </div>
            </div>
            <div style={{marginTop:12}}>
              <div className="label">Папір <span style={{float:'right'}}>{d.paperLevel ?? 100}%</span></div>
              <div className="progress"><div className="progress-fill" style={{width:`${d.paperLevel ?? 100}%`}}></div></div>
              <div className="label">Тонер <span style={{float:'right'}}>{d.tonerLevel ?? 100}%</span></div>
              <div className="progress"><div className="progress-fill danger" style={{width:`${d.tonerLevel ?? 100}%`}}></div></div>
            </div>
          </div>
        ))}
      </div>

      {modalDevice !== undefined && (
        <div className="modal" role="dialog">
          <div className="modal-content">
            <button className="modal-close" onClick={()=>setModalDevice(undefined)}>✕</button>
            <DeviceForm device={modalDevice ?? undefined} onDone={load} onClose={()=>setModalDevice(undefined)} />
          </div>
        </div>
      )}
    </div>
  )
}
