/**
 * Theme switcher for juice.css demo page
 * Manages light/dark/auto theme switching with localStorage persistence
 *
 * Uses data-theme attribute to override CSS prefers-color-scheme.
 * The actual theme values come from the CSS files (variables-light.css, variables-dark.css)
 * so there's no duplication of color values.
 */

type Theme = "auto" | "light" | "dark";

/**
 * Apply theme by setting data-theme attribute
 * CSS handles the actual variable values via [data-theme] selectors
 */
function setTheme(theme: Theme): void {
    const root = document.documentElement;

    if (theme === "auto") {
        // Remove override, let CSS prefers-color-scheme handle it
        root.removeAttribute("data-theme");
        localStorage.removeItem("theme");
    } else {
        // Set explicit theme
        root.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }

    updateSelect(theme);
}

/**
 * Update select element to show active theme
 */
function updateSelect(theme: Theme): void {
    const select = document.getElementById("theme-select") as HTMLSelectElement;
    if (select) {
        select.value = theme;
    }
}

/**
 * Initialize theme switcher on page load
 */
function init(): void {
    const saved = localStorage.getItem("theme") as Theme | null;

    if (saved && ["auto", "light", "dark"].includes(saved)) {
        setTheme(saved);
    } else {
        updateSelect("auto");
    }

    // Attach event listener to theme select
    const select = document.getElementById("theme-select") as HTMLSelectElement;
    select?.addEventListener("change", (e) => {
        setTheme((e.target as HTMLSelectElement).value as Theme);
    });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
