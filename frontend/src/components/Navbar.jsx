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
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/recipes" className="text-xl font-bold">
              RecettesCourses
            </Link>
            
            <div className="flex gap-4">
              <Link
                to="/recipes"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <BookOpenIcon className="h-5 w-5" />
                Recettes
              </Link>
              <Link
                to="/shopping-lists"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                Courses
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm">Bonjour, {user.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
