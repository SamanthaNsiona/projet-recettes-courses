import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserIcon, EnvelopeIcon, LockClosedIcon, TrashIcon } from '@heroicons/react/24/outline';
import Modal from '../components/Modal';
import { authService } from '../services/authService';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    // À implémenter avec l'API
    setMessage('Profil sauvegardé avec succès !');
    setEditMode(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    console.log('🔐 Changement de mot de passe - Début');
    console.log('Current:', passwordData.currentPassword ? '***' : 'vide');
    console.log('New:', passwordData.newPassword ? '***' : 'vide');
    console.log('Confirm:', passwordData.confirmPassword ? '***' : 'vide');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      console.log('❌ Les mots de passe ne correspondent pas');
      setMessage('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      console.log('🔄 Appel API changePassword...');
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      console.log('✅ Mot de passe changé avec succès');
      setMessage('Mot de passe changé avec succès !');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('❌ Erreur changement mot de passe:', error);
      console.error('Response:', error.response);
      setMessage(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await authService.deleteAccount();
      setMessage('Compte supprimé avec succès');
      setShowDeleteModal(false);
      setTimeout(() => {
        logout();
        navigate('/');
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de la suppression du compte');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title-icon">
        <UserIcon className="page-icon" />
        MON PROFIL
      </h1>

      {message && (
        <div style={{ 
          borderLeft: '2px solid #16a34a', 
          backgroundColor: '#f0fdf4', 
          padding: '1rem 1.5rem', 
          marginBottom: '2rem', 
          fontSize: '0.875rem', 
          color: '#15803d' 
        }}>
          {message}
        </div>
      )}

      <div className="profile-grid">
        {/* Section Informations */}
        <div className="profile-section">
          <h2 className="section-title">
            <UserIcon className="section-icon" />
            Informations Personnelles
          </h2>

          {editMode ? (
            <form onSubmit={handleSaveProfile} className="form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Nom</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Enregistrer
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditMode(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Nom</span>
                <span className="info-value">{user?.name}</span>
              </div>

              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user?.email}</span>
              </div>

              <button
                className="btn-primary"
                onClick={() => setEditMode(true)}
              >
                Modifier
              </button>
            </div>
          )}
        </div>

        {/* Section Sécurité */}
        <div className="profile-section">
          <h2 className="section-title">
            <LockClosedIcon className="section-icon" />
            Sécurité
          </h2>

          <form onSubmit={handleChangePassword} className="form">
            <div className="form-group">
              <label htmlFor="currentPassword" className="form-label">Mot de passe actuel</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">Nouveau mot de passe</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              Changer le mot de passe
            </button>
          </form>
        </div>
      </div>

      {/* Section Supprimer le compte */}
      <div className="profile-section profile-section-danger">
        <h2 className="section-title">
          <TrashIcon className="section-icon" />
          Supprimer mon compte
        </h2>
        <p style={{ 
          color: '#737373', 
          fontSize: '0.875rem', 
          marginBottom: '1.5rem',
          lineHeight: '1.6'
        }}>
          Cette action est irréversible. Toutes tes données seront supprimées.
        </p>
        <button className="btn-danger" onClick={() => setShowDeleteModal(true)}>
          Supprimer mon compte
        </button>
      </div>

      {/* Modal de confirmation */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmer la suppression du compte"
        showFooter={false}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
            Es-tu sûr de vouloir supprimer définitivement ton compte ?
          </p>
          <p style={{ fontWeight: 'bold', color: '#dc2626', marginBottom: '1rem' }}>
            Cette action est irréversible et tu perdras :
          </p>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            color: '#737373', 
            marginBottom: '2rem',
            lineHeight: '1.8'
          }}>
            <li>• Toutes tes recettes</li>
            <li>• Toutes tes listes de courses</li>
            <li>• Tous tes favoris</li>
            <li>• Toutes tes données personnelles</li>
          </ul>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e5e5e5'
          }}>
            <button
              className="btn-danger"
              onClick={handleDeleteAccount}
              style={{ minWidth: '220px' }}
            >
              OUI, SUPPRIMER MON COMPTE
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
