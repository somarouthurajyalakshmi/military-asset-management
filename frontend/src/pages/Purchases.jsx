import { useState, useEffect } from 'react';
import API from '../services/api';

export default function Purchases({ user }) {
  const [purchases, setPurchases] = useState([]);
  const [bases, setBases] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [form, setForm] = useState({ base: '', equipment: '', quantity: '', notes: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    API.get('/purchases').then(res => setPurchases(res.data)).catch(console.error);
    API.get('/bases').then(res => setBases(res.data)).catch(console.error);
    API.get('/equipment').then(res => setEquipment(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/purchases', {
        ...form,
        quantity: Number(form.quantity)
      });
      setPurchases([data, ...purchases]);
      setShowForm(false);
      setForm({ base: '', equipment: '', quantity: '', notes: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create purchase');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>Purchases</h2>
        {(user?.role === 'admin' || user?.role === 'logistics_officer' || user?.role === 'base_commander') && (
          <button className="btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Record Purchase'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Base</label>
              <select value={form.base} onChange={e => setForm({...form, base: e.target.value})} required>
                <option value="">Select Base</option>
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
            <button className="btn" type="submit">Save Purchase</button>
          </form>
        </div>
      )}

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Base</th>
              <th>Equipment</th>
              <th>Qty</th>
              <th>Recorded By</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map(p => (
              <tr key={p._id}>
                <td>{new Date(p.purchaseDate).toLocaleDateString()}</td>
                <td>{p.base?.name || '-'}</td>
                <td>{p.equipment?.name || '-'}</td>
                <td>{p.quantity}</td>
                <td>{p.recordedBy?.name || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}