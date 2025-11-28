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

// Clean and create directories
await Bun.$`rm -rf dist && mkdir -p out dist`;

// Read package.json for version
const pkg = await file("package.json").json();
const version = pkg.version;
console.log(`📌 Version: ${version}`);

// Read library source files using Bun.file (faster than fs.readFileSync)
const [lightVars, darkVars, base] = await Promise.all([
	file("src/lib/variables-light.css").text(),
	file("src/lib/variables-dark.css").text(),
	file("src/lib/base.css").text(),
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

// Write theme-overrides.css to src/demo/ for dev mode
await write("src/demo/theme-overrides.css", themeOverridesCSS);

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

// Build HTML for dist/ - Bun automatically bundles all <script> and <link> tags
const distHTMLResult = await build({
	entrypoints: ["src/demo/index.html"],
	outdir: "dist",
	minify: true,
});

if (!distHTMLResult.success) {
	console.error("❌ Build failed!");
	for (const log of distHTMLResult.logs) {
		console.error(log);
	}
	process.exit(1);
}

// Inject version into dist/index.html (replace {{VERSION}} placeholders)
const distHTML = await file("dist/index.html").text();
const versionedHTML = distHTML.replaceAll("{{VERSION}}", version);
await write("dist/index.html", versionedHTML);

console.log("✅ Build complete!");
console.log("\n📦 Distribution files (out/) - CSS only for GitHub/CDN:");
console.log("   • out/juice.css (auto light/dark)");
console.log("   • out/juice-light.css");
console.log("   • out/juice-dark.css");
console.log("\n🌐 Demo site files (dist/) - bundled by Bun:");
console.log("   • dist/index.html + JS/CSS assets (auto-hashed)");
