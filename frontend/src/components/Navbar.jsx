import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div>
        <strong style={{ marginRight: 24 }}>Military Assets</strong>
        <Link to="/">Dashboard</Link>
        <Link to="/purchases">Purchases</Link>
        <Link to="/transfers">Transfers</Link>
        <Link to="/assignments">Assignments</Link>
      </div>
      <div>
        <span style={{ marginRight: 16 }}>{user.name} ({user.role})</span>
        <button className="btn btn-secondary" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}
