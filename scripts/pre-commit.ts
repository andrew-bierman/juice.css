#!/usr/bin/env bun

import { $ } from "bun";
import sortPackageJson from "sort-package-json";

// Run biome check
console.log("Running biome check...");
await $`bun run check`;

// Sort package.json
console.log("Sorting package.json...");
const packageJson = await Bun.file("package.json").json();
const sorted = sortPackageJson(packageJson);
await Bun.write("package.json", `${JSON.stringify(sorted, null, "\t")}\n`);

console.log("✓ Pre-commit checks passed");
