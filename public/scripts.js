(function () {
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav-toggle');
    const navContent = document.getElementById('primary-navigation');
    const navLinks = navContent ? navContent.querySelectorAll('a') : [];
    const mobileQuery = window.matchMedia('(max-width: 760px)');
    const TRANSITION_DURATION = 260;

    if (!nav || !toggle || !navContent) {
        return;
    }

    nav.classList.add('nav--ready');

    const syncState = () => {
        if (mobileQuery.matches) {
            navContent.hidden = !nav.classList.contains('nav--open');
            navContent.removeAttribute('data-closing');
        } else {
            nav.classList.remove('nav--open');
            toggle.setAttribute('aria-expanded', 'false');
            navContent.hidden = false;
            navContent.removeAttribute('data-closing');
        }
    };

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('nav--open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        if (mobileQuery.matches) {
            if (isOpen) {
                navContent.hidden = false;
            } else {
                navContent.setAttribute('data-closing', 'true');
                window.setTimeout(() => {
                    if (!nav.classList.contains('nav--open') && mobileQuery.matches) {
                        navContent.hidden = true;
                    }
                    navContent.removeAttribute('data-closing');
                }, TRANSITION_DURATION);
            }
        }
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (!mobileQuery.matches) {
                return;
            }

            nav.classList.remove('nav--open');
            toggle.setAttribute('aria-expanded', 'false');
            navContent.setAttribute('data-closing', 'true');
            window.setTimeout(() => {
                if (mobileQuery.matches) {
                    navContent.hidden = true;
                }
                navContent.removeAttribute('data-closing');
            }, TRANSITION_DURATION);
        });
    });

    if (typeof mobileQuery.addEventListener === 'function') {
        mobileQuery.addEventListener('change', syncState);
    } else if (typeof mobileQuery.addListener === 'function') {
        mobileQuery.addListener(syncState);
    }
    syncState();
})();
