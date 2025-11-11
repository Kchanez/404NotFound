// Rappel.js — gestion du rappel SANS blocage de progression
// Affiche l’icône de rappel sur déclencheur, laisse la story continuer
// et active le calendrier avec un événement (Examen de Math).

(function () {
  // Plus de blocage: l’histoire continue
  let hasClicked = false;
  let hasShownIcon = false;

  function showRappelIcon() {
    const icon = document.getElementById('rappel-icon');
    if (!icon) return null;
    icon.classList.remove('hidden');
    icon.classList.add('attention-shake');
    return icon;
  }

  // On ne masque plus l’icône; elle reste visible à l’écran

  function activateCalendarWithExam() {
    const now = new Date();
    const examYear = now.getFullYear();
    if (window.CalendarAPI) {
      if (typeof window.CalendarAPI.enableCalendar === 'function') {
        // Activer pour un seul clic sur l’icône (sera re-désactivée après clic)
        window.CalendarAPI.enableCalendar(true);
      }
      if (typeof window.CalendarAPI.addEvent === 'function') {
        // Novembre = 10 (index à partir de 0)
        window.CalendarAPI.addEvent(examYear, 10, 28, 'Examen de Math');
      }
      // Ne pas ouvrir automatiquement le calendrier; l’utilisateur cliquera sur l’icône.
    }
  }

  window.RappelAPI = {
    // Compat: toujours non-bloquant
    isBlocking: () => false,
    reset: () => {
      hasClicked = false;
      hasShownIcon = false;
    },
    // À appeler lorsque la ligne actuelle de dialogue doit déclencher le rappel
    // onBlock: fonction appelée pour stocker les choix et index bloqués
    // onUnblock: fonction appelée après clic sur rappel pour reprendre
    handleDialogue: (text, onBlock, onUnblock) => {
      const dingTrigger = '*Ding* - Ton ordinateur affiche une notification';
      const examTrigger = 'QUOI ! EXAMEN DE MATHS, COMMENT J’AI PU OUBLIER !';

      // 1) À la phrase Ding: afficher l’icône (non-bloquant)
      if (typeof text === 'string' && text.trim() === dingTrigger && !hasShownIcon) {
        const icon = showRappelIcon();
        if (icon) {
          hasShownIcon = true;
          // Lier le clic si pas encore lié
          icon.onclick = () => {
            if (hasClicked) return;
            hasClicked = true;
            activateCalendarWithExam();
            // Ne pas masquer l’icône; ne pas appeler onUnblock (pas de blocage)
          };
        }
        return false; // non-bloquant
      }

      // 2) À la phrase d’examen: afficher l’icône et continuer (non-bloquant)
      if (typeof text === 'string' && text.trim() === examTrigger) {
        const icon = showRappelIcon();
        if (!icon) return false;
        hasShownIcon = true;
        // Lier le clic (si pas déjà lié depuis Ding)
        if (!icon.onclick) {
          icon.onclick = () => {
            if (hasClicked) return;
            hasClicked = true;
            activateCalendarWithExam();
            // Ne pas masquer l’icône; ne pas appeler onUnblock (pas de blocage)
          };
        }
        return false; // non-bloquant
      }
      return false; // pas de blocage pour ce texte
    },
  };
})();