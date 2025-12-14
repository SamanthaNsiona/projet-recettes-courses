import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Composant Modal réutilisable
 * 
 * @param {boolean} isOpen - Contrôle l'affichage de la modale
 * @param {function} onClose - Callback appelé lors de la fermeture
 * @param {string} title - Titre de la modale
 * @param {React.ReactNode} children - Contenu de la modale
 * @param {string} variant - Variante de couleur ('primary', 'danger', 'success')
 * @param {function} onConfirm - Callback optionnel pour le bouton de confirmation
 * @param {string} confirmText - Texte du bouton de confirmation (défaut: "Confirmer")
 * @param {string} cancelText - Texte du bouton d'annulation (défaut: "Annuler")
 * @param {boolean} showFooter - Afficher ou non le footer avec les boutons (défaut: true)
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  variant = 'primary',
  onConfirm,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  showFooter = true
}) {
  if (!isOpen) return null;

  const variantStyles = {
    primary: 'btn-primary',
    danger: 'btn-delete',
    success: 'btn-secondary'
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-backdrop" 
      onClick={handleBackdropClick}
    >
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title" style={{ textAlign: 'center', flex: 1 }}>{title}</h3>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Fermer"
          >
            <XMarkIcon className="icon" />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {children}
        </div>

        {/* Footer */}
        {showFooter && (
          <div className="modal-footer">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              {cancelText}
            </button>
            {onConfirm && (
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={variantStyles[variant]}
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
