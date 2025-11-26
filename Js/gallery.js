// Logique interactif de la galerie

document.addEventListener('visualNovelAPIReady', () => {
    console.log("gallery.js: visualNovelAPIReady event received. Initializing gallery...");
    initGallery();
});

function initGallery() {
    console.log("gallery.js: initGallery function called.");

    const folderItems = document.querySelectorAll('.folder-item');
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeButton = imageModal.querySelector('.close-button');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    let galleryImages = [];
    let currentImageIndex = 0;
    const countedImages = new Set(); // Pour suivre les images déjà comptées

// Collecter toutes les images de la galerie et initialiser les noms de dossier
folderItems.forEach((folder) => {
    const imgElement = folder.querySelector('img');
    const spanElement = folder.querySelector('.folder-name');

    if (imgElement && spanElement) {
        const imgSrc = imgElement.src;
        const fileNameWithExtension = imgSrc.split('/').pop();
        const fileName = fileNameWithExtension.split('.')[0];
        spanElement.textContent = fileName;
        galleryImages.push(imgSrc); // Ajouter l'URL de l'image au tableau

        imgElement.addEventListener('click', () => {
            const clickedFileName = fileName; // fileName est déjà défini plus haut
            const unknownImage = window.VisualNovelAPI.getUnknownImageFilename();

            if (unknownImage && clickedFileName === unknownImage && !countedImages.has(clickedFileName)) {
                window.VisualNovelAPI.setIsGalleryClickable(true);
                const currentCount = window.VisualNovelAPI.getGalleryViewCount();
                window.VisualNovelAPI.setGalleryViewCount(currentCount + 1);
                countedImages.add(clickedFileName); // Ajouter l'image au Set des images comptées
                console.log("Image correspondante cliquée ! isGalleryClickable =", window.VisualNovelAPI.getIsGalleryClickable(), "galleryViewCount =", window.VisualNovelAPI.getGalleryViewCount());
            } else if (unknownImage && clickedFileName === unknownImage && countedImages.has(clickedFileName)) {
                console.log("Image correspondante déjà comptée.");
            } else {
                console.log("Image cliquée ne correspond pas ou aucune image inconnue définie.");
            }

            if (!window.VisualNovelAPI.getIsGalleryClickable()) {
                alert("La galerie n'est pas encore accessible. Trouvez l'image envoyée par l'inconnu !");
            }
        });

        imgElement.addEventListener('dblclick', () => {
            if (window.VisualNovelAPI.getIsGalleryClickable()) {
                currentImageIndex = galleryImages.indexOf(imgSrc);
                showImage(currentImageIndex);
                imageModal.classList.remove('hidden');
                imageModal.style.display = 'flex';
            } else {
                alert("La galerie n'est pas encore accessible. Trouvez l'image envoyée par l'inconnu pour l'activer !");
            }
        });
    }

    folder.addEventListener('click', () => {
        const folderName = folder.dataset.folder;
        console.log(`Clic sur le dossier : ${folderName}`);
        // Placeholder pour la logique future :
        // - Charger les photos du dossier ${folderName}
        // - Afficher les photos dans la galerie
        // - Mettre à jour le compteur de galerie si nécessaire
    });
});

    // Fonction pour afficher une image spécifique dans la modale
    function showImage(index) {
        if (index < 0) {
            currentImageIndex = galleryImages.length - 1; // Revenir à la dernière image
        } else if (index >= galleryImages.length) {
            currentImageIndex = 0; // Revenir à la première image
        } else {
            currentImageIndex = index;
        }
        modalImage.src = galleryImages[currentImageIndex];
    }

    // Fonctions pour naviguer
    function nextImage() {
        showImage(currentImageIndex + 1);
    }

    function prevImage() {
        showImage(currentImageIndex - 1);
    }

    // Écouteurs d'événements pour les boutons de navigation
    prevButton.addEventListener('click', prevImage);
    nextButton.addEventListener('click', nextImage);

    // Gérer la fermeture de la fenêtre modale
    closeButton.addEventListener('click', () => {
        imageModal.classList.add('hidden');
        imageModal.style.display = 'none';
    });

    // Fermer la modale si l'utilisateur clique en dehors de l'image
    imageModal.addEventListener('click', (event) => {
        if (event.target === imageModal) {
            imageModal.classList.add('hidden');
            imageModal.style.display = 'none';
        }
    });
}