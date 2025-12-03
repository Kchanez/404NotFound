document.addEventListener('DOMContentLoaded', () => {
    const closeButton = document.querySelector('.close-button');
    const windowContainer = document.querySelector('.window-container');

    if (closeButton && windowContainer) {
        closeButton.addEventListener('click', () => {
            windowContainer.style.display = 'none';
        });
    }

    const sendButton = document.querySelector('.send-button');
    if (sendButton) {
        sendButton.addEventListener('click', () => {
            alert('Demande d\'argent envoyée !');
            windowContainer.style.display = 'none';
        });
    }
});