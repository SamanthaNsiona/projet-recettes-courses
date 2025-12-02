import { useState } from 'react';
import { ingredientService } from '../services/ingredientService';
import ModalConfirm from './ModalConfirm';

export default function IngredientList({ recipe, onUpdated }) {
  const [form, setForm] = useState({ name: '', unit: '', quantity: '' });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', unit: '', quantity: '' });
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || form.name.trim() === '') return alert('Nom requis');
    setLoading(true);
    try {
      await ingredientService.create(recipe.id, {
        name: form.name.trim(),
        unit: form.unit || null,
        quantity: form.quantity ? parseFloat(form.quantity) : null,
      });
      setForm({ name: '', unit: '', quantity: '' });
      onUpdated();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ingredientId) => {
    try {
      await ingredientService.delete(recipe.id, ingredientId);
      onUpdated();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression');
    } finally {
      setConfirm({ open: false, id: null });
    }
  };

  const startEdit = (ing) => {
    setEditingId(ing.id);
    setEditForm({ name: ing.name || '', unit: ing.unit || '', quantity: ing.quantity || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', unit: '', quantity: '' });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editForm.name || editForm.name.trim() === '') return alert('Nom requis');
    try {
      await ingredientService.update(recipe.id, editingId, {
        name: editForm.name.trim(),
        unit: editForm.unit || null,
        quantity: editForm.quantity ? parseFloat(editForm.quantity) : null,
      });
      cancelEdit();
      onUpdated();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="font-semibold mb-2">Ingrédients</h4>
      <ul className="space-y-2">
        {(recipe.ingredients || []).map((ing) => (
          <li key={ing.id} className="flex justify-between items-center">
            <div>
              {editingId === ing.id ? (
                <form onSubmit={submitEdit} className="flex gap-2 items-center">
                  <input
                    className="px-2 py-1 border rounded"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                  <input
                    className="px-2 py-1 border rounded w-20"
                    value={editForm.quantity}
                    onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                  />
                  <input
                    className="px-2 py-1 border rounded w-20"
                    value={editForm.unit}
                    onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                  />
                  <button className="text-sm text-green-600">Save</button>
                  <button type="button" onClick={cancelEdit} className="text-sm text-gray-600 ml-2">Cancel</button>
                </form>
              ) : (
                <div>
                  <span className="font-medium">{ing.name}</span>
                  {ing.quantity ? <span className="text-sm text-gray-600"> — {ing.quantity}</span> : null}
                  {ing.unit ? <span className="text-sm text-gray-600"> {ing.unit}</span> : null}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {editingId !== ing.id && (
                <>
                  <button onClick={() => startEdit(ing)} className="text-blue-600 hover:underline text-sm">Modifier</button>
                  <button onClick={() => setConfirm({ open: true, id: ing.id })} className="text-red-600 hover:underline text-sm">Supprimer</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="mt-4 grid grid-cols-3 gap-2">
        <input
          className="col-span-1 px-3 py-2 border rounded"
          placeholder="Nom"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="col-span-1 px-3 py-2 border rounded"
          placeholder="Quantité"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />
        <div className="col-span-1 flex gap-2">
          <input
            className="px-3 py-2 border rounded flex-1"
            placeholder="Unité"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-3 rounded"
          >
            Ajouter
          </button>
        </div>
      </form>

      <ModalConfirm
        open={confirm.open}
        title="Supprimer l'ingrédient"
        message="Voulez-vous vraiment supprimer cet ingrédient ?"
        onCancel={() => setConfirm({ open: false, id: null })}
        onConfirm={() => handleDelete(confirm.id)}
      />
    </div>
  );
}
