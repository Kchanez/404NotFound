document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('playButton');
    const typingAudio = document.getElementById('typingAudio');
    const timeDisplay = document.getElementById('timeDisplay');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');

    let isPlaying = false;

    // Fonction pour formater le temps (MM:SS)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    // Mettre à jour l'affichage du temps et la barre de progression
    function updateProgress() {
        const duration = typingAudio.duration;
        const currentTime = typingAudio.currentTime;

        if (isNaN(duration)) {
            timeDisplay.textContent = '00:00';
            progressFill.style.width = '0%';
            return;
        }

        timeDisplay.textContent = formatTime(currentTime);
        const progressPercent = (currentTime / duration) * 100;
        progressFill.style.width = `${progressPercent}%`;
    }

    // Gérer le clic sur le bouton de lecture
    playButton.addEventListener('click', () => {
        if (isPlaying) {
            typingAudio.pause();
            isPlaying = false;
            // Changer l'icône en triangle (play)
            playButton.innerHTML = '<div class="play-triangle"></div>';
        } else {
            typingAudio.play();
            isPlaying = true;
            // Changer l'icône en deux barres (pause)
            playButton.innerHTML = '<div class="pause-bar"></div><div class="pause-bar"></div>';
        }
    });

    // Événements audio
    typingAudio.addEventListener('timeupdate', updateProgress);
    typingAudio.addEventListener('loadedmetadata', updateProgress); // Mettre à jour dès que les métadonnées sont chargées
    typingAudio.addEventListener('ended', () => {
        isPlaying = false;
        playButton.innerHTML = '<div class="play-triangle"></div>'; // Revenir à l'icône play
        typingAudio.currentTime = 0; // Remettre à zéro
        updateProgress(); // Mettre à jour l'affichage
    });

    // Styles pour l'icône pause (à ajouter dans audio_player.css)
    const style = document.createElement('style');
    style.innerHTML = `
        .pause-bar {
            width: 4px;
            height: 16px;
            background-color: #003366;
            margin: 0 2px;
        }
    `;
    document.head.appendChild(style);
});
