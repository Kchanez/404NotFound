

// Calendrier.js — petit calendrier simple, dans le style du jeu
let currentCalendarDate = new Date();
let calendarEvents = [];
let disableOnNextIconClick = false;

document.addEventListener("DOMContentLoaded", () => {
  const icon = document.getElementById("calendar-icon");
  if (!icon) return;

  // Ne pas activer l'icône automatiquement; sera activée via le rappel.
  icon.setAttribute("aria-disabled", "true");

  // Créer le widget au chargement, caché par défaut.
  const { container, title, grid, prev, next } = createCalendarWidget();
  document.getElementById("novel-container").appendChild(container);

  // Ouvrir/fermer au clic sur l'icône (fonctionnera une fois activée).
  icon.addEventListener("click", () => {
    // Ignorer si désactivé
    if (icon.classList.contains("disabled") || icon.getAttribute("aria-disabled") === "true") {
      return;
    }
    toggleCalendar(container, true);
  });

  // Navigation mois précédent/suivant
  prev.addEventListener("click", () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendar(currentCalendarDate, title, grid);
  });
  next.addEventListener("click", () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendar(currentCalendarDate, title, grid);
  });


  // Exposer une API simple pour le Visual Novel
  window.CalendarAPI = {
    enableCalendar: (disableOnClick = false) => {
      icon.classList.remove("disabled");
      icon.classList.add("active");
      icon.setAttribute("aria-disabled", "false");
      if (disableOnClick === true) {
        disableOnNextIconClick = true;
      }
    },
    openCalendar: () => {
      toggleCalendar(container, true);
    },
    addEvent: (year, monthIndex, day, label = "Événement") => {
      calendarEvents.push({ year, month: monthIndex, day, label });
      // Re-render si on est sur le même mois/année
      const v = currentCalendarDate;
      if (v.getFullYear() === year && v.getMonth() === monthIndex) {
        renderCalendar(currentCalendarDate, title, grid);
      }
    },
    disableCalendar: () => {
      icon.classList.add("disabled");
      icon.classList.remove("active");
      icon.setAttribute("aria-disabled", "true");
      disableOnNextIconClick = false;
    },
  };
});

function createCalendarWidget() {
  const container = document.createElement("div");
  container.id = "calendar-widget";
  container.setAttribute("aria-hidden", "true");
  // Style inspiré des composants existants (fond #EDE1B3, bordure noire)
  Object.assign(container.style, {
    position: "fixed",
    top: "20%",
    right: "40%",
    width: "330px",
    background: "#c0c0c0",
    border: "3px solid #000",
    borderRadius: "12px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.25)",
    zIndex: "2500",
    display: "none",
    fontFamily: "Courier Prime, monospace",
    color: "#000",
  });

  const header = document.createElement("div");
  Object.assign(header.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    borderBottom: "3px solid #000",
    fontWeight: "bold",
  });
  const prev = document.createElement("button");
  prev.textContent = "◀";
  Object.assign(prev.style, {
    border: "2px solid #000",
    background: "#fff",
    borderRadius: "8px",
    padding: "2px 8px",
    cursor: "pointer",
  });
  header.appendChild(prev);

  const title = document.createElement("span");
  title.id = "calendar-title";
  header.appendChild(title);

  const next = document.createElement("button");
  next.textContent = "▶";
  Object.assign(next.style, {
    border: "2px solid #000",
    background: "#fff",
    borderRadius: "8px",
    padding: "2px 8px",
    cursor: "pointer",
  });
  header.appendChild(next);

  const close = document.createElement("span");
  close.textContent = "×";
  close.title = "Fermer";
  close.style.cursor = "pointer";
  close.addEventListener("click", () => {
    toggleCalendar(container, false);

  });
  header.appendChild(close);

  const body = document.createElement("div");
  Object.assign(body.style, {
    padding: "10px 12px",
  });

  const weekdays = document.createElement("div");
  Object.assign(weekdays.style, {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "6px",
    marginBottom: "8px",
  });
  ["L", "M", "M", "J", "V", "S", "D"].forEach((d) => {
    const cell = document.createElement("div");
    cell.textContent = d;
    Object.assign(cell.style, {
      textAlign: "center",
      fontWeight: "bold",
    });
    weekdays.appendChild(cell);
  });

  const grid = document.createElement("div");
  grid.id = "calendar-grid";
  Object.assign(grid.style, {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "6px",
  });

  body.appendChild(weekdays);
  body.appendChild(grid);

  container.appendChild(header);
  container.appendChild(body);

  renderCalendar(currentCalendarDate, title, grid);
  return { container, title, grid, prev, next };
}

function renderCalendar(date, titleEl, gridEl) {
  // Définir le mois et l'année
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  const year = date.getFullYear();
  const month = date.getMonth();
  titleEl.textContent = `${months[month]} ${year}`;

  // Calcul du premier jour du mois et du nombre de jours
  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Lundi=0 ... Dimanche=6
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Vider la grille
  gridEl.innerHTML = "";

  // Cases vides avant le 1er
  for (let i = 0; i < startWeekday; i++) {
    const empty = document.createElement("div");
    gridEl.appendChild(empty);
  }

  // Remplir les jours
  const today = new Date();
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement("div");
    cell.textContent = String(d);
    Object.assign(cell.style, {
      textAlign: "center",
      padding: "8px",
      background: "#fff",
      border: "2px solid #000",
      borderRadius: "8px",
      cursor: "default",
    });
    // Surbrillance pour aujourd'hui
    if (
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      cell.style.background = "#e6ffe1";
    }

    // Indication d'événement (par ex. Examen de Math)
    const hasEvent = calendarEvents.some(
      (e) => e.year === year && e.month === month && e.day === d
    );
    if (hasEvent) {
      cell.style.background = "#ffe7e7";
      cell.style.borderColor = "#d33";
      cell.style.boxShadow = "0 0 0 2px #d33 inset";
      const ev = calendarEvents.find(
        (e) => e.year === year && e.month === month && e.day === d
      );
      if (ev) {
        cell.title = ev.label;
      }
    }
    gridEl.appendChild(cell);
  }
}

let autoCloseTimeout;

function toggleCalendar(container, show) {
  if (show) {
    container.style.display = "block";
    container.setAttribute("aria-hidden", "false");
    // Définir un minuteur pour fermer automatiquement après 2 secondes
    autoCloseTimeout = setTimeout(() => {
      container.style.display = "none";
      container.setAttribute("aria-hidden", "true");
    }, 2000); // 2000 ms = 2 secondes
  } else {
    container.style.display = "none";
    container.setAttribute("aria-hidden", "true");
    // Annuler le minuteur si le calendrier est fermé manuellement
    clearTimeout(autoCloseTimeout);
  }
}
