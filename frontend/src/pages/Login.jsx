import { useState } from 'react';
import API from '../services/api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/auth/login', { email, password });
      onLogin(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a, #1e293b, #0f3460)',
      fontFamily: 'Segoe UI, system-ui, sans-serif'
    }}>
      <div style={{
        background: '#ffffff',
        padding: '42px 38px',
        borderRadius: '18px',
        width: '100%',
        maxWidth: '390px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.35)'
      }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '23px',
            fontWeight: '700',
            color: '#0f172a',
            margin: '0 0 8px 0',
            lineHeight: '1.3'
          }}>
            Military Asset System
          </h1>
          <p style={{
            color: '#64748b',
            fontSize: '14px',
            margin: 0
          }}>
            Secure Login
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fef2f2',
            color: '#dc2626',
            padding: '11px 14px',
            borderRadius: '8px',
            fontSize: '13.5px',
            marginBottom: '18px',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#334155',
              marginBottom: '6px'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter email"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#334155',
              marginBottom: '6px'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              background: loading ? '#94a3b8' : '#0f3460',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Demo credentials */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid #f1f5f9',
          fontSize: '12.5px',
          color: '#64748b',
          lineHeight: '1.6'
        }}>
          <p style={{ fontWeight: '600', marginBottom: '6px', color: '#475569' }}>
            Demo Credentials
          </p>
          <p style={{ margin: '3px 0' }}>Admin: admin@military.gov / admin123</p>
          <p style={{ margin: '3px 0' }}>Commander: commander.nc@military.gov / commander123</p>
          <p style={{ margin: '3px 0' }}>Logistics: logistics@military.gov / logistics123</p>
        </div>
      </div>
    </div>
  );
}