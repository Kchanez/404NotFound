// Logique interactif de la galerie

// Gérer le clic sur les dossiers (préparé pour l'ajout de photos ultérieur)
const folderItems = document.querySelectorAll('.folder-item');

folderItems.forEach(folder => {
    folder.addEventListener('click', () => {
        const folderName = folder.dataset.folder;
        console.log(`Clic sur le dossier : ${folderName}`);
        // Placeholder pour la logique future :
        // - Charger les photos du dossier ${folderName}
        // - Afficher les photos dans la galerie
        // - Mettre à jour le compteur de galerie si nécessaire
        alert(`Dossier ${folderName} sélectionné. Vous pourrez ajouter des photos ici ultérieurement.`);
    });
})