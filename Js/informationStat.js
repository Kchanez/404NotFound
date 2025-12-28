document.addEventListener('DOMContentLoaded', () => {
    const informationStatWindow = document.getElementById('information-stat-window');
    const closeInformationStatWindowBtn = document.getElementById('close-information-stat-window-btn');

    if (closeInformationStatWindowBtn) {
        closeInformationStatWindowBtn.addEventListener('click', () => {
            if (informationStatWindow) {
                informationStatWindow.classList.add('hidden');
            }
        });
    }

    // Fonction pour ouvrir la fenêtre d'information (peut être appelée depuis d'autres scripts)
    window.openInformationStatWindow = () => {
        if (informationStatWindow) {
            informationStatWindow.classList.remove('hidden');
        }
    };

    // Pour l'instant, afficher la fenêtre au chargement pour le test
    if (informationStatWindow) {
        informationStatWindow.classList.remove('hidden');
    }
});