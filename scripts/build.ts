#!/usr/bin/env bun

/**
 * juice.css Build Script
 * Leverages Bun's native APIs for optimal performance
 *
 * Generates two output directories:
 * - out/  : CSS distribution files only (committed to GitHub for CDN/direct usage)
 * - dist/ : Complete demo site (gitignored, for Cloudflare deployment)
 */

import { mkdir } from "node:fs/promises";

console.log("📦 Building juice.css...");

// Ensure directories exist (parallel)
await Promise.all([
	mkdir("out", { recursive: true }),
	mkdir("dist", { recursive: true }),
]);

// Read source files using Bun.file (faster than fs.readFileSync)
const [lightVars, darkVars, base] = await Promise.all([
	Bun.file("src/variables-light.css").text(),
	Bun.file("src/variables-dark.css").text(),
	Bun.file("src/base.css").text(),
]);

// Indent dark vars for media query
const indentedDarkVars = darkVars
	.split("\n")
	.map((line) => (line ? `\t${line}` : line))
	.join("\n");

// Build juice.css (auto - switches between light/dark)
const autoCSS = `${lightVars}\n\n@media (prefers-color-scheme: dark) {\n${indentedDarkVars}\n}\n\n${base}`;

// Build juice-light.css (always light)
const lightCSS = `${lightVars}\n\n${base}`;

// Build juice-dark.css (always dark)
const darkCSS = `${darkVars}\n\n${base}`;

// Write CSS files to both directories (parallel using Bun.write)
await Promise.all([
	// out/ (unminified for GitHub distribution)
	Bun.write("out/juice.css", autoCSS),
	Bun.write("out/juice-light.css", lightCSS),
	Bun.write("out/juice-dark.css", darkCSS),
	// dist/ (for Cloudflare - can be minified by Cloudflare)
	Bun.write("dist/juice.css", autoCSS),
	Bun.write("dist/juice-light.css", lightCSS),
	Bun.write("dist/juice-dark.css", darkCSS),
]);

// Build HTML for dist/ using Bun.build
const distHTMLResult = await Bun.build({
	entrypoints: ["src/index.html"],
	outdir: "dist",
	naming: "[dir]/[name].[ext]",
});

if (!distHTMLResult.success) {
	console.error("❌ Dist HTML build failed!");
	process.exit(1);
}

// Build theme switcher for dist/
const themeSwitcherResult = await Bun.build({
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
