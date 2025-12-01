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
    return <div className="text-center p-8">Chargement...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <ShoppingCartIcon className="h-8 w-8" />
        Mes Listes de Courses
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Liste des listes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Mes listes</h2>
          
          <form onSubmit={createList} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="Nouvelle liste..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {lists.map((list) => (
              <div
                key={list.id}
                className={`flex justify-between items-center p-3 rounded-lg cursor-pointer ${
                  selectedList?.id === list.id
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => selectList(list)}
              >
                <span className="font-medium">{list.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteList(list.id);
                  }}
                  className="text-red-600 hover:bg-red-50 p-1 rounded"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {lists.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              Aucune liste. Créez-en une !
            </p>
          )}
        </div>

        {/* Items de la liste sélectionnée */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          {selectedList ? (
            <>
              <h2 className="text-xl font-semibold mb-4">{selectedList.title}</h2>

              <form onSubmit={addItem} className="mb-4">
                <div className="grid grid-cols-12 gap-2">
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Article..."
                    className="col-span-6 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    placeholder="Qté"
                    className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    placeholder="Unité"
                    className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    <PlusIcon className="h-5 w-5 mx-auto" />
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium">{item.name}</span>
                    <div className="flex items-center gap-4">
                      {item.quantity && (
                        <span className="text-gray-600">
                          {item.quantity} {item.unit}
                        </span>
                      )}
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {items.length === 0 && (
                <p className="text-center text-gray-500 mt-4">
                  Cette liste est vide. Ajoutez des articles !
                </p>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 py-12">
              Sélectionnez une liste pour voir ses articles
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
