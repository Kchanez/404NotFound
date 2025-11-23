document.addEventListener('DOMContentLoaded', () => {
    const hackedScreen = document.getElementById('hacked-screen');
    const closeErrorWindow = document.querySelector('.close-error-window');
    const ignoreErrorButton = document.getElementById('ignore-error');
    const respondErrorButton = document.getElementById('respond-error');

    window.isHackedScreenActive = false; // Initialize global state

    function showHackedScreen() {
        hackedScreen.classList.remove('hidden');
        window.isHackedScreenActive = true;
    }

    function hideHackedScreen() {
        hackedScreen.classList.add('hidden');
        window.isHackedScreenActive = false;
        try { document.dispatchEvent(new CustomEvent('hackedScreenClosed')); } catch(_) {}
        if (window.ChatAppAPI) window.ChatAppAPI.showChatApp();
    }

    // Event Listeners for buttons
    closeErrorWindow.addEventListener('click', hideHackedScreen);
    ignoreErrorButton.addEventListener('click', hideHackedScreen);
    respondErrorButton.addEventListener('click', hideHackedScreen);

    // Expose function to global scope if needed by visualNovel.js
    window.showHackedScreen = showHackedScreen;
    window.hideHackedScreen = hideHackedScreen;
});