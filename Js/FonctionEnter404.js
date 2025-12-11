// Fonction pour vérifier le code et rediriger
document.addEventListener('DOMContentLoaded', function() {
    const codeInput = document.getElementById('enter');
    const errorMessage = document.getElementById('error-message');
    
    // Fonction pour vérifier le code
    function checkCode() {
        const code = codeInput.value.trim();
        
        if (code === '404') {
            // Redirection vers la page de jeu
            window.location.href = 'visualNovel.html';
        } else {
            // Afficher le message d'erreur
            errorMessage.style.display = 'flex';
            errorMessage.style.alignItems = 'center';
            errorMessage.style.justifyContent = 'center';
            errorMessage.style.width = '30%';
            errorMessage.style.height = '50px';
            errorMessage.style.color = 'red';
           errorMessage.style.marginTop = '5px';
            errorMessage.style.fontSize = '20px';
            codeInput.value = '';
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 3000);
        }
    }
    // Événement pour la touche Entrée
    codeInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            checkCode();
        }
    });
});