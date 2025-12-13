
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <>
      <header className="top-bar">
        <div className="top-left">
          <Link to="/profile" title="Profil" className="profile-link">
            <svg className="icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M4 20c0-4 4-6 8-6s8 2 8 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="hello">
              Bonjour {user?.name}
            </span>
          </Link>
        </div>

        <div className="brand">MyRecipe</div>

        <button onClick={logout} className="logout-btn" title="Déconnexion">
          <svg className="icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
            <path d="M12 2v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path
              d="M6.5 4.5a7 7 0 1 0 11 0"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      <main className="container">
        <section className="hero">
          <h1 className="title-main">
            Organise tes recettes et tes courses
          </h1>

          <p>
            Crée, partage et retrouve facilement tes recettes.
            Génère des listes de courses intelligentes et simplifie ton quotidien.
          </p>

          <div className="hero-actions">
            <Link to="/my-recipes" className="btn-primary">
              Mes recettes
            </Link>
            <Link to="/recipes" className="btn-secondary">
              Explorer
            </Link>
          </div>
        </section>

        <section className="shortcuts">
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
        </section>

        <section className="public-recipes">
          <h2 className="title-main">
            Recettes de la communauté
          </h2>

          <div className="recipes-grid">
            <article className="recipe-card">
              <h4>Tarte aux pommes</h4>
              <p>Une recette simple et gourmande pour toute la famille.</p>
              <span className="recipe-author">Par Alice</span>
            </article>

            <article className="recipe-card">
              <h4>Pâtes carbonara</h4>
              <p>La vraie recette italienne, sans crème.</p>
              <span className="recipe-author">Par Paul</span>
            </article>

            <article className="recipe-card">
              <h4>Salade César</h4>
              <p>Fraîche et rapide, parfaite pour l’été.</p>
              <span className="recipe-author">Par Sophie</span>
            </article>
          </div>

          <Link to="/recipes" className="see-more">
            Voir toutes les recettes
          </Link>
        </section>
      </main>
    </>
  );
}

