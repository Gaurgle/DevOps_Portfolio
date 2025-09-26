export function SidebarToggle() {
    document.addEventListener("DOMContentLoaded", () => {
        const sidebar = document.getElementById("sidebar");
        const toggleButton = document.getElementById("sidebarToggle");

        if (sidebar && toggleButton) {
            toggleButton.addEventListener("click", () => {
                const isHidden = sidebar.getAttribute("aria-hidden") === "true";

                if (isHidden) {
                    sidebar.classList.remove("-translate-x-full");
                    sidebar.setAttribute("aria-hidden", "false");
                    toggleButton.innerText = "Close Menu";
                } else {
                    sidebar.classList.add("-translate-x-full");
                    sidebar.setAttribute("aria-hidden", "true");
                    toggleButton.innerText = "Open Menu";
                }
            });
        }
    });
}