// public/js/sidebar-toggle.js
function init() {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("sidebar-toggle");
    if (!sidebar || !toggleButton) return;

    const setState = (open) => {
        if (open) {
            sidebar.classList.remove("-translate-x-full");
            sidebar.setAttribute("aria-hidden", "false");
        } else {
            sidebar.classList.add("-translate-x-full");
            sidebar.setAttribute("aria-hidden", "true");
        }
    };

    const mq = window.matchMedia("(min-width: 768px)");
    setState(mq.matches);
    mq.addEventListener("change", (e) => setState(e.matches));

    toggleButton.addEventListener("click", () => {
        const isHidden = sidebar.getAttribute("aria-hidden") === "true";
        setState(isHidden);
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}