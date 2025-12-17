import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { recipeService } from '../services/recipeService';

export default function Home() {
  const authContext = useAuth();
  const user = authContext?.user;
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les recettes publiques depuis la BDD
    const fetchRecipes = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const data = await recipeService.getPublicRecipes();
        // Prendre seulement les 4 premières recettes
        setRecipes(data.slice(0, 4));
      } catch (error) {
        console.error('Erreur lors du chargement des recettes:', error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [user]);

  console.log('Home page rendu - user:', user ? user.name : 'non connecté');

  return (
    <main className="page-container">
      <section className="hero">
        <h1 className="page-title-icon" style={{ justifyContent: 'center' }}>
          ACCUEIL
        </h1>
        <h2 className="title-main">
          Organise tes recettes et tes courses
        </h2>

        <p className="hero-description">
          Crée, partage et retrouve facilement tes recettes.
          Génère des listes de courses intelligentes et simplifie ton quotidien.
        </p>

        <div className="hero-actions">
          {user ? (
            <>
              <Link to="/my-recipes" className="btn-primary">
                Mes recettes
              </Link>
              <Link to="/recipes" className="btn-secondary">
                Explorer
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn-primary">
                Créer un compte
              </Link>
              <Link to="/login" className="btn-secondary">
                Se connecter
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="shortcuts">
        {user ? (
          <>
            <Link to="/my-recipes" className="shortcut-card">
              <h3>Mes recettes</h3>
              <p>Gère et organise toutes tes recettes personnelles.</p>
            </Link>

            <Link to="/favorites" className="shortcut-card">
              <h3>Favoris</h3>
              <p>Accède rapidement à tes recettes préférées.</p>
            </Link>

            <Link to="/shopping-lists" className="shortcut-card">
              <h3>Liste de courses</h3>
              <p>Centralise tous tes ingrédients en un seul endroit.</p>
            </Link>
          </>
        ) : (
          <>
            <Link to="/register" className="shortcut-card">
              <h3>Inscription</h3>
              <p>Crée ton compte gratuitement en quelques clics.</p>
            </Link>

            <Link to="/login" className="shortcut-card">
              <h3>Connexion</h3>
              <p>Accède à ton espace personnel.</p>
            </Link>

            <Link to="/recipes" className="shortcut-card">
              <h3>Explorer</h3>
              <p>Découvre les recettes de la communauté.</p>
            </Link>
          </>
        )}
      </section>

      <section className="public-recipes">
        <h2 className="title-main" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Recettes de la communauté
        </h2>

        {loading ? (
          <div className="loading-text">
            Chargement des recettes...
          </div>
        ) : recipes.length === 0 ? (
          <div style={{ textAlign: 'center' }}>
            <p className="message-empty">Aucune recette partagée pour le moment.</p>
            <Link to="/my-recipes" className="btn-primary" style={{ display: 'inline-flex', marginTop: '1rem' }}>
              Créer une recette
            </Link>
          </div>
        ) : (
          <div className="recipes-grid">
            {recipes.map(recipe => (
              <article key={recipe.id} className="recipe-card">
                <h4>{recipe.title}</h4>
                <p>{recipe.description}</p>
                <span className="recipe-author">Par {recipe.user?.name || 'Anonyme'}</span>
              </article>
            ))}
          </div>
        )}

        {recipes.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/recipes" className="btn-secondary" style={{ display: 'inline-flex' }}>
              Voir toutes les recettes
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

