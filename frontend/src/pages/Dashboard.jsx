import { useState, useEffect } from 'react';
import API from '../services/api';

export default function Dashboard({ user }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    API.get('/dashboard/metrics')
      .then(res => setMetrics(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (!metrics) return <p>Failed to load metrics. Check if backend is running.</p>;

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Dashboard</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Opening Balance</h3>
          <p>{metrics.openingBalance}</p>
        </div>
        <div className="metric-card">
          <h3>Closing Balance</h3>
          <p>{metrics.closingBalance}</p>
        </div>
        <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => setShowDetails(!showDetails)}>
          <h3>Net Movement (click)</h3>
          <p>{metrics.netMovement}</p>
        </div>
        <div className="metric-card">
          <h3>Purchases</h3>
          <p>{metrics.purchases}</p>
        </div>
        <div className="metric-card">
          <h3>Transfer In</h3>
          <p>{metrics.transferIn}</p>
        </div>
        <div className="metric-card">
          <h3>Transfer Out</h3>
          <p>{metrics.transferOut}</p>
        </div>
        <div className="metric-card">
          <h3>Assigned</h3>
          <p>{metrics.assigned}</p>
        </div>
        <div className="metric-card">
          <h3>Expended</h3>
          <p>{metrics.expended}</p>
        </div>
      </div>

      {showDetails && (
        <div className="card">
          <h3>Net Movement Details</h3>
          <p><strong>Purchases:</strong> {metrics.purchases}</p>
          <p><strong>Transfer In:</strong> {metrics.transferIn}</p>
          <p><strong>Transfer Out:</strong> {metrics.transferOut}</p>
          <p style={{ marginTop: 8 }}>Net = Purchases + Transfer In - Transfer Out</p>
        </div>
      )}

      <div className="card">
        <h3>Welcome, {user.name}</h3>
        <p>Role: <strong>{user.role}</strong></p>
        <p style={{ marginTop: 8, color: '#666' }}>
          Use the navigation to record purchases, transfers and assignments.
          All actions are logged for audit purposes.
        </p>
      </div>
    </div>
  );
}
