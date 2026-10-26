"use strict";

/* ========================================
   MOBILE NAVIGATION
======================================== */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("open");

        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("open");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("click", (event) => {
        const clickedInsideMenu = mainNav.contains(event.target);
        const clickedToggle = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {
            mainNav.classList.remove("open");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });
}

/* ========================================
   SMOOTH SCROLL FOR INTERNAL LINKS
======================================== */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            return;
        }

        const target = document.querySelector(targetId);

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            history.replaceState(null, "", targetId);
        }
    });
});

/* ========================================
   HEADER SCROLL EFFECT
======================================== */

const header = document.querySelector(".header");

if (header) {
    window.addEventListener(
        "scroll",
        () => {
            if (window.scrollY > 30) {
                header.style.boxShadow =
                    "0 5px 22px rgba(0, 0, 0, 0.10)";
            } else {
                header.style.boxShadow =
                    "0 3px 15px rgba(0, 0, 0, 0.05)";
            }
        },
        { passive: true }
    );
}

/* ========================================
   IMAGE FALLBACKS
======================================== */

// If an external background image fails, the CSS background
// colour remains visible so the layout still works.

document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
        image.style.visibility = "hidden";
    });
});

console.log("CR Témouchent club site loaded successfully.");