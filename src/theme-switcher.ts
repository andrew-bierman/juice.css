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

	updateButtons(theme);
}

/**
 * Update button visual states to show active theme
 */
function updateButtons(theme: Theme): void {
	const themes: Theme[] = ["auto", "light", "dark"];

	for (const t of themes) {
		const btn = document.getElementById(`btn-${t}`);
		if (btn) {
			btn.style.opacity = t === theme ? "1" : "0.6";
			btn.style.fontWeight = t === theme ? "600" : "normal";
		}
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
		updateButtons("auto");
	}

	// Attach event listeners to theme buttons
	document
		.getElementById("btn-auto")
		?.addEventListener("click", () => setTheme("auto"));
	document
		.getElementById("btn-light")
		?.addEventListener("click", () => setTheme("light"));
	document
		.getElementById("btn-dark")
		?.addEventListener("click", () => setTheme("dark"));
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init);
} else {
	init();
}
