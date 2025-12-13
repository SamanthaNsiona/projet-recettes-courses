import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRightOnRectangleIcon, BookOpenIcon, ShoppingCartIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-title">
          <Link to="/recipes" className="navbar-logo">
            MyRecipes
          </Link>
        </div>
        
        <div className="navbar-divider"></div>
        
        <div className="navbar-nav">
          <div className="navbar-links">
            <Link to="/recipes" className="navbar-link">
              <BookOpenIcon className="navbar-icon" />
              Recettes
            </Link>
            <Link to="/my-recipes" className="navbar-link">
              <UserIcon className="navbar-icon" />
              Mes Recettes
            </Link>
            <Link to="/shopping-lists" className="navbar-link">
              <ShoppingCartIcon className="navbar-icon" />
              Courses
            </Link>
            {user.role === 'ADMIN' && (
              <Link to="/admin" className="navbar-link navbar-admin">
                <ShieldCheckIcon className="navbar-icon" />
                Admin
              </Link>
            )}
          </div>

          <div className="navbar-user">
            <span className="navbar-username">Bonjour, {user.name}</span>
            <button onClick={handleLogout} className="navbar-link navbar-logout">
              <ArrowRightOnRectangleIcon className="navbar-icon" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
