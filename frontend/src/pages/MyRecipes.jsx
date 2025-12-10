import { useState, useEffect } from 'react';
import { recipeService } from '../services/recipeService';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublic: true,
    ingredients: []
  });
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    quantity: ''
  });

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const data = await recipeService.getMyRecipes();
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
      // Nettoyer les ingrédients (enlever les IDs pour le backend)
      const cleanedData = {
        ...formData,
        ingredients: formData.ingredients.map(({ name, quantity }) => ({
          name,
          quantity: quantity || null,
          unit: null
        }))
      };

      if (editingRecipe) {
        await recipeService.update(editingRecipe.id, cleanedData);
      } else {
        await recipeService.create(cleanedData);
      }
      setFormData({ title: '', description: '', isPublic: true, ingredients: [] });
      setNewIngredient({ name: '', quantity: '' });
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
      ingredients: recipe.ingredients || []
    });
    setShowForm(true);
  };

  const handleAddIngredient = () => {
    if (newIngredient.name.trim()) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, { ...newIngredient, quantity: parseFloat(newIngredient.quantity) || null, unit: null }]
      });
      setNewIngredient({ name: '', quantity: '' });
    }
  };

  const handleRemoveIngredient = (index) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index)
    });
  };

  const handleEditIngredient = (index) => {
    const ingredient = formData.ingredients[index];
    setNewIngredient({
      name: ingredient.name,
      quantity: ingredient.quantity || ''
    });
    handleRemoveIngredient(index);
  };

  const handleIngredientKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
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

  const handleDeleteIngredient = async (ingredientId) => {
    if (window.confirm('Supprimer cet ingrédient?')) {
      try {
        await recipeService.deleteIngredient(ingredientId);
        loadRecipes();
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'ingrédient', error);
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
            setFormData({ title: '', description: '', isPublic: true, ingredients: [] });
            setNewIngredient({ name: '', quantity: '' });
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

            {/* Section Ingrédients */}
            <div>
              <label className="block text-xs tracking-wider uppercase text-neutral-600 mb-3">Ingrédients</label>
              
              {/* Liste des ingrédients ajoutés */}
              {formData.ingredients.length > 0 && (
                <div className="mb-4 space-y-2">
                  {formData.ingredients.map((ing, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                      <span className="text-xs">
                        {ing.quantity && `${ing.quantity}g `}
                        {ing.name}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditIngredient(index)}
                          className="bg-blue-500 text-white px-3 py-1 text-xs rounded hover:bg-blue-600"
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(index)}
                          className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600"
                        >
                          ✕ Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulaire d'ajout d'ingrédient */}
              <div className="grid grid-cols-12 gap-3">
                <input
                  type="text"
                  placeholder="Nom de l'ingrédient"
                  value={newIngredient.name}
                  onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                  onKeyPress={handleIngredientKeyPress}
                  className="col-span-9 px-3 py-2 border border-neutral-300 text-xs focus:border-neutral-900 focus:outline-none"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Quantité (g)"
                  value={newIngredient.quantity}
                  onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
                  onKeyPress={handleIngredientKeyPress}
                  className="col-span-2 px-3 py-2 border border-neutral-300 text-xs focus:border-neutral-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="col-span-1 bg-neutral-900 text-white hover:bg-neutral-800 flex items-center justify-center"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
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
            
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-medium tracking-wide mb-2 text-neutral-700">INGRÉDIENTS</h4>
                <div className="space-y-2">
                  {recipe.ingredients.map((ingredient) => (
                    <div key={ingredient.id} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                      <span className="text-xs text-neutral-600">
                        {ingredient.quantity && `${ingredient.quantity}g `}
                        {ingredient.name}
                      </span>
                      <button
                        onClick={() => handleDeleteIngredient(ingredient.id)}
                        className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600"
                      >
                        ✕ Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
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
