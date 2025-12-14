import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { recipeService } from '../services/recipeService';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await recipeService.getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (recipeId) => {
    try {
      await recipeService.removeFavorite(recipeId);
      loadFavorites();
    } catch (error) {
      console.error('Erreur lors de la suppression du favori', error);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title-icon">
        <HeartIcon className="page-icon" />
        MES FAVORIS
      </h1>

      {loading ? (
        <div className="loading-text">Chargement...</div>
      ) : favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <HeartIcon style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', color: '#737373' }} />
          <p className="message-empty" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
            Aucun favori. Explore les recettes et ajoute-les à tes favoris !
          </p>
          <Link to="/recipes" className="btn-primary">
            Explorer les recettes
          </Link>
        </div>
      ) : (
        <div className="grid-recipes">
          {favorites.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 className="recipe-title">{recipe.title}</h3>
                <button
                  onClick={() => removeFavorite(recipe.id)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    padding: '0.25rem'
                  }}
                  title="Retirer des favoris"
                >
                  <HeartIconSolid style={{ width: '1.5rem', height: '1.5rem', color: '#ef4444' }} />
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
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
