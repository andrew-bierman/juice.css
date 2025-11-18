#!/usr/bin/env bun

import { $ } from "bun";

// Run biome check
console.log("Running biome check...");
await $`bun run check`;

// Sort package.json
console.log("Sorting package.json...");
const packageJson = await Bun.file("package.json").json();

const sorted = {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    keywords: packageJson.keywords,
    author: packageJson.author,
    license: packageJson.license,
    private: packageJson.private,
    scripts: Object.fromEntries(
        Object.entries(packageJson.scripts).sort(([a], [b]) =>
            a.localeCompare(b),
        ),
    ),
    dependencies: packageJson.dependencies
        ? Object.fromEntries(
              Object.entries(packageJson.dependencies).sort(([a], [b]) =>
                  a.localeCompare(b),
              ),
          )
        : undefined,
    devDependencies: packageJson.devDependencies
        ? Object.fromEntries(
              Object.entries(packageJson.devDependencies).sort(([a], [b]) =>
                  a.localeCompare(b),
              ),
          )
        : undefined,
    peerDependencies: packageJson.peerDependencies
        ? Object.fromEntries(
              Object.entries(packageJson.peerDependencies).sort(([a], [b]) =>
                  a.localeCompare(b),
              ),
          )
        : undefined,
};

// Remove undefined fields
for (const key of Object.keys(sorted)) {
    if (sorted[key] === undefined) {
        delete sorted[key];
    }
}

await Bun.write("package.json", `${JSON.stringify(sorted, null, "\t")}\n`);

console.log("✓ Pre-commit checks passed");
