document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    let currentPageIndex = 0; // Start with the first page

    // Ensure only the first page is active initially
    pages.forEach((page, index) => {
        if (index === 0) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });

    pages.forEach((page, index) => {
        page.addEventListener('click', () => {
            // Remove 'active' class from the current page
            pages[currentPageIndex].classList.remove('active');

            // Move to the next page, or loop back to the first page
            currentPageIndex = (currentPageIndex + 1) % pages.length;

            // Add 'active' class to the new current page
            pages[currentPageIndex].classList.add('active');
        });
    });
});