document.addEventListener("DOMContentLoaded", () => {
  const informationStatWindow = document.getElementById(
    "information-stat-window"
  );
  const closeInformationStatWindowBtn = document.getElementById(
    "close-information-stat-window-btn"
  );

  if (closeInformationStatWindowBtn) {
    closeInformationStatWindowBtn.addEventListener("click", () => {
      if (informationStatWindow) {
        informationStatWindow.classList.add("hidden");
      }
    });
  }

  // Page navigation logic
  const pages = document.querySelectorAll(".page-info");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const endGameOverlay = document.getElementById("end-game-overlay");
  const endGameScreen = document.getElementById("end-game-screen");
  const restartGameBtn = document.getElementById("restart-game-btn");
  const pageTitle = document.getElementById("page-title");

  let currentPageIndex = 0;
  const pageTitles = [
    "Images IA vs réalité : attention aux arnaques",
    "Arnaques par audio IA : attention aux voix clonées",
    "Fraude bancaire : phishing et smishing",
  ];

  function showPage(index) {
    pages.forEach((page, i) => {
      page.style.display = i === index ? "block" : "none";
    });
    pageTitle.textContent = pageTitles[index];
    currentPageIndex = index;
    updateNavigationButtons();
  }

  function updateNavigationButtons() {
    prevBtn.disabled = currentPageIndex === 0;
    // Garde nextBtn activé sur la dernière page pour déclencher l'écran de fin
    nextBtn.disabled = false;
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentPageIndex > 0) {
        showPage(currentPageIndex - 1);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentPageIndex < pages.length - 1) {
        showPage(currentPageIndex + 1);
      } else {
        // Cacher la fenêtre des statistiques et afficher l'écran de fin de jeu
        if (informationStatWindow) {
          informationStatWindow.style.display = "none";
        }
        if (endGameScreen) {
          endGameScreen.style.display = "block";
          endGameScreen.classList.add("active");
          if (endGameOverlay) {
            endGameOverlay.style.display = "block";
            const internetIcon = document.getElementById("internet-icon");
            if (internetIcon) {
              internetIcon.classList.remove("disabled");
              internetIcon.classList.add("active");
            }
            // Activer toutes les icônes d'application
            const appIcons = document.querySelectorAll(".app-icon");
            appIcons.forEach((icon) => {
              icon.classList.remove("disabled");
              icon.classList.add("active");
              icon.removeAttribute("aria-disabled");
            });
          }
        }
        nextBtn.disabled = true; // Désactive le bouton après le clic sur la dernière page
      }
    });
  }

  if (restartGameBtn) {
    restartGameBtn.addEventListener("click", () => {
      if (endGameOverlay) {
        endGameOverlay.style.display = "none";
      }
      window.location.href = "index.html";
    });
  }
  showPage(0);

  // Camembert — Images IA vs réelles
  new Chart(document.getElementById("aiImageChart"), {
    type: "pie",
    data: {
      labels: ["Détection correcte (62 %)", "Erreur / confusion (38 %)"],
      datasets: [
        {
          data: [62, 38],
          color: "#000",
          backgroundColor: ["#4CAF50", "#FFC107"],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#000" },
        },
      },
    },
  });

  // Bar chart — Pertes financières
  new Chart(document.getElementById("scamMoneyChart"), {
    type: "bar",
    data: {
      labels: ["Célébrités (35 M$)", "Romance (46 M$)"],
      datasets: [
        {
          label: "Pertes financières (en millions $)",
          data: [35, 46],
          backgroundColor: ["#FF5722", "#673AB7"],
        },
      ],
    },
    options: {
      indexAxis: "y", // Pour un graphique à barres horizontal
      scales: {
        x: {
          beginAtZero: true,
          ticks: { color: "#000" },
        },
        y: {
          ticks: { color: "#000" },
        },
      },
      plugins: {
        legend: { display: false },
      },
    },
  });

  // Chart.js for audioPieChart
  new Chart(document.getElementById("audioPieChart"), {
    type: "bar", // Changement en graphique à barres
    data: {
      labels: ["Ciblés (30%)", "Non ciblés (70%)"],
      datasets: [
        {
          data: [30, 70],
          backgroundColor: ["#E91E63", "#00BCD4"],
        },
      ],
    },
    options: {
      indexAxis: "y", // Pour un graphique à barres horizontal
      scales: {
        x: {
          beginAtZero: true,
          ticks: { color: "#000" },
        },
        y: {
          ticks: { color: "#000" },
        },
      },
      plugins: {
        legend: { display: false }, // Désactiver la légende
      },
    },
  });

  // Chart.js for audioPieChart1 (version Doughnut Chart)
  new Chart(document.getElementById("audioPieChart1"), {
    type: "doughnut", // Changement de type en 'doughnut'
    data: {
      labels: [
        "Vishing (voix proches) 40%",
        "Vishing (fausses institutions) 35%",
        "Vishing émotionnel/autres 25%",
      ],
      datasets: [
        {
          data: [40, 35, 25],
          backgroundColor: ["#FFEB3B", "#8BC34A", "#FF9800"], // Couleurs conservées
          hoverOffset: 4, // Ajoute un petit effet au survol
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom", // Position de la légende conservée
          labels: { color: "#000" },
        },
        tooltip: {
          // Configuration des infobulles pour afficher les valeurs et pourcentages
          callbacks: {
            label: function (context) {
              let label = context.label || "";
              if (label) {
                label += ": ";
              }
              const value = context.raw;
              const total = context.dataset.data.reduce(
                (acc, current) => acc + current,
                0
              );
              const percentage = ((value / total) * 100).toFixed(2) + "%";
              return label + " (" + percentage + ")";
            },
          },
        },
      },
      // Options spécifiques au graphique en anneau
      cutout: "50%", // Définit la taille du trou central (ici 70% du rayon)
    },
  });

  // Chart.js for bankFraudPieChart
  new Chart(document.getElementById("fraudTypePieChart"), {
    type: "bar", // Changement en graphique à barres
    data: {
      labels: ["Phishing & Smishing", "Faux conseillers", "Autres fraudes"],
      datasets: [
        {
          data: [52, 32, 16],
          label: "Pourcentage de fraudes", // Ajout d'un label pour la légende
          backgroundColor: ["#FF5722", "#4CAF50", "#2196F3"],
        },
      ],
    },
    options: {
      indexAxis: "y", // Pour un graphique à barres horizontal
      scales: {
        x: {
          beginAtZero: true,
          ticks: { color: "#000" },
        },
        y: {
          ticks: { color: "#000" },
        },
      },
      plugins: {
        legend: { display: false }, // Désactiver la légende
      },
    },
  });

  // Chart.js for fakeAdvisorBarChart (version Doughnut Chart)
  new Chart(document.getElementById("fakeAdvisorBarChart"), {
    type: "doughnut", // Changement de type en 'doughnut'
    data: {
      labels: [
        "Faux conseillers / manipulation",
        "Arnaques Bitcoin / crypto",
        "Autres fraudes en ligne",
      ],
      datasets: [
        {
          label: "Montants perdus (en milliards €)",
          data: [1.2, 2, 0.8],
          backgroundColor: ["#FFC107", "#9C27B0", "#4CAF50"],
          hoverOffset: 4, // Ajoute un petit effet au survol
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top", // Position de la légende
        },
        title: {
          display: true,
          text: "Répartition des montants perdus par type de fraude", // Titre du graphique
        },
      },
      // Vous pouvez ajouter des options spécifiques au graphique en anneau ici
      cutout: "50%",
    },
  });

  // Fonction pour ouvrir la fenêtre d'information (peut être appelée depuis d'autres scripts)
  window.openInformationStatWindow = () => {
    if (informationStatWindow) {
      informationStatWindow.classList.remove("hidden");
    }
  };

  // Pour l'instant, afficher la fenêtre au chargement pour le test
});
