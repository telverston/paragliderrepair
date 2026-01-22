/**
 * Paraglider Repair - Site JavaScript
 * Menu functionality and global behaviors
 */

(function () {
  "use strict";

  /**
   * Initialize hamburger menu functionality
   */
  function initHamburgerMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const menuClose = document.querySelector(".menu-close");
    const menuPanel = document.querySelector(".nav-menu-panel");
    const menuOverlay = document.querySelector(".menu-overlay");

    // Exit if required elements don't exist
    if (!menuToggle || !menuPanel) return;

    // Open menu
    function openMenu() {
      menuPanel.classList.add("active");
      menuToggle.classList.add("active");
      if (menuOverlay) menuOverlay.classList.add("active");
      menuToggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";

      // Focus first link
      setTimeout(function () {
        const firstLink = menuPanel.querySelector("a");
        if (firstLink) firstLink.focus();
      }, 100);
    }

    // Close menu
    function closeMenu() {
      menuPanel.classList.remove("active");
      menuToggle.classList.remove("active");
      if (menuOverlay) menuOverlay.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    // Toggle menu on button click
    menuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      if (menuPanel.classList.contains("active")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close button
    if (menuClose) {
      menuClose.addEventListener("click", function (e) {
        e.stopPropagation();
        closeMenu();
      });
    }

    // Overlay click
    if (menuOverlay) {
      menuOverlay.addEventListener("click", closeMenu);
    }

    // Click outside to close
    document.addEventListener("click", function (event) {
      if (
        !menuPanel.contains(event.target) &&
        !menuToggle.contains(event.target) &&
        menuPanel.classList.contains("active")
      ) {
        closeMenu();
      }
    });

    // Escape key to close
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuPanel.classList.contains("active")) {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Focus trap within menu
    menuPanel.addEventListener("keydown", function (event) {
      if (!menuPanel.classList.contains("active")) return;

      const focusableElements = menuPanel.querySelectorAll(
        "a[href], button:not([disabled])",
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.key === "Tab") {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    });

    // Close menu when clicking a navigation link
    const navLinks = menuPanel.querySelectorAll(".nav-menu a");
    navLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Highlight current page in navigation
    highlightCurrentPage(navLinks);
  }

  /**
   * Highlight the current page in navigation menu
   * @param {NodeList} navLinks - Collection of navigation links
   */
  function highlightCurrentPage(navLinks) {
    if (!navLinks || navLinks.length === 0) return;

    const currentPath = window.location.pathname;

    navLinks.forEach(function (link) {
      // Skip external links
      if (link.hostname && link.hostname !== window.location.hostname) {
        return;
      }

      try {
        const linkPath = new URL(link.href, window.location.origin).pathname;
        link.classList.remove("current");

        if (
          currentPath === linkPath ||
          (currentPath.includes(linkPath) &&
            linkPath !== "/" &&
            linkPath !== "/index.html")
        ) {
          link.classList.add("current");
          link.setAttribute("aria-current", "page");
        }
      } catch (e) {
        // Silently handle malformed URLs
        console.warn("Invalid URL in navigation:", link.href);
      }
    });
  }

  /**
   * Scroll the current page link into view in the contextual navigation
   */
  function scrollCurrentLinkIntoView() {
    // Find the current link in the horizontal contextual navigation
    const currentLink = document.querySelector(
      ".horizontal-context-menu a.current",
    );

    if (!currentLink) return;

    // Get the scrollable container
    const container = document.querySelector(".horizontal-context-container");

    if (!container) return;

    // Use scrollIntoView with smooth behavior and center alignment
    // This works on both mobile (horizontal scroll) and desktop
    currentLink.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  /**
   * Initialize shrinking navigation on mobile when scrolling
   */
  function initShrinkingNav() {
    const nav = document.querySelector(".global-nav");
    if (!nav) return;

    let lastScrollTop = 0;
    let ticking = false;

    function updateNavState() {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      // Only apply on mobile/tablet (screens <= 768px)
      if (window.innerWidth <= 768) {
        // Add compact class when scrolled down past 50px
        if (scrollTop > 50) {
          nav.classList.add("nav-compact");
        } else {
          nav.classList.remove("nav-compact");
        }
      } else {
        // Remove compact class on larger screens
        nav.classList.remove("nav-compact");
      }

      lastScrollTop = scrollTop;
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        window.requestAnimationFrame(updateNavState);
        ticking = true;
      }
    }

    // Listen to scroll events
    window.addEventListener("scroll", requestTick, { passive: true });

    // Listen to resize events to handle orientation changes
    window.addEventListener("resize", requestTick, { passive: true });

    // Initial check
    updateNavState();
  }

  /**
   * Conditional video autoplay - desktop only
   * On mobile, videos show controls with clean play button
   * On desktop, videos autoplay muted
   */
  function initConditionalAutoplay() {
    const videos = document.querySelectorAll("video[data-autoplay-desktop]");
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    videos.forEach(function (video) {
      if (isDesktop) {
        // Desktop: autoplay muted
        video.muted = true;
        video.autoplay = true;
        video.setAttribute("playsinline", "");
        video.play().catch(function (err) {
          console.log("Autoplay prevented:", err);
        });
      }
      // Always show controls so users can pause/replay
      video.controls = true;
    });
  }

  /**
   * Initialize all site functionality when DOM is ready
   */
  function init() {
    initHamburgerMenu();
    scrollCurrentLinkIntoView();
    initShrinkingNav();
    initConditionalAutoplay();
  }

  // Run initialization when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    // DOM already loaded
    init();
  }
})();
