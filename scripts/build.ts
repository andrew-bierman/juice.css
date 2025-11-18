#!/usr/bin/env bun

/**
 * juice.css Build Script
 * Leverages Bun's bundler for CSS optimization
 *
 * Generates two output directories:
 * - out/  : Distribution files (committed to GitHub for CDN/direct usage)
 * - dist/ : Demo site files (gitignored, for Cloudflare deployment)
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const header = `/**
 * juice.css - A classless CSS framework inspired by SwiftUI & Apple's design system
 * Built on the comprehensive foundation of water.css with Apple aesthetics
 * Drop this file into any HTML page for instant Apple-like styling
 * No classes required - just write semantic HTML
 *
 * @version 1.0.0
 * @license MIT
 * @author andrew-bierman
 * @repository https://github.com/andrew-bierman/juice.css
 */

`;

// Read source files
const lightVars = readFileSync("src/variables-light.css", "utf-8");
const darkVars = readFileSync("src/variables-dark.css", "utf-8");
const base = readFileSync("src/base.css", "utf-8");
const indexHTML = readFileSync("src/index.html", "utf-8");

// Ensure directories exist
mkdirSync("out", { recursive: true });
mkdirSync("dist", { recursive: true });

// Build juice.css (auto - switches between light/dark)
const autoCSS =
    header +
    lightVars +
    "\n\n@media (prefers-color-scheme: dark) {\n" +
    darkVars +
    "\n}\n\n" +
    base;

// Build juice-light.css (always light)
const lightCSS = `${header + lightVars}\n\n${base}`;

// Build juice-dark.css (always dark)
const darkCSS = `${header + darkVars}\n\n${base}`;

// Write to out/ (distribution - for GitHub, unminified for readability)
writeFileSync("out/juice.css", autoCSS);
writeFileSync("out/juice-light.css", lightCSS);
writeFileSync("out/juice-dark.css", darkCSS);

// Build minified versions for dist/ using Bun bundler
console.log("📦 Building distribution files...");

// For dist/, we'll use Bun's CSS minification
// First write temp files, then use Bun.build to minify
writeFileSync("dist/.temp-juice.css", autoCSS);
writeFileSync("dist/.temp-juice-light.css", lightCSS);
writeFileSync("dist/.temp-juice-dark.css", darkCSS);

// Use Bun's bundler for minification
const minifyCSS = async (inputPath: string, outputPath: string) => {
    try {
        const result = await Bun.build({
            entrypoints: [inputPath],
            outdir: "dist",
            minify: true,
            naming: "[dir]/[name].[ext]",
        });

        if (!result.success) {
            console.warn(
                `⚠️  Failed to minify ${inputPath}, using unminified version`,
            );
            return false;
        }
        return true;
    } catch (error) {
        console.warn(
            `⚠️  Bundler not available for CSS, using unminified version`,
        );
        return false;
    }
};

// For now, write unminified to dist/ (Bun.build currently focuses on JS/TS)
// CSS minification can be added when Bun adds better CSS support
writeFileSync("dist/juice.css", autoCSS);
writeFileSync("dist/juice-light.css", lightCSS);
writeFileSync("dist/juice-dark.css", darkCSS);

// Clean up temp files
try {
    Bun.file("dist/.temp-juice.css").writer().unref();
    Bun.file("dist/.temp-juice-light.css").writer().unref();
    Bun.file("dist/.temp-juice-dark.css").writer().unref();
} catch (e) {
    // Temp files might not exist
}

// Build HTML files
const prodHTML = indexHTML.replace("juice-dev.css", "juice.css");
writeFileSync("out/index.html", prodHTML);

// For dist, use Bun to bundle HTML (will inline/optimize assets)
await Bun.build({
    entrypoints: ["src/index.html"],
    outdir: "dist",
    naming: "[dir]/[name].[ext]",
    minify: {
        whitespace: true,
        identifiers: false,
        syntax: true,
    },
});

// Copy theme switcher script to dist
try {
    const themeSwitcher = readFileSync("src/theme-switcher.ts", "utf-8");
    writeFileSync("dist/theme-switcher.ts", themeSwitcher);

    // Build theme switcher with Bun bundler for dist
    await Bun.build({
        entrypoints: ["src/theme-switcher.ts"],
        outdir: "dist",
        naming: "theme-switcher.js",
        minify: true,
        format: "esm",
        target: "browser",
    });
} catch (e) {
    console.warn("⚠️  theme-switcher.ts not found, skipping");
}

console.log("✅ Build complete!");
console.log("\n📦 Distribution files (out/) - for GitHub/CDN:");
console.log("   • out/juice.css (auto light/dark)");
console.log("   • out/juice-light.css");
console.log("   • out/juice-dark.css");
console.log("   • out/index.html");
console.log("\n🌐 Demo site files (dist/) - optimized for Cloudflare:");
console.log("   • dist/juice.css");
console.log("   • dist/juice-light.css");
console.log("   • dist/juice-dark.css");
console.log("   • dist/index.html (bundled)");
console.log("   • dist/theme-switcher.js (minified)");
