// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Auth state listener for global access to user/role (even on public pages)
    // This allows you to potentially show/hide elements based on user login status
    listenForAuthChanges((user) => {
        // Optional: Perform actions when auth state changes on public pages
        // console.log("Auth state changed on public page:", user ? user.email : "Logged out");
        // Example: Hide/show admin link
        const adminLink = document.getElementById('adminLink'); // Add an ID to your admin link in header
        if (adminLink) {
            // You might want to get the user's role and only show for admins
            // For now, if user exists, show admin link.
            // A more robust check should be done on admin pages themselves (via checkAuthAndRedirect)
            adminLink.style.display = user ? 'block' : 'none';
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
            // Trigger a resize event to allow Chart.js to re-render with new colors
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
