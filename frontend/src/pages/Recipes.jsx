import { useState, useEffect } from 'react';
import { recipeService } from '../services/recipeService';
import { BookOpenIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import AddToListModal from '../components/AddToListModal';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [showAddToList, setShowAddToList] = useState(null);

  useEffect(() => {
    loadRecipes();
    loadFavorites();
  }, []);

  const loadRecipes = async () => {
    try {
      const data = await recipeService.getPublicRecipes();
      setRecipes(data);
    } catch (error) {
      console.error('Erreur lors du chargement des recettes', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const data = await recipeService.getFavorites();
      const favIds = new Set(data.map(fav => fav.id));
      setFavorites(favIds);
    } catch (error) {
      console.error('Erreur lors du chargement des favoris', error);
    }
  };

  const toggleFavorite = async (recipeId) => {
    try {
      if (favorites.has(recipeId)) {
        await recipeService.removeFavorite(recipeId);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(recipeId);
          return newSet;
        });
      } else {
        await recipeService.addFavorite(recipeId);
        setFavorites(prev => new Set(prev).add(recipeId));
      }
    } catch (error) {
      console.error('Erreur lors de la modification du favori', error);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-text">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title-icon">
        <BookOpenIcon className="page-icon" />
        RECETTES PUBLIQUES
      </h1>

      <div className="grid-recipes">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 className="recipe-title">{recipe.title}</h3>
              <button
                onClick={() => toggleFavorite(recipe.id)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
                title={favorites.has(recipe.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                {favorites.has(recipe.id) ? (
                  <HeartIconSolid style={{ width: '1.5rem', height: '1.5rem', color: '#ef4444' }} />
                ) : (
                  <HeartIcon style={{ width: '1.5rem', height: '1.5rem', color: '#737373' }} />
                )}
              </button>
            </div>
            {recipe.user && (
              <p className="recipe-author">Par {recipe.user.name}</p>
            )}
            <p className="recipe-description">{recipe.description}</p>
            
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div className="ingredients-section">
                <h4 className="ingredients-title">INGRÉDIENTS</h4>
                <ul className="ingredients-list">
                  {recipe.ingredients.map((ingredient) => (
                    <li key={ingredient.id} className="ingredient-item">
                      {ingredient.quantity && `${ingredient.quantity}g `}
                      {ingredient.name}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowAddToList(recipe)}
                  className="btn-outline"
                  style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}
                >
                  <ShoppingCartIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                  Ajouter à une liste
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {recipes.length === 0 && (
        <p className="message-empty">
          Aucune recette publique disponible.
        </p>
      )}

      {showAddToList && (
        <AddToListModal
          recipe={showAddToList}
          onClose={() => setShowAddToList(null)}
        />
      )}
    </div>
  );
}
