/**
 * Test Configuration
 * Centralizes test settings to avoid hardcoded values across test files
 */

// The dev server port - tests should use this instead of hardcoding
// When running `bun dev`, Bun will use the first available port starting from 3000
export const TEST_PORT = process.env.TEST_PORT || "3000";
export const BASE_URL = `http://localhost:${TEST_PORT}`;

// Viewport presets for responsive testing
export const VIEWPORTS = {
	mobile: { width: 375, height: 667, name: "Mobile" },
	tablet: { width: 768, height: 1024, name: "Tablet" },
	desktop: { width: 1280, height: 800, name: "Desktop" },
	wide: { width: 1920, height: 1080, name: "Wide Desktop" },
} as const;

// Default browser launch options
export const BROWSER_OPTIONS = {
	headless: true,
	slowMo: 0,
} as const;

// Default context options
export const CONTEXT_OPTIONS = {
	viewport: VIEWPORTS.desktop,
} as const;
