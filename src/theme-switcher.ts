/**
 * Theme switcher for juice.css demo page
 * Manages light/dark/auto theme switching with localStorage persistence
 */

type Theme = "auto" | "light" | "dark";
type ThemeVars = Record<string, string>;

// Theme variables - matches CSS variable definitions
const lightTheme: ThemeVars = {
  "--background-body": "#ffffff",
  "--background": "#f5f5f7",
  "--background-alt": "#ffffff",
  "--selection": "rgba(0, 122, 255, 0.2)",
  "--text-main": "#1d1d1f",
  "--text-bright": "#000000",
  "--text-muted": "#86868b",
  "--links": "#007aff",
  "--focus": "rgba(0, 122, 255, 0.4)",
  "--border": "#d2d2d7",
  "--code": "#ff3b30",
  "--button-base": "#007aff",
  "--button-hover": "#0051d5",
  "--scrollbar-thumb": "#d2d2d7",
  "--scrollbar-thumb-hover": "#86868b",
  "--form-placeholder": "#86868b",
  "--form-text": "#1d1d1f",
  "--variable": "#34c759",
  "--highlight": "rgba(255, 214, 10, 0.5)",
  "--button-text": "#ffffff",
  "--slider-thumb": "#ffffff",
  "--success": "#34c759",
  "--warning": "#ff9500",
  "--error": "#ff3b30",
};

const darkTheme: ThemeVars = {
  "--background-body": "#000000",
  "--background": "#1c1c1e",
  "--background-alt": "#2c2c2e",
  "--selection": "rgba(10, 132, 255, 0.3)",
  "--text-main": "#f5f5f7",
  "--text-bright": "#ffffff",
  "--text-muted": "#8e8e93",
  "--links": "#0a84ff",
  "--focus": "rgba(10, 132, 255, 0.5)",
  "--border": "#38383a",
  "--code": "#ff453a",
  "--button-base": "#0a84ff",
  "--button-hover": "#409cff",
  "--scrollbar-thumb": "#48484a",
  "--scrollbar-thumb-hover": "#636366",
  "--form-placeholder": "#8e8e93",
  "--form-text": "#f5f5f7",
  "--variable": "#30d158",
  "--highlight": "rgba(255, 214, 10, 0.4)",
  "--button-text": "#ffffff",
  "--slider-thumb": "#ffffff",
  "--success": "#30d158",
  "--warning": "#ff9f0a",
  "--error": "#ff453a",
};

/**
 * Apply theme by setting CSS custom properties
 */
function setTheme(theme: Theme): void {
  const root = document.documentElement;

  if (theme === "auto") {
    // Remove all overrides, let CSS prefers-color-scheme handle it
    for (const key of Object.keys(lightTheme)) {
      root.style.removeProperty(key);
    }
    localStorage.removeItem("theme");
  } else {
    // Apply specific theme
    const vars = theme === "light" ? lightTheme : darkTheme;
    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(key, value);
    }
    localStorage.setItem("theme", theme);
  }

  updateButtons(theme);
}

/**
 * Update button visual states to show active theme
 */
function updateButtons(theme: Theme): void {
  const themes: Theme[] = ["auto", "light", "dark"];

  themes.forEach((t) => {
    const btn = document.getElementById(`btn-${t}`);
    if (btn) {
      btn.style.opacity = t === theme ? "1" : "0.6";
      btn.style.fontWeight = t === theme ? "600" : "normal";
    }
  });
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
