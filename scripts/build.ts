#!/usr/bin/env bun

/**
 * juice.css Build Script
 * Simple Bun-based build - no Gulp, no dependencies!
 * Generates: juice.css (auto), juice-light.css, juice-dark.css
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

// Ensure out directory exists
mkdirSync("out", { recursive: true });

// Build juice.css (auto - switches between light/dark)
const autoCSS =
	header +
	lightVars +
	"\n\n@media (prefers-color-scheme: dark) {\n" +
	darkVars +
	"\n}\n\n" +
	base;
writeFileSync("out/juice.css", autoCSS);

// Build juice-light.css (always light)
const lightCSS = `${header + lightVars}\n\n${base}`;
writeFileSync("out/juice-light.css", lightCSS);

// Build juice-dark.css (always dark)
const darkCSS = `${header + darkVars}\n\n${base}`;
writeFileSync("out/juice-dark.css", darkCSS);

// Build index.html for production (fix CSS path)
const prodHTML = indexHTML.replace("juice-dev.css", "juice.css");
writeFileSync("out/index.html", prodHTML);

console.log("✅ Build complete!");
console.log("   • out/juice.css (auto light/dark)");
console.log("   • out/juice-light.css");
console.log("   • out/juice-dark.css");
console.log("   • out/index.html (production demo)");
