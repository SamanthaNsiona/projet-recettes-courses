import { useState, useEffect } from 'react';
import { recipeService } from '../services/recipeService';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import IngredientList from '../components/IngredientList';
import RecipeCard from '../components/RecipeCard';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
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
      const data = await recipeService.getAll();
      setRecipes(data);
    } catch (error) {
      console.error('Erreur lors du chargement des recettes', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRecipe) {
        await recipeService.update(editingRecipe.id, formData);
      } else {
        await recipeService.create(formData);
      }
      setFormData({ title: '', description: '', isPublic: false });
      setEditingRecipe(null);
      setShowForm(false);
      loadRecipes();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde', error);
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
    if (window.confirm('Voulez-vous vraiment supprimer cette recette?')) {
      try {
        await recipeService.delete(id);
        loadRecipes();
      } catch (error) {
        console.error('Erreur lors de la suppression', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center p-8">Chargement...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mes Recettes</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingRecipe(null);
            setFormData({ title: '', description: '', isPublic: false });
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
          Nouvelle recette
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingRecipe ? 'Modifier la recette' : 'Nouvelle recette'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="mr-2"
              />
              <label className="text-gray-700">Recette publique</label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingRecipe ? 'Modifier' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingRecipe(null);
                }}
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
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleIngredients={(id) => setExpanded((s) => ({ ...s, [id]: !s[id] }))}
            expanded={!!expanded[recipe.id]}
          >
            {expanded[recipe.id] && <IngredientList recipe={recipe} onUpdated={loadRecipes} />}
          </RecipeCard>
        ))}
      </div>

      {recipes.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          Aucune recette. Cliquez sur "Nouvelle recette" pour commencer.
        </p>
      )}
    </div>
  );
}
