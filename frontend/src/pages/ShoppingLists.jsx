import { useEffect, useState } from 'react';
import { shoppingListService } from '../services/shoppingListService';
import { useAuth } from '../contexts/AuthContext';

export default function ShoppingLists() {
  const { user } = useAuth();
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newListTitle, setNewListTitle] = useState('');
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    unit: '',
  });

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    const data = await shoppingListService.getAll();
    setLists(data);
    setLoading(false);
  };

  const loadItems = async (listId) => {
    const data = await shoppingListService.getItems(listId);
    setItems(data);
  };

  const createList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    await shoppingListService.create({
      title: newListTitle,
      userId: user.id,
    });

    setNewListTitle('');
    loadLists();
  };

  const deleteList = async (id) => {
    if (!window.confirm('Supprimer cette liste ?')) return;

    await shoppingListService.delete(id);

    if (selectedList?.id === id) {
      setSelectedList(null);
      setItems([]);
    }

    loadLists();
  };

  const selectList = (list) => {
    setSelectedList(list);
    loadItems(list.id);
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim() || !selectedList) return;

    await shoppingListService.addItem(selectedList.id, {
      name: newItem.name,
      quantity: newItem.quantity ? Number(newItem.quantity) : null,
      unit: newItem.unit || null,
    });

    setNewItem({ name: '', quantity: '', unit: '' });
    loadItems(selectedList.id);
  };

  const deleteItem = async (itemId) => {
    await shoppingListService.deleteItem(itemId);
    loadItems(selectedList.id);
  };

  if (loading) {
    return (
      <p className="text-center py-16 text-xs tracking-[0.2em] uppercase text-neutral-600">
        Chargement...
      </p>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-16">
        <h1 className="text-2xl tracking-wide uppercase">
          🛒 Mes listes de courses
        </h1>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <aside className="border-b border-neutral-200 pb-8">
          <h2 className="text-xs tracking-[0.2em] uppercase mb-8 text-neutral-600">
            Mes listes
          </h2>

          <form onSubmit={createList} className="mb-8 flex gap-4">
            <input
              type="text"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              placeholder="Nouvelle liste..."
              className="flex-1 px-0 py-3 border-b border-neutral-300 bg-transparent outline-none"
            />
            <button
              type="submit"
              className="bg-neutral-900 text-white px-6 py-3 text-xs uppercase"
            >
              +
            </button>
          </form>

          <div className="space-y-4">
            {lists.map((list) => (
              <div
                key={list.id}
                onClick={() => selectList(list)}
                className={`flex justify-between items-center py-3 cursor-pointer border-b ${
                  selectedList?.id === list.id
                    ? 'border-neutral-900'
                    : 'border-neutral-200 hover:border-neutral-600'
                }`}
              >
                <span className="text-sm">{list.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteList(list.id);
                  }}
                  className="text-neutral-500 hover:text-neutral-900"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>

          {lists.length === 0 && (
            <p className="text-center text-neutral-400 mt-8 text-xs tracking-wider uppercase">
              Aucune liste
            </p>
          )}
        </aside>

        <section className="md:col-span-2 border-b border-neutral-200 pb-8">
          {selectedList ? (
            <>
              <h2 className="text-xs tracking-[0.2em] uppercase mb-8 text-neutral-600">
                {selectedList.title}
              </h2>

              <form onSubmit={addItem} className="mb-8 grid grid-cols-12 gap-4">
                <input
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  placeholder="Article..."
                  className="col-span-6 px-0 py-3 border-b bg-transparent outline-none"
                />
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({ ...newItem, quantity: e.target.value })
                  }
                  placeholder="Qté"
                  className="col-span-2 px-0 py-3 border-b bg-transparent outline-none"
                />
                <input
                  value={newItem.unit}
                  onChange={(e) =>
                    setNewItem({ ...newItem, unit: e.target.value })
                  }
                  placeholder="Unité"
                  className="col-span-2 px-0 py-3 border-b bg-transparent outline-none"
                />
                <button className="col-span-2 bg-neutral-900 text-white uppercase">
                  +
                </button>
              </form>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-3 border-b"
                  >
                    <span className="text-sm">{item.name}</span>
                    <div className="flex gap-6 items-center">
                      {item.quantity && (
                        <span className="text-xs text-neutral-500">
                          {item.quantity} {item.unit}
                        </span>
                      )}
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-neutral-500 hover:text-neutral-900"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {items.length === 0 && (
                <p className="text-center text-neutral-400 mt-8 text-xs uppercase">
                  Cette liste est vide
                </p>
              )}
            </>
          ) : (
            <p className="text-center text-neutral-400 py-16 text-xs tracking-[0.2em] uppercase">
              Sélectionnez une liste
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
