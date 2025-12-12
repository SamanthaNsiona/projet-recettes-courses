import { useState, useEffect } from 'react';
import { recipeService } from '../services/recipeService';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublic: false,
  });

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setError(null);
      const data = await recipeService.getAll();
      setRecipes(data);
    } catch {
      setError('Impossible de charger les recettes');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', isPublic: false });
    setEditingRecipe(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      if (editingRecipe) {
        await recipeService.update(editingRecipe.id, {
          ...formData,
          title: formData.title.trim(),
        });
      } else {
        await recipeService.create({
          ...formData,
          title: formData.title.trim(),
        });
      }
      resetForm();
      loadRecipes();
    } catch {
      setError('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      title: recipe.title,
      description: recipe.description || '',
      isPublic: recipe.isPublic,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette recette ?')) return;

    try {
      await recipeService.delete(id);
      loadRecipes();
    } catch {
      setError('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-xs tracking-[0.2em] uppercase text-neutral-600">Chargement...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mes recettes</h1>
        <button
          onClick={() => resetForm() || setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
          Nouvelle recette
        </button>
      </div>

      {error && (
        <p className="text-center text-red-500 mb-6 text-sm">
          {error}
        </p>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingRecipe ? 'Modifier la recette' : 'Nouvelle recette'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Titre
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) =>
                  setFormData({ ...formData, isPublic: e.target.checked })
                }
                className="mr-2"
              />
              <label className="text-gray-700">
                Recette publique
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!formData.title.trim()}
                className="bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingRecipe ? 'Modifier' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">
              {recipe.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {recipe.description}
            </p>

            <div className="flex justify-between items-center">
              <span
                className={`text-sm ${
                  recipe.isPublic ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                {recipe.isPublic ? 'Public' : 'Privé'}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(recipe)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(recipe.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {recipes.length === 0 && !error && (
        <p className="text-center text-gray-500 mt-8">
          Aucune recette. Cliquez sur « Nouvelle recette » pour commencer.
        </p>
      )}
    </div>
  );
}
