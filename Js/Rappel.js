// Rappel.js — gestion du rappel et blocage de progression
// Affiche l’icône de rappel sur déclencheur, bloque la story
// et active le calendrier avec un événement (Examen de Math).

(function () {
  let isBlocking = false;
  let hasClicked = false;
  let hasShownIcon = false;

  function showRappelIcon() {
    const icon = document.getElementById('rappel-icon');
    if (!icon) return null;
    icon.classList.remove('hidden');
    icon.classList.add('attention-shake');
    return icon;
  }

  function hideRappelIcon(icon) {
    if (!icon) return;
    icon.classList.add('hidden');
    icon.classList.remove('attention-shake');
  }

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
    isBlocking: () => isBlocking && !hasClicked,
    reset: () => {
      isBlocking = false;
      hasClicked = false;
      hasShownIcon = false;
    },
    // À appeler lorsque la ligne actuelle de dialogue doit déclencher le rappel
    // onBlock: fonction appelée pour stocker les choix et index bloqués
    // onUnblock: fonction appelée après clic sur rappel pour reprendre
    handleDialogue: (text, onBlock, onUnblock) => {
      const dingTrigger = '*Ding* - Ton ordinateur affiche une notification';
      const examTrigger = 'QUOI ! EXAMEN DE MATHS, COMMENT J’AI PU OUBLIER !';

      // 1) À la phrase Ding: afficher l’icône sans bloquer
      if (typeof text === 'string' && text.trim() === dingTrigger && !hasShownIcon) {
        const icon = showRappelIcon();
        if (icon) {
          hasShownIcon = true;
          // Lier le clic si pas encore lié
          icon.onclick = () => {
            if (hasClicked) return;
            hasClicked = true;
            isBlocking = false;
            hideRappelIcon(icon);
            activateCalendarWithExam();
            if (typeof onUnblock === 'function') onUnblock();
          };
        }
        return false; // pas de blocage sur Ding
      }

      // 2) À la phrase d’examen: bloquer jusqu’au clic sur l’icône
      if (typeof text === 'string' && text.trim() === examTrigger && !hasClicked) {
        const icon = showRappelIcon();
        if (!icon) return false;
        hasShownIcon = true;
        isBlocking = true;

        if (typeof onBlock === 'function') onBlock();

        // Lier le clic (si pas déjà lié depuis Ding)
        if (!icon.onclick) {
          icon.onclick = () => {
            if (hasClicked) return;
            hasClicked = true;
            isBlocking = false;
            hideRappelIcon(icon);
            activateCalendarWithExam();
            if (typeof onUnblock === 'function') onUnblock();
          };
        }
        return true; // blocage actif
      }
      return false; // pas de blocage pour ce texte
    },
  };
})();