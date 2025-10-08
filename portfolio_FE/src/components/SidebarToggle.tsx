// src/components/SidebarToggle.tsx
import React, { useEffect } from 'react';

const SidebarToggle: React.FC = () => {
    useEffect(() => {
        const setupSidebarToggle = () => {
            const sidebar = document.getElementById("sidebar");
            const toggleButton = document.getElementById("sidebar-toggle");

            if (!sidebar || !toggleButton) return;

            const toggleSidebar = () => {
                // Toggle translate class directly
                sidebar.classList.toggle("-translate-x-full");

                // Update aria-hidden based on current state
                const isHidden = sidebar.classList.contains("-translate-x-full");
                sidebar.setAttribute("aria-hidden", isHidden.toString());
            };

            // Remove existing listeners to prevent multiple bindings
            toggleButton.removeEventListener('click', toggleSidebar);
            toggleButton.addEventListener('click', toggleSidebar);

            return () => {
                toggleButton.removeEventListener('click', toggleSidebar);
            };
        };

        // Initial setup
        const cleanup = setupSidebarToggle();

        // Add listener for view transitions
        document.addEventListener('astro:page-load', setupSidebarToggle);

        // Cleanup
        return () => {
            cleanup?.();
            document.removeEventListener('astro:page-load', setupSidebarToggle);
        };
    }, []);

    return (
        <button
            id="sidebar-toggle"
            className="md:hidden fixed top-5 left-4 z-[90] p-2 rounded-lg bg-gray-950 border border-black
             hover:bg-gray-800 focus:outline-none"
            aria-label="Toggle Sidebar"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"
                 viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
        </button>
    );
};

export default SidebarToggle;