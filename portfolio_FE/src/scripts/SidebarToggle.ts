// src/scripts/SidebarToggle.ts
function initSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('sidebarToggle') as HTMLButtonElement | null;

    if (!sidebar || !toggleButton) {
        console.warn('[SidebarToggle] sidebar or button not found');
        return;
    }

    const setState = (open: boolean) => {
        if (open) {
            sidebar.classList.remove('-translate-x-full');
            sidebar.setAttribute('aria-hidden', 'false');
            toggleButton.textContent = 'Close Menu';
        } else {
            sidebar.classList.add('-translate-x-full');
            sidebar.setAttribute('aria-hidden', 'true');
            toggleButton.textContent = 'Open Menu';
        }
    };

    // Open on ≥ md (768px), closed on mobile
    const mq = window.matchMedia('(min-width: 768px)');
    setState(mq.matches);
    mq.addEventListener('change', (e) => setState(e.matches));

    toggleButton.addEventListener('click', () => {
        const isHidden = sidebar.getAttribute('aria-hidden') === 'true';
        setState(isHidden);
    });
}

// Run after DOM is ready (safe even with script at end of <body>)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebarToggle);
} else {
    initSidebarToggle();
}
console.log('[SidebarToggle] script loaded');