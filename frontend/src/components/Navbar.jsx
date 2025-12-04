import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRightOnRectangleIcon, BookOpenIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Titre élégant */}
        <div className="text-center mb-16">
          <Link to="/recipes" className="title-elegant text-white text-7xl hover:opacity-80 transition-opacity">
            MyRecipes
          </Link>
        </div>
        
        {/* Ligne de séparation */}
        <div className="w-full h-px bg-white mb-5"></div>
        
        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div className="flex gap-12">
            <Link
              to="/recipes"
              className="nav-link flex items-center gap-3 text-white"
            >
              <BookOpenIcon className="h-4 w-4" />
              Recettes
            </Link>
            <Link
              to="/shopping-lists"
              className="nav-link flex items-center gap-3 text-white"
            >
              <ShoppingCartIcon className="h-4 w-4" />
              Courses
            </Link>
          </div>

          <div className="flex items-center gap-8">
            <span className="text-xs text-white/70 text-body">Bonjour, {user.name}</span>
            <button
              onClick={handleLogout}
              className="nav-link flex items-center gap-3 text-white"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
