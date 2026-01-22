/**
 * Paraglider Repair - Site JavaScript
 * Menu functionality and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const menuPanel = document.querySelector('.nav-menu-panel');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuClose = document.querySelector('.menu-close');

    function openMenu() {
        menuPanel.classList.add('active');
        menuOverlay.classList.add('active');
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menuPanel.classList.remove('active');
        menuOverlay.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            if (menuPanel.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }

    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuPanel.classList.contains('active')) {
            closeMenu();
        }
    });

    // Video autoplay on desktop
    const videos = document.querySelectorAll('video[data-autoplay-desktop]');
    videos.forEach(function(video) {
        if (window.innerWidth > 768) {
            video.play().catch(function(error) {
                console.log('Video autoplay failed:', error);
            });
        }
    });

    // Compact nav on scroll
    let lastScroll = 0;
    const nav = document.querySelector('.global-nav');

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.classList.add('nav-compact');
        } else {
            nav.classList.remove('nav-compact');
        }

        lastScroll = currentScroll;
    });
});
