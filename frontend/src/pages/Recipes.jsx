import { useState, useEffect } from 'react';
import { recipeService } from '../services/recipeService';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
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
    return <div className="text-center py-16 text-xs tracking-[0.2em] uppercase text-neutral-600">Chargement...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-16">
        <h1 className="title-main text-2xl">MES RECETTES</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingRecipe(null);
            setFormData({ title: '', description: '', isPublic: false });
          }}
          className="flex items-center gap-3 bg-neutral-900 text-white px-6 py-3 hover:bg-neutral-800 transition-colors text-xs tracking-[0.2em] uppercase"
        >
          <PlusIcon className="h-4 w-4" />
          Nouvelle recette
        </button>
      </div>

      {showForm && (
        <div className="border-b border-neutral-200 pb-12 mb-12">
          <h3 className="text-xs font-light tracking-[0.2em] uppercase mb-8 text-neutral-600">
            {editingRecipe ? 'Modifier la recette' : 'Nouvelle recette'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-xs tracking-wider uppercase text-neutral-600 mb-3">Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-0 py-3 border-0 border-b border-neutral-300 bg-transparent focus:border-neutral-900 focus:outline-none text-sm transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-neutral-600 mb-3">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-0 py-3 border-0 border-b border-neutral-300 bg-transparent focus:border-neutral-900 focus:outline-none text-sm transition-colors resize-none"
                rows="4"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="w-4 h-4 border-neutral-300"
              />
              <label className="text-xs tracking-wider uppercase text-neutral-600">Recette publique</label>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="bg-neutral-900 text-white px-8 py-4 hover:bg-neutral-800 transition-colors text-xs tracking-[0.2em] uppercase"
              >
                {editingRecipe ? 'Modifier' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingRecipe(null);
                }}
                className="bg-neutral-200 text-neutral-900 px-8 py-4 hover:bg-neutral-300 transition-colors text-xs tracking-[0.2em] uppercase"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="border-b border-neutral-200 pb-6">
            <h3 className="text-sm font-light tracking-wide mb-4">{recipe.title}</h3>
            <p className="text-neutral-600 text-xs leading-relaxed mb-6">{recipe.description}</p>
            <div className="flex justify-between items-center">
              <span className={`text-xs tracking-wider uppercase ${recipe.isPublic ? 'text-neutral-900' : 'text-neutral-400'}`}>
                {recipe.isPublic ? 'Public' : 'Privé'}
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(recipe)}
                  className="flex items-center gap-2 px-4 py-2 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors text-xs uppercase"
                >
                  <PencilIcon className="h-4 w-4" />
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(recipe.id)}
                  className="flex items-center gap-2 px-4 py-2 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors text-xs uppercase"
                >
                  <TrashIcon className="h-4 w-4" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recipes.length === 0 && (
        <p className="text-center text-neutral-400 mt-12 text-xs tracking-wider uppercase">
          Aucune recette. Cliquez sur "Nouvelle recette" pour commencer.
        </p>
      )}
    </div>
  );
}
