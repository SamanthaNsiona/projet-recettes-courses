import { useState, useEffect } from 'react';
import { shoppingListService } from '../services/shoppingListService';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function AddToListModal({ recipe, onClose }) {
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      const data = await shoppingListService.getAll();
      setLists(data);
      if (data.length > 0) {
        setSelectedListId(data[0].id);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des listes', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!selectedListId) return;

    try {
      await shoppingListService.addRecipeToList(parseInt(selectedListId), recipe.id);
      setMessage(`✅ ${recipe.title} ajoutée à la liste !`);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setMessage('❌ Erreur lors de l\'ajout');
      console.error(error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Ajouter à une liste</h3>
          <button onClick={onClose} className="modal-close">
            <XMarkIcon style={{ width: '1.5rem', height: '1.5rem' }} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#737373' }}>
            Ajouter les ingrédients de <strong>{recipe.title}</strong> à une liste de courses
          </p>

          {loading ? (
            <div className="loading-text">Chargement...</div>
          ) : lists.length === 0 ? (
            <p className="message-empty">Aucune liste. Créez-en une d'abord !</p>
          ) : (
            <>
              <select
                value={selectedListId}
                onChange={(e) => setSelectedListId(e.target.value)}
                className="form-input"
                style={{ marginBottom: '1rem' }}
              >
                {lists.map(list => (
                  <option key={list.id} value={list.id}>
                    {list.title}
                  </option>
                ))}
              </select>

              {message && (
                <div style={{ 
                  padding: '0.75rem', 
                  marginBottom: '1rem',
                  backgroundColor: message.includes('✅') ? '#f0fdf4' : '#fef2f2',
                  color: message.includes('✅') ? '#15803d' : '#dc2626',
                  borderRadius: '4px',
                  fontSize: '0.875rem'
                }}>
                  {message}
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">
            Annuler
          </button>
          {lists.length > 0 && (
            <button onClick={handleAdd} className="btn-primary" disabled={!!message}>
              Ajouter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
