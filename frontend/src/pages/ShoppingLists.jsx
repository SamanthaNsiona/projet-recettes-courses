import { useState, useEffect } from 'react';
import { shoppingListService } from '../services/shoppingListService';
import { useAuth } from '../contexts/AuthContext';
import { PlusIcon, TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function ShoppingLists() {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newListTitle, setNewListTitle] = useState('');
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '' });
  const { user } = useAuth();

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      const data = await shoppingListService.getAll();
      setLists(data);
    } catch (error) {
      console.error('Erreur lors du chargement des listes', error);
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async (listId) => {
    try {
      const data = await shoppingListService.getItems(listId);
      setItems(data);
    } catch (error) {
      console.error('Erreur lors du chargement des items', error);
    }
  };

  const createList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    try {
      await shoppingListService.create({
        title: newListTitle,
        userId: user.id,
      });
      setNewListTitle('');
      loadLists();
    } catch (error) {
      console.error('Erreur lors de la création de la liste', error);
    }
  };

  const deleteList = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette liste?')) {
      try {
        await shoppingListService.delete(id);
        if (selectedList?.id === id) {
          setSelectedList(null);
          setItems([]);
        }
        loadLists();
      } catch (error) {
        console.error('Erreur lors de la suppression', error);
      }
    }
  };

  const selectList = (list) => {
    setSelectedList(list);
    loadItems(list.id);
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim() || !selectedList) return;

    try {
      await shoppingListService.addItem(selectedList.id, {
        name: newItem.name,
        quantity: parseFloat(newItem.quantity) || null,
        unit: newItem.unit || null,
      });
      setNewItem({ name: '', quantity: '', unit: '' });
      loadItems(selectedList.id);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'item', error);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await shoppingListService.deleteItem(itemId);
      loadItems(selectedList.id);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'item', error);
    }
  };

  if (loading) {
    return <div className="loading-text">Chargement...</div>;
  }

  return (
    <div className="page-container">
      <h1 className="page-title-icon">
        <ShoppingCartIcon className="page-icon" />
        MES LISTES DE COURSES
      </h1>

      <div className="grid-shopping">
        {/* Liste des listes */}
        <div className="section-divider">
          <h2 className="form-title">Mes listes</h2>
          
          <form onSubmit={createList} className="mb-8">
            <div className="flex-gap-4">
              <input
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="Nouvelle liste..."
                className="flex-1 form-input"
              />
              <button type="submit" className="btn-add">
                <PlusIcon className="icon" />
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {lists.map((list) => (
              <div
                key={list.id}
                className={`shopping-list-item ${
                  selectedList?.id === list.id ? 'shopping-list-item-selected' : ''
                }`}
                onClick={() => selectList(list)}
              >
                <span className="list-title-text">{list.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteList(list.id);
                  }}
                  className="btn-delete"
                  title="Supprimer cette liste"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {lists.length === 0 && (
            <p className="message-empty">
              Aucune liste. Créez-en une !
            </p>
          )}
        </div>

        {/* Items de la liste sélectionnée */}
        <div className="section-divider">
          {selectedList ? (
            <>
              <h2 className="form-title">{selectedList.title}</h2>

              <form onSubmit={addItem} className="mb-8">
                <div className="grid-form">
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Article..."
                    className="col-span-6 form-input"
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    placeholder="Qté"
                    className="col-span-2 form-input"
                  />
                  <input
                    type="text"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    placeholder="Unité"
                    className="col-span-2 form-input"
                  />
                  <button type="submit" className="col-span-2 btn-add">
                    <PlusIcon className="icon mx-auto" />
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="shopping-item">
                    <span className="shopping-item-name">{item.name}</span>
                    <div className="shopping-item-details">
                      {item.quantity && (
                        <span className="shopping-item-quantity">
                          {item.quantity} {item.unit}
                        </span>
                      )}
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="btn-delete"
                        title="Supprimer cet article"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {items.length === 0 && (
                <p className="message-empty">
                  Cette liste est vide. Ajoutez des articles !
                </p>
              )}
            </>
          ) : (
            <div className="loading-text">
              Sélectionnez une liste pour voir ses articles
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
