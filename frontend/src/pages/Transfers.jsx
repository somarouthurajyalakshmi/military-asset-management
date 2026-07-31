import { useState, useEffect } from 'react';
import API from '../services/api';

export default function Transfers({ user }) {
  const [transfers, setTransfers] = useState([]);
  const [bases, setBases] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [form, setForm] = useState({ fromBase: '', toBase: '', equipment: '', quantity: '', notes: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    API.get('/transfers').then(res => setTransfers(res.data)).catch(console.error);
    API.get('/bases').then(res => setBases(res.data)).catch(console.error);
    API.get('/equipment').then(res => setEquipment(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/transfers', {
        ...form,
        quantity: Number(form.quantity)
      });
      setTransfers([data, ...transfers]);
      setShowForm(false);
      setForm({ fromBase: '', toBase: '', equipment: '', quantity: '', notes: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create transfer');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2>Transfers</h2>
        {(user.role === 'admin' || user.role === 'logistics_officer' || user.role === 'base_commander') && (
          <button className="btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Transfer'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>From Base</label>
              <select value={form.fromBase} onChange={e => setForm({...form, fromBase: e.target.value})} required>
                <option value="">Select From Base</option>
                {bases.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>To Base</label>
              <select value={form.toBase} onChange={e => setForm({...form, toBase: e.target.value})} required>
                <option value="">Select To Base</option>
                {bases.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Equipment</label>
              <select value={form.equipment} onChange={e => setForm({...form, equipment: e.target.value})} required>
                <option value="">Select Equipment</option>
                {equipment.map(eq => <option key={eq._id} value={eq._id}>{eq.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input type="number" min="1" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
            </div>
            <button className="btn" type="submit">Save Transfer</button>
          </form>
        </div>
      )}

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>From</th>
              <th>To</th>
              <th>Equipment</th>
              <th>Qty</th>
              <th>By</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map(t => (
              <tr key={t._id}>
                <td>{new Date(t.transferDate).toLocaleDateString()}</td>
                <td>{t.fromBase?.name}</td>
                <td>{t.toBase?.name}</td>
                <td>{t.equipment?.name}</td>
                <td>{t.quantity}</td>
                <td>{t.recordedBy?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
