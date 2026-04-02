import { useEffect } from 'react';

export default function EasterEggs() {
    useEffect(() => {
        const onRmRf = () => {
            document.body.classList.add('rm-rf-glitch');
            setTimeout(() => document.body.classList.remove('rm-rf-glitch'), 2000);
        };

        // Always start with CRT mode off
        localStorage.removeItem('crt-mode');
        document.body.classList.remove('crt-mode');

        // Swap view-transition CSS based on CRT mode before each navigation
        const vtStyle = document.createElement('style');
        vtStyle.id = 'vt-transitions';
        document.head.appendChild(vtStyle);

        function applyTransitionStyle() {
            const crt = document.body.classList.contains('crt-mode');
            vtStyle.textContent = crt
                ? `::view-transition-old(root){animation:crt-out .2s ease-out both!important}::view-transition-new(root){animation:crt-in .35s ease-in both!important;animation-delay:.22s!important}`
                : `::view-transition-old(root){animation:term-out .1s ease-out both!important}::view-transition-new(root){animation:term-in .2s ease-in both!important;animation-delay:.12s!important}`;
        }
        applyTransitionStyle();

        const onBeforePrep = () => applyTransitionStyle();
        document.addEventListener('astro:before-preparation', onBeforePrep);

        window.addEventListener('rm-rf', onRmRf);

        console.log(
            '%c' +
            '██████╗  ██████╗  ██████╗ ███████╗\n' +
            '██╔══██╗██╔═══██╗██╔═══██╗██╔════╝\n' +
            '██████╔╝██║   ██║██║   ██║███████╗\n' +
            '██╔══██╗██║   ██║██║   ██║╚════██║\n' +
            '██║  ██║╚██████╔╝╚██████╔╝███████║\n' +
            '╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚══════╝',
            'color: #a6e3a1; font-family: monospace; font-size: 10px;'
        );
        console.log('%c👋 hiring? → larsnilsandreas@pm.me', 'color: #cba6f7; font-size: 14px; padding: 8px 0;');
        console.log('%c📄 cv (en): %c/cv/andreas-roos-cv-en.pdf', 'color: #89b4fa; font-size: 12px;', 'color: #a6e3a1; font-size: 12px; text-decoration: underline;');
        console.log('%c📄 cv (sv): %c/cv/andreas-roos-cv-sv.pdf', 'color: #89b4fa; font-size: 12px;', 'color: #a6e3a1; font-size: 12px; text-decoration: underline;');


        return () => {
            window.removeEventListener('rm-rf', onRmRf);
            document.removeEventListener('astro:before-preparation', onBeforePrep);
            vtStyle.remove();
        };
    }, []);

    return <div hidden />;
}
