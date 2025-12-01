import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Recipes from './pages/Recipes';
import ShoppingLists from './pages/ShoppingLists';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/recipes"
              element={
                <ProtectedRoute>
                  <Recipes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shopping-lists"
              element={
                <ProtectedRoute>
                  <ShoppingLists />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/recipes" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
