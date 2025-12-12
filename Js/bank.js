document.addEventListener("DOMContentLoaded", () => {
  const closeButton = document.querySelector(".closeB");
  const windowContainer = document.querySelector(".window-container");

  if (closeButton && windowContainer) {
    closeButton.addEventListener("click", () => {
      windowContainer.style.display = "none";
    });
  }

  const sendButton = document.querySelector(".send-button");
  if (sendButton) {
    sendButton.addEventListener("click", () => {
      const windowContent = windowContainer.querySelector(".window-content");
      if (windowContent) {
        windowContent.innerHTML = ""; // Efface le contenu actuel
        const img = document.createElement("img");
        img.src = "./Images/VirementEnvoyer.svg";
        img.alt = "Virement envoyé";
        img.style.display = "block"; 
        img.style.margin = "40px auto 0px"; 
        img.style.maxWidth = "80%"; 
        img.style.height = "auto"; 
        
        windowContent.appendChild(img);
        const message = document.createElement("p");
        message.textContent = "Votre virement a bien été envoyé à Sam LEGRAND";
        message.style.textAlign = "center";
        message.style.marginTop = "10px";
        message.style.fontSize = "1.2em";
        windowContent.appendChild(message);
      }
    });
  }
});
