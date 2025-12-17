export default function FAQ() {
  return (
    <div className="page-container">
      <h1 className="page-title">FOIRE AUX QUESTIONS (FAQ)</h1>
      
      <div className="content-card" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
        <p className="text-content">
          Bienvenue sur la page FAQ de <strong>MyRecipes</strong>. Vous trouverez ici les réponses aux questions 
          les plus fréquemment posées concernant l'utilisation du Site, la gestion de votre compte, les recettes 
          et les listes de courses.
        </p>

        <section className="section-spacing">
          <h2 className="section-title">Qu'est-ce que MyRecipes ?</h2>
          <p className="text-content">
            MyRecipes est une plateforme dédiée à la consultation de recettes de cuisine et à la création de listes 
            de courses personnalisées. Le Site a pour objectif de faciliter l'organisation des repas et des achats 
            alimentaires au quotidien.
          </p>
        </section>

        <section className="section-spacing">
          <h2 className="section-title">L'utilisation de MyRecipes est-elle gratuite ?</h2>
          <p className="text-content">
            Oui. L'accès au Site et à ses fonctionnalités principales est gratuit. Certaines fonctionnalités 
            additionnelles pourront être ajoutées ultérieurement à titre optionnel.
          </p>
        </section>

        <section className="section-spacing">
          <h2 className="section-title">Dois-je créer un compte pour utiliser MyRecipes ?</h2>
          <p className="text-content">
            La consultation de certaines recettes peut être accessible sans compte. En revanche, la création d'un 
            compte est nécessaire pour enregistrer des recettes, sauvegarder vos préférences et gérer vos listes 
            de courses.
          </p>
        </section>

        <section className="section-spacing">
          <h2 className="section-title">Comment créer un compte ?</h2>
          <p className="text-content">
            Vous pouvez créer un compte directement depuis le Site en fournissant une adresse e-mail valide et en 
            choisissant un mot de passe. Vous êtes responsable de la confidentialité de vos identifiants.
          </p>
        </section>

        <section className="section-spacing">
          <h2 className="section-title">J'ai oublié mon mot de passe, que faire ?</h2>
          <p className="text-content">
            Si vous avez oublié votre mot de passe, vous pouvez utiliser la fonctionnalité « Mot de passe oublié » 
            disponible sur la page de connexion. Un lien de réinitialisation vous sera envoyé par e-mail.
          </p>
        </section>

        <section className="section-spacing">
          <h2 className="section-title">Comment enregistrer une recette ?</h2>
          <p className="text-content">
            Lorsque vous êtes connecté à votre compte, vous pouvez enregistrer une recette en l'ajoutant à vos favoris. 
            Elle sera alors accessible à tout moment depuis votre espace personnel.
          </p>
        </section>

        <section className="section-spacing">
          <h2 className="section-title">Comment créer une liste de courses ?</h2>
          <p className="text-content">
            Depuis une recette ou depuis votre espace personnel, vous pouvez créer une liste de courses en ajoutant 
            manuellement des produits ou en générant automatiquement une liste à partir des ingrédients d'une ou 
            plusieurs recettes.
          </p>
        </section>

        <section className="section-spacing">
          <h2 className="section-title">Puis-je modifier ou supprimer une liste de courses ?</h2>
          <p className="text-content">
            Oui. Vous pouvez modifier ou supprimer vos listes de courses à tout moment depuis votre compte.
          </p>
        </section>

        <section className="section-spacing">
          <h2 className="section-title">Mes données personnelles sont-elles protégées ?</h2>
          <p className="text-content">
            Oui. MyRecipes attache une grande importance à la protection de vos données personnelles. Pour plus 
            d'informations, nous vous invitons à consulter notre{' '}
            <a href="/privacy" className="link-primary">Politique de confidentialité</a>.
          </p>
        </section>

        <section className="section-spacing">
          <h2 className="section-title">MyRecipes utilise-t-il des cookies ?</h2>
          <p className="text-content">
            Oui. MyRecipes utilise des cookies et technologies similaires afin d'assurer le bon fonctionnement du 
            Site et d'améliorer votre expérience utilisateur. Pour plus de détails, veuillez consulter notre{' '}
            <a href="/cookies" className="link-primary">Politique en matière de cookies</a>.
          </p>
        </section>

        <section className="section-spacing">
          <h2 className="section-title">Puis-je supprimer mon compte ?</h2>
          <p className="text-content">
            Oui. Vous pouvez demander la suppression de votre compte à tout moment en nous contactant à l'adresse 
            indiquée dans la section Contact. La suppression entraînera la suppression de vos données conformément 
            à la réglementation applicable.
          </p>
        </section>

        <section className="section-spacing">
          <h2 className="section-title">Comment contacter MyRecipes ?</h2>
          <p className="text-content">
            Pour toute question, remarque ou demande d'assistance, vous pouvez nous contacter par e-mail à l'adresse 
            suivante :
          </p>
          <p className="text-content">
            <strong>myrecipesdev@gmail.com</strong>
          </p>
        </section>

        <p className="text-content" style={{ marginTop: '2rem', fontStyle: 'italic' }}>
          Si votre question ne figure pas dans cette FAQ, n'hésitez pas à nous contacter directement. Nous ferons 
          de notre mieux pour vous répondre dans les meilleurs délais.
        </p>
      </div>
    </div>
  );
}
