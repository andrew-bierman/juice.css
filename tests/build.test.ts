import { beforeAll, describe, expect, test } from "bun:test";
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

describe("Build Process", () => {
	beforeAll(() => {
		// Run build before tests
		execSync("bun run build", { cwd: process.cwd() });
	});

	test("should generate all CSS output files", () => {
		expect(existsSync("out/juice.css")).toBe(true);
		expect(existsSync("out/juice-light.css")).toBe(true);
		expect(existsSync("out/juice-dark.css")).toBe(true);
	});

	test("should generate HTML demo file", () => {
		expect(existsSync("out/index.html")).toBe(true);
	});

	test("CSS files should not be empty", () => {
		const juiceCSS = readFileSync("out/juice.css", "utf-8");
		const lightCSS = readFileSync("out/juice-light.css", "utf-8");
		const darkCSS = readFileSync("out/juice-dark.css", "utf-8");

		expect(juiceCSS.length).toBeGreaterThan(1000);
		expect(lightCSS.length).toBeGreaterThan(1000);
		expect(darkCSS.length).toBeGreaterThan(1000);
	});

	test("CSS files should include header comment", () => {
		const juiceCSS = readFileSync("out/juice.css", "utf-8");

		expect(juiceCSS).toContain("juice.css");
		expect(juiceCSS).toContain("Apple-inspired");
	});

	test("light CSS should contain light theme variables", () => {
		const lightCSS = readFileSync("out/juice-light.css", "utf-8");

		expect(lightCSS).toContain("--background-body: #ffffff");
		expect(lightCSS).toContain("--text-main: #1d1d1f");
	});

	test("dark CSS should contain dark theme variables", () => {
		const darkCSS = readFileSync("out/juice-dark.css", "utf-8");

		expect(darkCSS).toContain("--background-body: #000000");
		expect(darkCSS).toContain("--text-main: #f5f5f7");
	});

	test("auto theme CSS should contain both light and dark variables", () => {
		const juiceCSS = readFileSync("out/juice.css", "utf-8");

		expect(juiceCSS).toContain(":root");
		expect(juiceCSS).toContain("@media (prefers-color-scheme: dark)");
	});

	test("all CSS files should be valid (no syntax errors)", () => {
		const files = [
			"out/juice.css",
			"out/juice-light.css",
			"out/juice-dark.css",
		];

		for (const file of files) {
			const css = readFileSync(file, "utf-8");

			// Basic CSS syntax validation
			const openBraces = (css.match(/{/g) || []).length;
			const closeBraces = (css.match(/}/g) || []).length;

			expect(openBraces).toBe(closeBraces);
		}
	});

	test("CSS should include essential selectors", () => {
		const juiceCSS = readFileSync("out/juice.css", "utf-8");

		// Check for key selectors
		expect(juiceCSS).toContain("body");
		expect(juiceCSS).toContain("button");
		expect(juiceCSS).toContain("input");
		expect(juiceCSS).toContain("fieldset");
		expect(juiceCSS).toContain("table");
	});
});
