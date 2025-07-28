// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Auth state listener for global access to user/role (even on public pages)
    listenForAuthChanges((user) => {
        const adminLink = document.getElementById('adminLink');
        if (adminLink) {
            // Check if user exists AND if they have an admin role
            // getCurrentUserRole() relies on the auth.js listener having fetched the role
            const role = getCurrentUserRole();
            if (user && (role === 'editor' || role === 'superAdmin')) {
                adminLink.style.display = 'block'; // Or 'flex' based on your CSS
            } else {
                adminLink.style.display = 'none';
            }
        }
    });

    // --- Dark Mode Toggle ---
    const darkModeToggle = document.getElementById('darkModeToggle');
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');

    // Set initial theme based on local storage or system preference
    if (storedTheme === 'dark' || (!storedTheme && prefersDarkMode)) {
        document.documentElement.classList.add('dark');
        if (darkModeToggle) {
            darkModeToggle.checked = true;
        }
    } else {
        document.documentElement.classList.remove('dark');
        if (darkModeToggle) {
            darkModeToggle.checked = false;
        }
    }

    // Add event listener for toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            if (darkModeToggle.checked) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
            // Trigger a resize event to allow Chart.js to re-render with new colors (if on admin analytics page)
            window.dispatchEvent(new Event('resize'));
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookiesBtn = document.getElementById('acceptCookies');

    if (cookieBanner && acceptCookiesBtn) {
        // Check if cookie consent has been given
        const consentGiven = localStorage.getItem('cookieConsent');
        if (!consentGiven) {
            cookieBanner.classList.remove('hidden');
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.add('hidden');
        });
    }

    // --- Dynamic Year in Footer ---
    const currentYear = new Date().getFullYear();
    const yearSpan = document.querySelector('footer p');
    if (yearSpan) {
        yearSpan.innerHTML = `&copy; ${currentYear} SaaS Tools Directory. All rights reserved.`;
    }
});
