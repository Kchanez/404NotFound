// Module de gestion de l'application de chat principal (#chat-app)
window.ChatAppAPI = {
  /**
   * Affiche l'application de chat principal
   */
  showChatApp: function() {
    const chatApp = document.getElementById('chat-app');
    if (!chatApp) return;

    console.log('[ChatAppAPI] Déclencheur chat principal – ouverture.');
    // Afficher le chat
    chatApp.classList.remove('hidden');
    chatApp.setAttribute('aria-hidden', 'false');
    chatApp.style.display = 'flex';

    // Masquer l'icône de notification de message
    // const messageNotifIcon = document.getElementById('message-notif-icon');
    // if (messageNotifIcon) {
    //   messageNotifIcon.classList.add('hidden');
    //   messageNotifIcon.classList.remove('attention-shake');
    // }

    // Cacher l'indication de clic pour continuer
    const hint = document.getElementById('dialogue-hint');
    if (hint) hint.style.display = 'none';

    // Configurer le bouton de fermeture
    const closeChatBtn = document.getElementById('close-window');
    if (closeChatBtn) {
      closeChatBtn.onclick = () => {
        console.log('[ChatAppAPI] Chat principal – fermeture.');
        chatApp.classList.add('hidden');
        chatApp.setAttribute('aria-hidden', 'true');
        chatApp.style.display = 'none';

        // Réafficher l'indication de clic
        const hint2 = document.getElementById('dialogue-hint');
        if (hint2) hint2.style.display = '';
      };
    }
  }
};