// RappelMessageVide.js - gestion du rappel pour message vide
// Affiche une icône de notification et joue un son sans bloquer la progression de l'histoire

(function () {
  let notificationSound = null;

  // Créer l'élément audio si il n'existe pas
  if (!notificationSound) {
    notificationSound = document.createElement('audio');
    notificationSound.id = 'notification-message-vide-sound';
    notificationSound.src = 'Audios/notification.mp3'; // Utiliser un son de notification existant
    document.body.appendChild(notificationSound);
  }

  function showNotification() {
    const notificationIcon = document.getElementById('message-notif-icon');
    if (!notificationIcon) {
      console.error("L'icône de notification de message (message-notif-icon) est introuvable.");
      return;
    }

    notificationIcon.src = 'Images/NotifMess.svg';
    notificationIcon.alt = 'Notification de message';
    notificationIcon.title = 'Notification de message vide';
    notificationIcon.classList.remove('hidden');
    notificationSound.currentTime = 0;
    notificationSound.play().catch(error => console.error("Erreur lecture son notification:", error));

    // Cacher le dialogue hint temporairement
    const dialogueHint = document.getElementById('dialogue-hint');
    if (dialogueHint) {
      dialogueHint.style.display = 'none';
    }

    // Masquer automatiquement la notification après 3 secondes si pas de clic
    // setTimeout(hideNotification, 3000); // Cette ligne est commentée pour que l'icône reste
  }

  function hideNotification() {
    const notificationIcon = document.getElementById('message-notif-icon');
    if (notificationIcon && notificationIcon.src.includes('Images/NotifMess.svg')) {
      notificationIcon.classList.add('hidden');
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