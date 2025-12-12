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
    return <div className="text-center py-16 text-xs tracking-[0.2em] uppercase text-neutral-600">Chargement...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="title-main text-2xl mb-16 flex items-center gap-4">
        <ShoppingCartIcon className="h-5 w-5" />
        MES LISTES DE COURSES
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Liste des listes */}
        <div className="border-b border-neutral-200 pb-8">
          <h2 className="text-xs font-light tracking-[0.2em] uppercase mb-8 text-neutral-600">Mes listes</h2>
          
          <form onSubmit={createList} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="Nouvelle liste..."
                className="flex-1 px-0 py-3 border-0 border-b border-neutral-300 bg-transparent focus:border-neutral-900 focus:outline-none text-sm transition-colors"
              />
              <button
                type="submit"
                className="bg-neutral-900 text-white px-6 py-3 hover:bg-neutral-800 transition-colors text-xs tracking-[0.2em] uppercase"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {lists.map((list) => (
              <div
                key={list.id}
                className={`flex justify-between items-center py-3 cursor-pointer border-b transition-colors ${
                  selectedList?.id === list.id
                    ? 'border-neutral-900'
                    : 'border-neutral-200 hover:border-neutral-600'
                }`}
                onClick={() => selectList(list)}
              >
                <span className="font-light text-sm tracking-wide">{list.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteList(list.id);
                  }}
                  className="text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {lists.length === 0 && (
            <p className="text-center text-neutral-400 mt-8 text-xs tracking-wider uppercase">
              Aucune liste. Créez-en une !
            </p>
          )}
        </div>

        {/* Items de la liste sélectionnée */}
        <div className="md:col-span-2 border-b border-neutral-200 pb-8">
          {selectedList ? (
            <>
              <h2 className="text-xs font-light tracking-[0.2em] uppercase mb-8 text-neutral-600">{selectedList.title}</h2>

              <form onSubmit={addItem} className="mb-8">
                <div className="grid grid-cols-12 gap-4">
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Article..."
                    className="col-span-6 px-0 py-3 border-0 border-b border-neutral-300 bg-transparent focus:border-neutral-900 focus:outline-none text-sm transition-colors"
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    placeholder="Qté"
                    className="col-span-2 px-0 py-3 border-0 border-b border-neutral-300 bg-transparent focus:border-neutral-900 focus:outline-none text-sm transition-colors"
                  />
                  <input
                    type="text"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    placeholder="Unité"
                    className="col-span-2 px-0 py-3 border-0 border-b border-neutral-300 bg-transparent focus:border-neutral-900 focus:outline-none text-sm transition-colors"
                  />
                  <button
                    type="submit"
                    className="col-span-2 bg-neutral-900 text-white py-3 hover:bg-neutral-800 transition-colors text-xs tracking-[0.2em] uppercase"
                  >
                    <PlusIcon className="h-4 w-4 mx-auto" />
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-3 border-b border-neutral-200"
                  >
                    <span className="font-light text-sm tracking-wide">{item.name}</span>
                    <div className="flex items-center gap-6">
                      {item.quantity && (
                        <span className="text-neutral-600 text-xs tracking-wider">
                          {item.quantity} {item.unit}
                        </span>
                      )}
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-neutral-600 hover:text-neutral-900 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {items.length === 0 && (
                <p className="text-center text-neutral-400 mt-8 text-xs tracking-wider uppercase">
                  Cette liste est vide. Ajoutez des articles !
                </p>
              )}
            </>
          ) : (
            <div className="text-center text-neutral-400 py-16 text-xs tracking-[0.2em] uppercase">
              Sélectionnez une liste pour voir ses articles
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
