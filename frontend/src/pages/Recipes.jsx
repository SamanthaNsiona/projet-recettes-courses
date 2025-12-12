import { useState, useEffect } from 'react';
import { recipeService } from '../services/recipeService';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipes();
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

  if (loading) {
    return <div className="loading-text">Chargement...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">RECETTES PUBLIQUES</h1>
      </div>

      <div className="grid-recipes">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <h3 className="recipe-title">{recipe.title}</h3>
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

      {recipes.length === 0 && (
        <p className="message-empty">
          Aucune recette publique disponible.
        </p>
      )}
    </div>
  );
}
