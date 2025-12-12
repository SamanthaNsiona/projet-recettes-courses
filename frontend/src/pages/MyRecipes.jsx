import { useState, useEffect } from 'react';
import { recipeService } from '../services/recipeService';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

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
  const [editingIngredientIndex, setEditingIngredientIndex] = useState(null);

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
      if (editingIngredientIndex !== null) {
        // Modifier l'ingrédient existant
        const updatedIngredients = [...formData.ingredients];
        updatedIngredients[editingIngredientIndex] = {
          ...newIngredient,
          quantity: parseFloat(newIngredient.quantity) || null,
          unit: null
        };
        setFormData({
          ...formData,
          ingredients: updatedIngredients
        });
        setEditingIngredientIndex(null);
      } else {
        // Ajouter un nouvel ingrédient
        setFormData({
          ...formData,
          ingredients: [...formData.ingredients, { ...newIngredient, quantity: parseFloat(newIngredient.quantity) || null, unit: null }]
        });
      }
      setNewIngredient({ name: '', quantity: '' });
    }
  };

  const handleEditIngredient = (index) => {
    const ingredient = formData.ingredients[index];
    setNewIngredient({
      name: ingredient.name,
      quantity: ingredient.quantity || ''
    });
    setEditingIngredientIndex(index);
  };

  const handleRemoveIngredient = (index) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index)
    });
    // Annuler l'édition si on supprime l'ingrédient en cours d'édition
    if (editingIngredientIndex === index) {
      setEditingIngredientIndex(null);
      setNewIngredient({ name: '', quantity: '' });
    }
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

  if (loading) {
    return <div className="loading-text">Chargement...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">MES RECETTES</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingRecipe(null);
            setFormData({ title: '', description: '', isPublic: true, ingredients: [] });
            setNewIngredient({ name: '', quantity: '' });
          }}
          className="btn-primary btn-icon"
        >
          <PlusIcon className="icon" />
          Nouvelle recette
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3 className="form-title">
            {editingRecipe ? 'Modifier la recette' : 'Nouvelle recette'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="form-group">
              <label className="form-label">Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-textarea"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ingrédients</label>
              
              {formData.ingredients.length > 0 && (
                <div className="space-y-2 mb-4">
                  {formData.ingredients.map((ing, index) => (
                    <div key={index} className="ingredient-item-edit">
                      <span className="ingredient-text">
                        {ing.quantity && `${ing.quantity}g `}
                        {ing.name}
                      </span>
                      <div className="flex-gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditIngredient(index)}
                          className="btn-edit"
                          title="Modifier cet ingrédient"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(index)}
                          className="btn-delete"
                          title="Supprimer cet ingrédient"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid-form">
                <input
                  type="text"
                  placeholder="Nom de l'ingrédient"
                  value={newIngredient.name}
                  onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                  onKeyPress={handleIngredientKeyPress}
                  className="col-span-9 form-input-bordered"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Quantité (g)"
                  value={newIngredient.quantity}
                  onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
                  onKeyPress={handleIngredientKeyPress}
                  className="col-span-2 form-input-bordered"
                />
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="col-span-1 btn-add"
                  title={editingIngredientIndex !== null ? "Enregistrer la modification" : "Ajouter l'ingrédient"}
                >
                  {editingIngredientIndex !== null ? '✓' : <PlusIcon className="icon" />}
                </button>
              </div>
            </div>

            <div className="form-checkbox-wrapper">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="form-checkbox"
              />
              <label className="form-label">Recette publique</label>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingRecipe ? 'Modifier' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingRecipe(null);
                }}
                className="btn-secondary"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <div className="grid-recipes">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <h3 className="recipe-title">{recipe.title}</h3>
              <p className="recipe-description">{recipe.description}</p>
            
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div className="ingredients-section">
                <h4 className="ingredients-title">INGRÉDIENTS</h4>
                <ul className="ingredients-list space-y-2">
                  {recipe.ingredients.map((ingredient) => (
                    <li key={ingredient.id} className="ingredient-item">
                      <span>
                        {ingredient.quantity && `${ingredient.quantity}g `}
                        {ingredient.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="recipe-footer">
              <span className={`recipe-status ${recipe.isPublic ? 'recipe-status-public' : 'recipe-status-private'}`}>
                {recipe.isPublic ? 'Public' : 'Privé'}
              </span>
              <div className="recipe-actions">
                <button onClick={() => handleEdit(recipe)} className="btn-outline">
                  <PencilIcon className="icon" />
                  Modifier
                </button>
                <button onClick={() => handleDelete(recipe.id)} className="btn-outline">
                  <TrashIcon className="icon" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {!showForm && recipes.length === 0 && (
        <p className="message-empty">
          Aucune recette. Cliquez sur "Nouvelle recette" pour commencer.
        </p>
      )}
    </div>
  );
}
