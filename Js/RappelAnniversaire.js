// RappelAnniversaire.js — gestion du rappel Anniversaire Laila SANS blocage
// Affiche l’icône de rappel sur la phrase cible, laisse la story continuer
// et active le calendrier avec un événement (Anniversaire Laila, 30 Novembre).

(function () {
  // Plus de blocage: l’histoire continue, l’icône reste visible
  
  function showIcon() {
    const icon = document.getElementById('notification-icon');
    if (!icon) return null;
    icon.classList.remove('hidden');
    // Jouer le son de notification à l'apparition de l'icône
    const notifAudio = document.getElementById('notification-sound');
    if (notifAudio) {
      try { notifAudio.currentTime = 0; notifAudio.play(); } catch (_) {}
    }
    return icon;
  }

  // On ne masque plus l’icône; elle reste présente à l’écran

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
    // Compat: toujours non-bloquant
    isBlocking: () => false,
    reset: () => {},
    // À appeler lorsque la ligne actuelle de dialogue doit déclencher ce rappel
    // onBlock: fonction appelée pour stocker les choix et index bloqués
    // onUnblock: fonction appelée après clic sur rappel pour reprendre
    handleDialogue: (text, onBlock, onUnblock) => {
      const triggerPrefix = 'Bon, pas de panique il me reste encore du temps pour réviser. Je vais commencer par le chapitre sur';
      if (typeof text === 'string' && text.includes(triggerPrefix)) {
        const icon = showIcon();
        if (!icon) return false;
        // Ne pas bloquer: laisser l’icône visible et continuer l’histoire.
        // Un clic ouvre/active le calendrier, l’icône reste affichée.
        icon.onclick = () => {
          activateCalendarWithAnniversary();
        };
        return false; // non-bloquant
      }
      return false; // pas de blocage pour ce texte
    },
  };
})();