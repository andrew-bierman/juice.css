#!/usr/bin/env bun

import { $ } from "bun";

// Only install lefthook in development (when devDependencies are installed)
const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = !isProduction;

if (isDevelopment) {
	console.log("Installing lefthook git hooks...");
	await $`lefthook install`;
	console.log("✓ Lefthook installed");
} else {
	console.log("Skipping lefthook installation in production");
}
