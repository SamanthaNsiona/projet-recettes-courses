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
  const [messages, setMessages] = useState([]);
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
      
      // Vérifier le token actuel
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('TOKEN ACTUEL:', payload);
        console.log('Token contient role?', 'role' in payload ? 'OUI' : 'NON');
      }
      
      console.log('Chargement des données admin...');
      
      // Charger les données avec Promise.allSettled pour ne pas bloquer si une requête échoue
      const results = await Promise.allSettled([
        adminService.getStats(),
        adminService.getAllUsers(),
        adminService.getAllRecipes(),
        adminService.getAllLists()
      ]);
      
      const statsData = results[0].status === 'fulfilled' ? results[0].value : null;
      const usersData = results[1].status === 'fulfilled' ? results[1].value : [];
      const recipesData = results[2].status === 'fulfilled' ? results[2].value : [];
      const listsData = results[3].status === 'fulfilled' ? results[3].value : [];
      
      // Charger les messages séparément pour ne pas bloquer si ça échoue
      let messagesData = [];
      try {
        messagesData = await adminService.getMessages();
      } catch (error) {
        console.error('Erreur chargement messages:', error);
      }
      
      console.log('Stats reçues:', statsData);
      console.log('Utilisateurs reçus:', usersData?.length, 'utilisateurs');
      console.log('Recettes reçues:', recipesData?.length, 'recettes');
      console.log('Listes reçues:', listsData?.length, 'listes');
      console.log('Messages reçus:', messagesData?.length, 'messages');
      
      // Afficher les erreurs éventuelles
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const names = ['Stats', 'Users', 'Recipes', 'Lists'];
          console.error(`Erreur ${names[index]}:`, result.reason);
        }
      });
      
      setStats(statsData);
      setUsers(usersData);
      setRecipes(recipesData);
      setLists(listsData);
      setMessages(messagesData);
    } catch (error) {
      console.error('ERREUR chargement données admin:', error);
      console.error('Status:', error.response?.status);
      console.error('Message:', error.response?.data?.message || error.message);
      console.error('Réponse complète:', error.response?.data);
      
      // Si erreur 403, c'est probablement un problème de token
      if (error.response?.status === 403) {
        alert('Erreur d\'autorisation. Veuillez vous déconnecter et vous reconnecter pour obtenir un nouveau token.');
      }
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
        <button 
          className={`admin-tab ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          Messagerie ({messages.length})
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
                      <button 
                        onClick={() => confirmDelete('user', u)}
                        className="btn-delete btn-sm"
                      >
                        <TrashIcon className="icon" />
                      </button>
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
                  <td>{r.ingredientsList?.length || 0}</td>
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

      {/* Messagerie */}
      {activeTab === 'messages' && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Utilisateur</th>
                <th>Sujet</th>
                <th>Message</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(m => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{new Date(m.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td>{m.user?.name || m.user?.email}</td>
                  <td>{m.subject || 'Contact'}</td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.message}
                  </td>
                  <td>
                    <span className={`admin-badge ${m.read ? 'admin-badge-gray' : 'admin-badge-blue'}`}>
                      {m.read ? 'Lu' : 'Nouveau'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              Aucun message pour le moment
            </div>
          )}
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
