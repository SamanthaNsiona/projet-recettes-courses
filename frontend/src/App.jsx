import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Recipes from './pages/Recipes';
import MyRecipes from './pages/MyRecipes';
import ShoppingLists from './pages/ShoppingLists';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import LegalNotice from './pages/LegalNotice';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiesPolicy from './pages/CookiesPolicy';
import TermsOfService from './pages/TermsOfService';
import FAQ from './pages/FAQ';

function AppContent() {
  const location = useLocation();
  const hideFooter = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);

  return (
    <div className="app-container">
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/recipes"
                element={
                  <ProtectedRoute>
                    <Recipes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-recipes"
                element={
                  <ProtectedRoute>
                    <MyRecipes />
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
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contact"
                element={
                  <ProtectedRoute>
                    <Contact />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/legal" element={<LegalNotice />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/cookies" element={<CookiesPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/faq" element={<FAQ />} />
            </Routes>
          </main>
          {!hideFooter && <Footer />}
          <CookieConsent />
        </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
