document.addEventListener("DOMContentLoaded", () => {
  const pages = document.querySelectorAll(".page");
  let currentPageIndex = 0; // Start with the first page

  // Ensure only the first page is active initially
  pages.forEach((page, index) => {
    if (index === 0) {
      page.classList.add("active");
    } else {
      page.classList.remove("active");
    }
  });

  pages.forEach((page, index) => {
    page.addEventListener("click", () => {
      // Remove 'active' class from the current page
      pages[currentPageIndex].classList.remove("active");

      // If it's the last page (index 5 for page 6), close the window
      if (currentPageIndex === pages.length - 1) {
        if (window.VisualNovelAPI && window.VisualNovelAPI.hideInternet) {
          window.VisualNovelAPI.hideInternet();
          currentPageIndex = 0; // Reset to the first page for next opening
          pages[0].classList.add("active"); // Make sure the first page is active
        }
      } else {
        // Move to the next page
        currentPageIndex = (currentPageIndex + 1) % pages.length;
        // Add 'active' class to the new current page
        pages[currentPageIndex].classList.add("active");
      }
    });
  });
});
