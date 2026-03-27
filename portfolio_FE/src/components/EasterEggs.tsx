import { useEffect } from 'react';

export default function EasterEggs() {
    useEffect(() => {
        const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
        let pos = 0;

        const onKey = (e: KeyboardEvent) => {
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            if (key === seq[pos]) {
                if (pos >= 8) e.preventDefault();
                pos++;
                if (pos === seq.length) {
                    pos = 0;
                    console.log('%c🎮 KONAMI CODE ACTIVATED!', 'color: #a6e3a1; font-size: 20px; font-weight: bold;');
                    window.dispatchEvent(new CustomEvent('konami'));
                    document.body.classList.add('konami-active');
                    setTimeout(() => document.body.classList.remove('konami-active'), 3000);

                    // Achievement banner
                    const banner = document.createElement('div');
                    banner.className = 'konami-banner';
                    banner.innerHTML = `
                        <div style="border: 1px solid rgba(166,227,161,0.4); background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); padding: 1.5rem 2.5rem; border-radius: 0.5rem;">
                            <div style="color: #a6e3a1; font-size: 10px; letter-spacing: 3px; margin-bottom: 6px;">★ ACHIEVEMENT UNLOCKED ★</div>
                            <div style="color: #fff; font-size: 18px; font-weight: 600;">you found the konami code</div>
                            <div style="color: #585b70; font-size: 11px; margin-top: 6px;">+30 nerd cred</div>
                        </div>`;
                    document.body.appendChild(banner);
                    setTimeout(() => banner.remove(), 3200);
                }
            } else {
                pos = 0;
            }
        };

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

        document.addEventListener('keydown', onKey, true);
        window.addEventListener('rm-rf', onRmRf);

        console.log(
            '%c ██████╗  ██████╗  ██████╗ ███████╗\n' +
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
        console.log('%c hint: try the konami code ↑↑↓↓←→←→ B A', 'color: #585b70; font-size: 11px;');

        return () => {
            document.removeEventListener('keydown', onKey, true);
            window.removeEventListener('rm-rf', onRmRf);
            document.removeEventListener('astro:before-preparation', onBeforePrep);
            vtStyle.remove();
        };
    }, []);

    return <div hidden />;
}
