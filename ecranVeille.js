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

// Mise à jour chaque seconde
setInterval(updateTimestamp, 1000);
updateTimestamp(); // Première exécution

// Pour plus tard => interactions
console.log("Screen loaded");
