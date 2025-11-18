#!/usr/bin/env bun

/**
 * juice.css Build Script
 * Leverages Bun's bundler for optimization
 *
 * Generates two output directories:
 * - out/  : CSS distribution files only (committed to GitHub for CDN/direct usage)
 * - dist/ : Complete demo site (gitignored, for Cloudflare deployment)
 */

import { build } from "bun";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

console.log("📦 Building juice.css...");

// Ensure directories exist
mkdirSync("out", { recursive: true });
mkdirSync("dist", { recursive: true });

// Read source files
const lightVars = readFileSync("src/variables-light.css", "utf-8");
const darkVars = readFileSync("src/variables-dark.css", "utf-8");
const base = readFileSync("src/base.css", "utf-8");

// Build juice.css (auto - switches between light/dark)
const autoCSS = `${lightVars}\n\n@media (prefers-color-scheme: dark) {\n${darkVars}\n}\n\n${base}`;

// Build juice-light.css (always light)
const lightCSS = `${lightVars}\n\n${base}`;

// Build juice-dark.css (always dark)
const darkCSS = `${darkVars}\n\n${base}`;

// Write to out/ (unminified for GitHub distribution)
writeFileSync("out/juice.css", autoCSS);
writeFileSync("out/juice-light.css", lightCSS);
writeFileSync("out/juice-dark.css", darkCSS);

// Write to dist/ (for Cloudflare - can be minified by Cloudflare)
writeFileSync("dist/juice.css", autoCSS);
writeFileSync("dist/juice-light.css", lightCSS);
writeFileSync("dist/juice-dark.css", darkCSS);

// Build HTML for dist/ using Bun.build
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
