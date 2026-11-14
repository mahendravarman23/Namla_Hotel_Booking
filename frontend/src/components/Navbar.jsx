import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { showToast } from '../features/ui/uiSlice';

const linkClass = ({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`;

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isAdmin = isAuthenticated && user?.role === 'admin';

  const handleLogout = () => {
    dispatch(logout());
    dispatch(showToast('Signed out successfully.'));
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="brand" aria-label="Hotels Home">
          <img src="/hotel.svg" alt="" width="30" height="30" />
          <span>Hotels</span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/hotels" className={linkClass}>
            Hotels
          </NavLink>
          <NavLink to="/showcase" className={linkClass}>
            Hotel Showcase
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              Admin Panel
            </NavLink>
          )}

          <div className="nav-auth-divider" />

          {isAuthenticated ? (
            <div className="nav-user">
              <span className={`nav-role-badge ${isAdmin ? 'nav-role-badge--admin' : 'nav-role-badge--user'}`} title={user.email}>
                {isAdmin ? '👑 Admin' : '👤 User'} {user.name ? `· ${user.name}` : ''}
              </span>
              <button type="button" className="btn btn--outline btn--sm nav-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn--primary btn--sm nav-login-btn">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
