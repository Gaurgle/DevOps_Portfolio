export function initSidebarToggle() {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("sidebarToggle"); // <-- id must match

    if (!sidebar || !toggleButton) return;

    const iconHamburger = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
         viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"/>
    </svg>`;
    const iconClose = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
         viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M6 18L18 6M6 6l12 12"/>
    </svg>`;

    function setState(open: boolean) {
        if (open) {
            sidebar.classList.remove("-translate-x-full");
            sidebar.setAttribute("aria-hidden", "false");
            toggleButton.innerHTML = iconClose;
        } else {
            sidebar.classList.add("-translate-x-full");
            sidebar.setAttribute("aria-hidden", "true");
            toggleButton.innerHTML = iconHamburger;
        }
    }

    // Initial: closed on mobile, open on desktop
    const mq = window.matchMedia("(min-width: 768px)");
    setState(mq.matches); // true on desktop, false on mobile

    // Keep state in sync across breakpoint
    mq.addEventListener("change", (e) => setState(e.matches));

    // Toggle on click
    toggleButton.addEventListener("click", () => {
        const isHidden = sidebar.getAttribute("aria-hidden") === "true";
        setState(isHidden);
    });
}

// Optional: auto-init if you import as a module file
initSidebarToggle();