// Fonction pour mettre à jour l'horloge
function updateClock() {
  const now = new Date();
  const date = now.toLocaleDateString("fr-FR");
  const time = now.toLocaleTimeString("fr-FR");
  document.getElementById("header-clock").textContent = date + " " + time;
}

// Mettre à jour l'horloge immédiatement et ensuite toutes les secondes
updateClock();
setInterval(updateClock, 1000);
