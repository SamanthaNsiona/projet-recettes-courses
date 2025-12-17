import '../styles/Footer.css';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">


        {/* Section Contact */}
        <div className="footer-section">
          <h3 className="footer-title">Contact</h3>
          <a href="/contact" className="footer-link" style={{ display: 'block', marginTop: '0.5rem' }}>
            Service Client
          </a>
          <a href="/faq" className="footer-link" style={{ display: 'block', marginTop: '0.5rem' }}>
            FAQ
          </a>
        </div>

        {/* Section Mentions légales */}
        <div className="footer-section">
          <h3 className="footer-title">Mentions légales</h3>
          <ul className="footer-links">
            <li>
              <a href="/legal" className="footer-link">
                Mentions Légales
              </a>
            </li>
            <li>
              <a href="/privacy" className="footer-link">
                Politique de Confidentialité
              </a>
            </li>
            <li>
              <a href="/cookies" className="footer-link">
                Politique de Cookies
              </a>
            </li>
            <li>
              <a href="/terms" className="footer-link">
                Conditions d'Utilisation
              </a>
            </li>
          </ul>
        </div>

        {/* Section Newsletter */}
        <NewsletterForm />
      </div>


      {/* Ligne de séparation */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          © {currentYear} Recettes & Courses.
        </p>
      </div>
    </footer>
  );
}
