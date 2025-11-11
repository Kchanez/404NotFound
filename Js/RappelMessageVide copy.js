// RappelMessageVide.js - gestion du rappel pour message vide
// Affiche une icône de notification et joue un son sans bloquer la progression de l'histoire

(function () {
  let notificationIcon = null;
  let notificationSound = null;

  function createNotificationElements() {
    // Créer l'icône de notification si elle n'existe pas
    if (!notificationIcon) {
      notificationIcon = document.createElement('img');
      notificationIcon.id = 'notification-message-vide-icon';
      notificationIcon.src = 'Images/NotifMess.svg';
      notificationIcon.alt = 'Notification de message';
      notificationIcon.title = 'Notification de message vide';
        notificationIcon.classList.add('hidden');
        // Cachée par défaut
        notificationIcon.classList.add('attention-shake');
      notificationIcon.style.cssText = `
        position: absolute;
        bottom: 75%;
        right: 1%;
        transform: translateY(-50%);
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 15;
        border-radius: 10px;
        max-width: 20%;
      `;
      document.body.appendChild(notificationIcon);

      notificationIcon.onclick = () => {
        hideNotification();
      };
    }

    // Créer l'élément audio si il n'existe pas
    if (!notificationSound) {
      notificationSound = document.createElement('audio');
      notificationSound.id = 'notification-message-vide-sound';
      notificationSound.src = 'Audios/notification.mp3'; // Utiliser un son de notification existant
      document.body.appendChild(notificationSound);
    }
  }

  function showNotification() {
    createNotificationElements(); // S'assurer que les éléments existent

    notificationIcon.classList.remove('hidden');
    notificationIcon.classList.add('attention-shake'); // Ajouter une animation si nécessaire
    notificationSound.currentTime = 0;
    notificationSound.play().catch(error => console.error("Erreur lecture son notification:", error));

    // Cacher le dialogue hint temporairement
    const dialogueHint = document.getElementById('dialogue-hint');
    if (dialogueHint) {
      dialogueHint.style.display = 'none';
    }

    // Masquer automatiquement la notification après 3 secondes si pas de clic
    setTimeout(hideNotification, 3000);
  }

  function hideNotification() {
    if (notificationIcon) {
      notificationIcon.classList.add('hidden');
      notificationIcon.classList.remove('attention-shake');
    }
    if (notificationSound) {
      notificationSound.pause();
      notificationSound.currentTime = 0;
    }
    // Rétablir le dialogue hint
    const dialogueHint = document.getElementById('dialogue-hint');
    if (dialogueHint) {
      dialogueHint.style.display = '';
    }
  }

  window.RappelMessageVideAPI = {
    reset: () => {
      hideNotification();
    },
    handleDialogue: (text) => {
      // Détecter le message vide
      if (typeof text === 'string' && text.trim() === '') {
        showNotification();
        return true; // Indique que le rappel est actif
      }
      return false; // Pas de rappel
    },
  };
})();