function updateTimestamp() {
  const dateElem = document.querySelector(".timestamp span:nth-child(1)");
  const timeElem = document.querySelector(".timestamp span:nth-child(2)");

  const now = new Date();

  // Format date
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  // Format time
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  dateElem.textContent = `${day} . ${month} . ${year}`;
  timeElem.textContent = `${hours} : ${minutes} : ${seconds}`;
}

function goToIndex() {
  window.location.href = "ecranVeille.html";
}

// Mise à jour chaque seconde
setInterval(updateTimestamp, 1000);
updateTimestamp(); // Première exécution

// Pour plus tard => interactions
console.log("Screen loaded");

setTimeout(() => {
  // cacher l'écran de veille
  document.querySelector(".screen").classList.add("hidden");

  // afficher l'écran disparition
  const disp = document.getElementById("disparition-screen");
  disp.classList.remove("hidden");

  // jouer le son CRT
  const crtSound = document.getElementById("crtSound");
  if (crtSound) {
    crtSound.currentTime = 0;
    crtSound.volume = 0.9; // ajuste le volume si besoin
    crtSound
      .play()
      .catch((e) => console.log("Son bloqué par le navigateur :", e));
  }
}, 5000);

// Après 15 secondes, afficher le message du gouvernement
setTimeout(() => {
  // cacher la fiche de disparition
  document.getElementById("disparition-screen").classList.add("hidden");

  // afficher le message gouvernemental
  const msg = document.getElementById("message-gouv");
  msg.classList.remove("hidden");

  // réinitialisation facultative du son CRT
  const crtSound = document.getElementById("crtSound");
  if (crtSound) {
    crtSound.currentTime = 0;
    crtSound.play().catch(() => {});
  }
}, 15000);

// Après 15 secondes, afficher la page de début du jeu
setTimeout(() => {
  // cacher la fiche de disparition
  document.getElementById("disparition-screen").classList.add("hidden");

  // cacher le msg du gouvernement
  document.getElementById("message-gouv").classList.add("hidden");

  // afficher la page de début du jeu
  goToIndex();
}, 27000);
