// src/scripts/sidebar-toggle.ts
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("sidebarToggle");

    if (!sidebar || !toggleButton) return;

    const setState = (open: boolean) => {
        if (open) {
            sidebar.classList.remove("-translate-x-full");
            sidebar.setAttribute("aria-hidden", "false");
        } else {
            sidebar.classList.add("-translate-x-full");
            sidebar.setAttribute("aria-hidden", "true");
        }
    };

    // Initial: closed on mobile, open on desktop
    const mq = window.matchMedia("(min-width: 768px)");
    setState(mq.matches);

    mq.addEventListener("change", (e) => setState(e.matches));

    toggleButton.addEventListener("click", () => {
        const isHidden = sidebar.getAttribute("aria-hidden") === "true";
        setState(isHidden);
    });
});