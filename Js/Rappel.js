// Rappel.js — gestion du rappel SANS blocage de progression
// Affiche l’icône de rappel sur déclencheur, laisse la story continuer
// et active le calendrier avec un événement (Examen de Math).

(function () {
  // Plus de blocage: l’histoire continue
  let hasClicked = false;
  let hasShownIcon = false;

  function showRappelIcon() {
    const icon = document.getElementById("rappel-icon");
    if (!icon) return null;
    icon.classList.remove("hidden");
    return icon;
  }

  // On ne masque plus l’icône; elle reste visible à l’écran

  function hideRappelIcon() {
    const rappelIcon = document.getElementById("rappel-icon");
    if (rappelIcon) {
      rappelIcon.classList.add("hidden");
      const notificationIcon = document.getElementById("notification-icon");
      if (notificationIcon) {
        notificationIcon.style.top = "9%";
      }
    }
  }

  function activateCalendarWithExam() {
    const now = new Date();
    const examYear = now.getFullYear();
    if (window.CalendarAPI) {
      if (typeof window.CalendarAPI.enableCalendar === "function") {
        // Activer pour un seul clic sur l’icône (sera re-désactivée après clic)
        window.CalendarAPI.enableCalendar(true);
      }
      if (typeof window.CalendarAPI.addEvent === "function") {
        // Novembre = 10 (index à partir de 0)
        window.CalendarAPI.addEvent(examYear, 10, 28, "Examen de Math");
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
      const dingTrigger = "J'ai l'impression d'avoir oublié un truc...";
      const examTrigger = "QUOI ! EXAMEN DE MATHS, COMMENT J’AI PU OUBLIER !";

      // 1) À la phrase Ding: afficher l’icône (non-bloquant)
      if (
        typeof text === "string" &&
        text.trim() === dingTrigger &&
        !hasShownIcon
      ) {
        const icon = showRappelIcon();
        if (icon) {
          hasShownIcon = true;
          activateCalendarWithExam();
          window.CalendarAPI.openCalendar();
          // Désactiver le calendrier après un court délai (par exemple, 3 secondes)
          setTimeout(() => {
            window.CalendarAPI.disableCalendar();
          }, 3000); // 3000 ms = 3 secondes
        }
        return false; // non-bloquant
      }

      // 2) À la phrase d’examen: afficher l’icône et continuer (non-bloquant)
      if (typeof text === "string" && text.trim() === examTrigger) {
        const icon = showRappelIcon();
        if (!icon) return false;
        hasShownIcon = true;
        return false; // non-bloquant
      }
      // 3) Masquer l’icône de rappel à un message spécifique
      const hideRappelTrigger =
        "Je sais qu'ils se trompent. Ces histoires de kidnapping de la ville, je sais que tu n’as rien à faire avec! Tu n'as pas disparue ou été kidnappée ! Tu as juste fuis pour réaliser tes rêves...";
      if (typeof text === "string" && text.trim() === hideRappelTrigger) {
        hideRappelIcon();
        return false; // non-bloquant
      }

      return false; // pas de blocage pour ce texte
    },
  };
})();
