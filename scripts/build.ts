#!/usr/bin/env bun

/**
 * juice.css Build Script
 * Leverages Bun's native APIs for optimal performance
 *
 * Generates two output directories:
 * - out/  : CSS distribution files only (committed to GitHub for CDN/direct usage)
 * - dist/ : Complete demo site (gitignored, for Cloudflare deployment)
 */

import { build, file, write } from "bun";

console.log("📦 Building juice.css...");

// Ensure directories exist (parallel)
await Promise.all([Bun.$`mkdir -p out`, Bun.$`mkdir -p dist`]);

// Read source files using Bun.file (faster than fs.readFileSync)
const [lightVars, darkVars, base] = await Promise.all([
	file("src/variables-light.css").text(),
	file("src/variables-dark.css").text(),
	file("src/base.css").text(),
]);

// Indent content for nested selectors
const indent = (content: string) =>
	content
		.split("\n")
		.map((line) => (line ? `\t${line}` : line))
		.join("\n");

// Convert :root to [data-theme="X"] selector
const toDataTheme = (content: string, theme: "light" | "dark") =>
	content.replace(/:root\s*\{/, `[data-theme="${theme}"] {`);

// Generate theme-overrides.css content
const themeOverridesCSS = `/**
 * Theme overrides for manual theme switching via data-theme attribute
 * Auto-generated from variables-light.css and variables-dark.css
 * DO NOT EDIT DIRECTLY - regenerate with: bun run build
 */

/* Force light theme */
${toDataTheme(lightVars, "light")}

/* Force dark theme */
${toDataTheme(darkVars, "dark")}
`;

// Write theme-overrides.css to src/ for dev mode
await write("src/theme-overrides.css", themeOverridesCSS);

// Build juice.css (auto - switches between light/dark, with data-theme overrides)
const autoCSS = `${lightVars}

@media (prefers-color-scheme: dark) {
${indent(darkVars)}
}

/* Manual theme overrides via data-theme attribute */
${toDataTheme(lightVars, "light")}

${toDataTheme(darkVars, "dark")}

${base}`;

// Build juice-light.css (always light)
const lightCSS = `${lightVars}\n\n${base}`;

// Build juice-dark.css (always dark)
const darkCSS = `${darkVars}\n\n${base}`;

// Write CSS files to both directories (parallel)
await Promise.all([
	// out/ (unminified for GitHub distribution)
	write("out/juice.css", autoCSS),
	write("out/juice-light.css", lightCSS),
	write("out/juice-dark.css", darkCSS),
	// dist/ (for Cloudflare - can be minified by Cloudflare)
	write("dist/juice.css", autoCSS),
	write("dist/juice-light.css", lightCSS),
	write("dist/juice-dark.css", darkCSS),
]);

// Build HTML for dist/
const distHTMLResult = await build({
	entrypoints: ["src/index.html"],
	outdir: "dist",
	naming: "[dir]/[name].[ext]",
});

if (!distHTMLResult.success) {
	console.error("❌ Dist HTML build failed!");
	process.exit(1);
}

// Build theme switcher for dist/
const themeSwitcherResult = await build({
	entrypoints: ["src/theme-switcher.ts"],
	outdir: "dist",
	naming: "theme-switcher.js",
	minify: true,
	format: "esm",
	target: "browser",
});

if (!themeSwitcherResult.success) {
	console.error("❌ Theme switcher build failed!");
	process.exit(1);
}

console.log("✅ Build complete!");
console.log("\n📦 Distribution files (out/) - CSS only for GitHub/CDN:");
console.log("   • out/juice.css (auto light/dark)");
console.log("   • out/juice-light.css");
console.log("   • out/juice-dark.css");
console.log("\n🌐 Demo site files (dist/) - for Cloudflare:");
console.log("   • dist/juice.css");
console.log("   • dist/juice-light.css");
console.log("   • dist/juice-dark.css");
console.log("   • dist/index.html (bundled)");
console.log("   • dist/theme-switcher.js (minified)");
