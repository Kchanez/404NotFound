// RappelAnniversaire.js — gestion du rappel Anniversaire Laila avec blocage
// Affiche l’icône de rappel sur la phrase cible, bloque la story
// et active le calendrier avec un événement (Anniversaire Laila, 30 Novembre).

(function () {
  let isBlocking = false;
  let hasClicked = false;
  
  function showIcon() {
    const icon = document.getElementById('notification-icon');
    if (!icon) return null;
    icon.classList.remove('hidden');
    icon.classList.add('attention-shake');
    return icon;
  }

  function hideIcon(icon) {
    if (!icon) return;
    icon.classList.add('hidden');
    icon.classList.remove('attention-shake');
  }

  function activateCalendarWithAnniversary() {
    const now = new Date();
    const year = now.getFullYear();
    if (window.CalendarAPI) {
      if (typeof window.CalendarAPI.enableCalendar === 'function') {
        // Activer pour un seul clic sur l’icône (sera re-désactivée après clic)
        window.CalendarAPI.enableCalendar(true);
      }
      if (typeof window.CalendarAPI.addEvent === 'function') {
        // Novembre = 10 (index à partir de 0), Jour = 30
        window.CalendarAPI.addEvent(year, 10, 30, 'Anniversaire Laila');
      }
      // Ne pas ouvrir automatiquement le calendrier; l’utilisateur cliquera sur l’icône.
    }
  }

  window.RappelAnnivAPI = {
    isBlocking: () => isBlocking && !hasClicked,
    reset: () => {
      isBlocking = false;
      hasClicked = false;
    },
    // À appeler lorsque la ligne actuelle de dialogue doit déclencher ce rappel
    // onBlock: fonction appelée pour stocker les choix et index bloqués
    // onUnblock: fonction appelée après clic sur rappel pour reprendre
    handleDialogue: (text, onBlock, onUnblock) => {
      const triggerPrefix = 'Bon, pas de panique il me reste encore du temps pour réviser. Je vais commencer par le chapitre sur';
      if (typeof text === 'string' && text.includes(triggerPrefix) && !hasClicked) {
        const icon = showIcon();
        if (!icon) return false;
        isBlocking = true;
        if (typeof onBlock === 'function') onBlock();

        icon.onclick = () => {
          if (hasClicked) return;
          hasClicked = true;
          isBlocking = false;
          hideIcon(icon);
          activateCalendarWithAnniversary();
          if (typeof onUnblock === 'function') onUnblock();
        };
        return true; // blocage actif
      }
      return false; // pas de blocage pour ce texte
    },
  };
})();