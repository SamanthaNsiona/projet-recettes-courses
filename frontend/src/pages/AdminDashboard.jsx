import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { TrashIcon, UserGroupIcon, BookOpenIcon, ShoppingCartIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');
  
  // Modal de confirmation
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    // Vérifier que l'utilisateur est admin
    if (user?.role !== 'ADMIN') {
      navigate('/recipes');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des données admin...');
      
      const [statsData, usersData, recipesData, listsData] = await Promise.all([
        adminService.getStats(),
        adminService.getAllUsers(),
        adminService.getAllRecipes(),
        adminService.getAllLists()
      ]);
      
      console.log('📊 Stats reçues:', statsData);
      console.log('👥 Utilisateurs reçus:', usersData?.length, 'utilisateurs');
      console.log('📖 Recettes reçues:', recipesData?.length, 'recettes');
      console.log('🛒 Listes reçues:', listsData?.length, 'listes');
      
      setStats(statsData);
      setUsers(usersData);
      setRecipes(recipesData);
      setLists(listsData);
    } catch (error) {
      console.error('❌ Erreur chargement données admin:', error);
      console.error('Détails:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (type, item) => {
    setModalAction(type);
    setModalData(item);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      if (modalAction === 'user') {
        await adminService.deleteUser(modalData.id);
        setUsers(users.filter(u => u.id !== modalData.id));
      } else if (modalAction === 'recipe') {
        await adminService.deleteRecipe(modalData.id);
        setRecipes(recipes.filter(r => r.id !== modalData.id));
      }
      loadData(); // Recharger les stats
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    try {
      const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
      await adminService.updateUserRole(userId, newRole);
      loadData();
    } catch (error) {
      console.error('Erreur changement rôle:', error);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-text">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title-icon">
        <CheckCircleIcon className="page-icon" />
        DASHBOARD ADMINISTRATEUR
      </h1>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistiques
        </button>
        <button 
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Utilisateurs ({users.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          Recettes ({recipes.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'lists' ? 'active' : ''}`}
          onClick={() => setActiveTab('lists')}
        >
          Listes ({lists.length})
        </button>
      </div>

      {/* Statistiques */}
      {activeTab === 'stats' && stats && (
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <UserGroupIcon className="admin-stat-icon" />
            <div className="admin-stat-value">{stats.totalUsers}</div>
            <div className="admin-stat-label">Utilisateurs</div>
          </div>
          <div className="admin-stat-card">
            <BookOpenIcon className="admin-stat-icon" />
            <div className="admin-stat-value">{stats.totalRecipes}</div>
            <div className="admin-stat-label">Recettes</div>
          </div>
          <div className="admin-stat-card">
            <ShoppingCartIcon className="admin-stat-icon" />
            <div className="admin-stat-value">{stats.totalLists}</div>
            <div className="admin-stat-label">Listes de courses</div>
          </div>
          <div className="admin-stat-card">
            <CheckCircleIcon className="admin-stat-icon" />
            <div className="admin-stat-value">{stats.totalPublicRecipes}</div>
            <div className="admin-stat-label">Recettes publiques</div>
          </div>
        </div>
      )}

      {/* Utilisateurs */}
      {activeTab === 'users' && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Recettes</th>
                <th>Listes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`admin-badge ${u.role === 'ADMIN' ? 'admin-badge-red' : 'admin-badge-blue'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u._count?.recipes || 0}</td>
                  <td>{u._count?.lists || 0}</td>
                  <td className="admin-table-actions">
                    {u.id !== user.id && (
                      <>
                        <button 
                          onClick={() => handleRoleToggle(u.id, u.role)}
                          className="btn-secondary btn-sm"
                        >
                          {u.role === 'ADMIN' ? '→ USER' : '→ ADMIN'}
                        </button>
                        <button 
                          onClick={() => confirmDelete('user', u)}
                          className="btn-delete btn-sm"
                        >
                          <TrashIcon className="icon" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recettes */}
      {activeTab === 'recipes' && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Auteur</th>
                <th>Public</th>
                <th>Ingrédients</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.title}</td>
                  <td>{r.user?.name}</td>
                  <td>
                    <span className={`admin-badge ${r.isPublic ? 'admin-badge-green' : 'admin-badge-gray'}`}>
                      {r.isPublic ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td>{r.ingredients?.length || 0}</td>
                  <td className="admin-table-actions">
                    <button 
                      onClick={() => confirmDelete('recipe', r)}
                      className="btn-delete btn-sm"
                    >
                      <TrashIcon className="icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Listes de courses */}
      {activeTab === 'lists' && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Propriétaire</th>
                <th>Articles</th>
              </tr>
            </thead>
            <tbody>
              {lists.map(l => (
                <tr key={l.id}>
                  <td>{l.id}</td>
                  <td>{l.title}</td>
                  <td>{l.user?.name}</td>
                  <td>{l.items?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de confirmation */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Confirmer la suppression`}
        variant="danger"
        onConfirm={handleDelete}
        confirmText="Supprimer"
        cancelText="Annuler"
      >
        <p>
          Êtes-vous sûr de vouloir supprimer{' '}
          <strong>
            {modalAction === 'user' ? modalData?.name : modalData?.title}
          </strong> ?
        </p>
        <p className="text-sm" style={{ marginTop: '1rem', color: '#dc2626' }}>
          Cette action est irréversible.
        </p>
      </Modal>
    </div>
  );
}
