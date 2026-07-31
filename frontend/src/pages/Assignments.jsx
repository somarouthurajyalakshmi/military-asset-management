import { useState, useEffect } from 'react';
import API from '../services/api';

export default function Assignments({ user }) {
  const [assignments, setAssignments] = useState([]);
  const [bases, setBases] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [form, setForm] = useState({ base: '', equipment: '', quantity: '', assignedTo: '', notes: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    API.get('/assignments').then(res => setAssignments(res.data)).catch(console.error);
    API.get('/bases').then(res => setBases(res.data)).catch(console.error);
    API.get('/equipment').then(res => setEquipment(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/assignments', {
        ...form,
        quantity: Number(form.quantity)
      });
      setAssignments([data, ...assignments]);
      setShowForm(false);
      setForm({ base: '', equipment: '', quantity: '', assignedTo: '', notes: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create assignment');
    }
  };

  const handleExpend = async (id) => {
    try {
      await API.put(`/assignments/${id}/expend`, { quantity: 1 });
      // refresh
      const res = await API.get('/assignments');
      setAssignments(res.data);
    } catch (err) {
      alert('Failed to mark expended');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2>Assignments & Expenditures</h2>
        {(user.role === 'admin' || user.role === 'base_commander') && (
          <button className="btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Assignment'}
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
              <label>Assigned To (Personnel)</label>
              <input value={form.assignedTo} onChange={e => setForm({...form, assignedTo: e.target.value})} required placeholder="e.g. Capt. Sharma" />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
            </div>
            <button className="btn" type="submit">Save Assignment</button>
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
              <th>Assigned To</th>
              <th>Status</th>
              <th>Expended</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(a => (
              <tr key={a._id}>
                <td>{new Date(a.assignmentDate).toLocaleDateString()}</td>
                <td>{a.base?.name}</td>
                <td>{a.equipment?.name}</td>
                <td>{a.quantity}</td>
                <td>{a.assignedTo}</td>
                <td>{a.status}</td>
                <td>{a.expendedQuantity}</td>
                <td>
                  {a.status !== 'expended' && (user.role === 'admin' || user.role === 'base_commander') && (
                    <button className="btn" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => handleExpend(a._id)}>
                      Mark Expended
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
