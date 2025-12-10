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
    return <div className="text-center py-16 text-xs tracking-[0.2em] uppercase text-neutral-600">Chargement...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-16">
        <h1 className="title-main text-2xl">RECETTES PUBLIQUES</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="border-b border-neutral-200 pb-6">
            <h3 className="text-sm font-light tracking-wide mb-2">{recipe.title}</h3>
            {recipe.user && (
              <p className="text-xs text-neutral-400 mb-4">Par {recipe.user.name}</p>
            )}
            <p className="text-neutral-600 text-xs leading-relaxed mb-6">{recipe.description}</p>
            
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-medium tracking-wide mb-2 text-neutral-700">INGRÉDIENTS</h4>
                <ul className="text-xs text-neutral-600 space-y-1">
                  {recipe.ingredients.map((ingredient) => (
                    <li key={ingredient.id}>
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
        <p className="text-center text-neutral-400 mt-12 text-xs tracking-wider uppercase">
          Aucune recette publique disponible.
        </p>
      )}
    </div>
  );
}
