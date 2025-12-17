export default function CookiesPolicy() {
  return (
    <div className="page-container">
      <h1 className="page-title">POLITIQUE EN MATIÈRE DE COOKIES</h1>
      
      <div className="content-card" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
        <p className="text-content" style={{ fontStyle: 'italic', marginBottom: '2rem' }}>
          Dernière mise à jour : Décembre 2024
        </p>

        <p className="text-content">
          La présente Politique en matière de cookies explique comment MyRecipes utilise les cookies 
          et technologies similaires lorsque vous consultez ou utilisez notre Site. Elle complète notre{' '}
          <a href="/privacy" className="link-primary">Politique de confidentialité</a> et vise à vous informer 
          clairement sur les types de cookies que nous utilisons et la manière dont vous pouvez les gérer.
        </p>

        <section className="section-spacing">
          <h2 className="section-title">1. Qu'est-ce qu'un cookie ?</h2>
          <p className="text-content">
            Un cookie est un petit fichier composé de lettres et de chiffres qui est stocké sur votre navigateur 
            ou sur le disque dur de votre appareil si vous acceptez leur utilisation. Un cookie contient des 
            informations qui sont renvoyées à notre serveur ou à celui d'un tiers à chaque visite ultérieure.
          </p>
        </section>

        <section className="section-spacing">
          <h2 className="section-title">2. Pourquoi utilisons-nous des cookies ?</h2>
          <p className="text-content">
            Notre Site utilise des cookies pour vous distinguer des autres utilisateurs et pour améliorer votre 
            expérience de navigation. L'utilisation de cookies nous aide à :
          </p>
          <ul className="list-content">
            <li>Assurer le bon fonctionnement du Site, notamment pour utiliser certaines zones sécurisées, pour 
            l'authentification ou pour maintenir votre session.</li>
            <li>Analyser la manière dont les visiteurs utilisent le Site afin de l'améliorer continuellement.</li>
            <li>Reconnaître un utilisateur lorsqu'il revient sur le Site afin de personnaliser son expérience 
            et mémoriser ses préférences.</li>
          </ul>
        </section>

        <section className="section-spacing">
          <h2 className="section-title">3. Types de cookies utilisés</h2>
          <p className="text-content">Nous utilisons les catégories suivantes de cookies :</p>

          <h3 className="subsection-title">Cookies strictement nécessaires</h3>
          <p className="text-content">
            Ces cookies sont indispensables au fonctionnement du Site. Sans eux, vous ne pourriez pas utiliser 
            certaines fonctionnalités essentielles, telles que la connexion à votre compte utilisateur.
          </p>

          <h3 className="subsection-title">Cookies analytiques ou de performance</h3>
          <p className="text-content">
            Ils permettent de compter les visiteurs et de voir comment les utilisateurs naviguent sur le Site. 
            Ces informations nous aident à améliorer le fonctionnement général du Site.
          </p>

          <h3 className="subsection-title">Cookies de fonctionnalité</h3>
          <p className="text-content">
            Ces cookies sont utilisés pour reconnaître votre appareil lorsque vous revenez sur le Site. Ils nous 
            permettent de mémoriser vos préférences et d'adapter certains contenus ou réglages.
          </p>
        </section>

        <section className="section-spacing">
          <h2 className="section-title">4. Cookies de tiers</h2>
          <p className="text-content">
            Certains cookies peuvent être placés par des services externes (tiers) tels que des réseaux publicitaires 
            ou des outils d'analyse comme Google Analytics, Facebook ou d'autres outils tiers. Nous n'avons pas de 
            contrôle direct sur ces cookies, qui peuvent être des cookies analytiques, de performance ou de ciblage.
          </p>
        </section>

        <section className="section-spacing">
          <h2 className="section-title">5. Gérer les cookies</h2>
          <p className="text-content">
            Vous pouvez bloquer ou supprimer les cookies en modifiant les paramètres de votre navigateur. La plupart 
            des navigateurs permettent de refuser certains ou tous les cookies via leurs paramètres. Cependant, si 
            vous désactivez tous les cookies (y compris ceux strictement nécessaires), vous pourriez ne pas être en 
            mesure d'accéder à certaines parties ou fonctionnalités du Site.
          </p>
          <p className="text-content">
            Vous pouvez aussi visiter{' '}
            <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="link-primary">
              www.allaboutcookies.org
            </a>{' '}
            pour des informations générales sur les cookies et sur la manière de les gérer sur différents navigateurs.
          </p>
        </section>

        <section className="section-spacing">
          <h2 className="section-title">6. Mise à jour de cette politique</h2>
          <p className="text-content">
            Nous pouvons être amenés à modifier cette Politique en matière de cookies pour tenir compte de l'évolution 
            des lois, des technologies ou des fonctionnalités du Site. Toute mise à jour sera publiée sur le Site avec 
            une nouvelle date de mise à jour.
          </p>
        </section>

        <section className="section-spacing">
          <h2 className="section-title">7. Nous contacter</h2>
          <p className="text-content">
            Pour toute question ou demande concernant cette Politique en matière de cookies ou l'utilisation de vos 
            données sur le Site, vous pouvez nous contacter à :
          </p>
          <p className="text-content">
            <strong>Email :</strong> myrecipesdev@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
