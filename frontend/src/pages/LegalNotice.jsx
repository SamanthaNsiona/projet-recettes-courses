export default function LegalNotice() {
  return (
    <div className="page-container">
      <h1 className="page-title">Mentions Légales</h1>
      
      <div className="content-card" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
        <section className="section-spacing">
          <h2 className="section-title">1. Éditeur du site</h2>
          <p className="text-content">
            <strong>Nom du site :</strong> Recettes & Courses<br />
            <strong>Email :</strong> myrecipesdev@gmail.com<br />
            <strong>Hébergement :</strong> Supabase (États-Unis)
          </p>
        </section>
 
        <section className="section-spacing">
          <h2 className="section-title">2. Propriété intellectuelle</h2>
          <p className="text-content">
            L'ensemble du contenu de ce site (textes, images, graphismes, logo, icônes) est la propriété 
            exclusive de Recettes & Courses, à l'exception des recettes créées par les utilisateurs qui 
            restent leur propriété.
          </p>
        </section>

        <section className="section-spacing">
          <h2 className="section-title">3. Données personnelles</h2>
          <p className="text-content">
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression 
            de vos données personnelles. Les données collectées (nom, email) sont utilisées uniquement 
            pour le fonctionnement du service et ne sont jamais partagées avec des tiers.
          </p>
        </section>

        <section className="section-spacing">
          <h2 className="section-title">4. Cookies</h2>
          <p className="text-content">
            Ce site utilise des cookies techniques nécessaires au fonctionnement (authentification). 
            Consultez notre <a href="/cookies" className="link-primary">politique de cookies</a> pour plus d'informations.
          </p>
        </section>

        <section className="section-spacing">
          <h2 className="section-title">5. Responsabilité</h2>
          <p className="text-content">
            L'éditeur ne peut être tenu responsable des recettes publiées par les utilisateurs. 
            Chaque utilisateur est responsable du contenu qu'il publie.
          </p>
        </section>

        <section className="section-spacing">
          <h2 className="section-title">6. Contact</h2>
          <p className="text-content">
            Pour toute question concernant ces mentions légales, contactez-nous à : 
            <strong> myrecipesdev@gmail.com</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
