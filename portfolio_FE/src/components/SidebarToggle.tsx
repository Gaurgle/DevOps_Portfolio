// src/components/SidebarToggle.tsx
import React, { useEffect } from 'react';

const SidebarToggle: React.FC = () => {
    useEffect(() => {
        const setupSidebarToggle = () => {
            const sidebar = document.getElementById("sidebar");
            const toggleButton = document.getElementById("sidebar-toggle");
            const overlay = document.getElementById("sidebar-overlay");

            if (!sidebar || !toggleButton) return;

            const closeSidebar = () => {
                sidebar.classList.add("-translate-x-full");
                sidebar.setAttribute("aria-hidden", "true");
                overlay?.classList.add("hidden");
            };

            const toggleSidebar = () => {
                sidebar.classList.toggle("-translate-x-full");
                const isHidden = sidebar.classList.contains("-translate-x-full");
                sidebar.setAttribute("aria-hidden", isHidden.toString());
                overlay?.classList.toggle("hidden", isHidden);
            };

            toggleButton.removeEventListener('click', toggleSidebar);
            toggleButton.addEventListener('click', toggleSidebar);
            overlay?.removeEventListener('click', closeSidebar);
            overlay?.addEventListener('click', closeSidebar);

            return () => {
                toggleButton.removeEventListener('click', toggleSidebar);
                overlay?.removeEventListener('click', closeSidebar);
            };
        };

        const cleanup = setupSidebarToggle();
        document.addEventListener('astro:page-load', setupSidebarToggle);

        return () => {
            cleanup?.();
            document.removeEventListener('astro:page-load', setupSidebarToggle);
        };
    }, []);

    return (
        <>
            <div
                id="sidebar-overlay"
                className="hidden md:hidden fixed inset-0 z-30 bg-black/50"
            />
            <button
                id="sidebar-toggle"
                className="md:hidden fixed top-5 left-4 z-[90] p-2 rounded-lg
                 text-zinc-300 hover:text-zinc-200 transition-colors duration-200 focus:outline-none"
                aria-label="Toggle Sidebar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"
                     viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
            </button>
        </>
    );
};

export default SidebarToggle;