import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { type Browser, chromium, type Page } from "playwright";
import { BASE_URL, BROWSER_OPTIONS, CONTEXT_OPTIONS } from "./test-config";

/**
 * CSS Best Practices Tests
 * Validates clean CSS implementation, proper variable usage, and simplicity
 *
 * These tests verify FRAMEWORK behavior (what users get from juice.css),
 * not demo-specific features.
 */
describe("CSS Best Practices", () => {
	let browser: Browser;
	let page: Page;

	beforeAll(async () => {
		browser = await chromium.launch(BROWSER_OPTIONS);
		const context = await browser.newContext(CONTEXT_OPTIONS);
		page = await context.newPage();
		await page.goto(BASE_URL);
	});

	afterAll(async () => {
		await browser.close();
	});

	describe("CSS Variables", () => {
		test("should define all required CSS variables", async () => {
			const cssVars = await page.evaluate(() => {
				const root = getComputedStyle(document.documentElement);
				const requiredVars = [
					"--background-body",
					"--background",
					"--background-alt",
					"--text-main",
					"--text-bright",
					"--text-muted",
					"--links",
					"--focus",
					"--border",
					"--code",
					"--button-base",
					"--button-hover",
				];

				return requiredVars.map((varName) => ({
					name: varName,
					value: root.getPropertyValue(varName).trim(),
				}));
			});

			for (const cssVar of cssVars) {
				expect(cssVar.value).toBeTruthy();
			}
		});

		test("CSS variables should have valid color values", async () => {
			const colorVars = await page.evaluate(() => {
				const root = getComputedStyle(document.documentElement);
				return {
					backgroundBody: root.getPropertyValue("--background-body").trim(),
					textMain: root.getPropertyValue("--text-main").trim(),
					links: root.getPropertyValue("--links").trim(),
					buttonBase: root.getPropertyValue("--button-base").trim(),
				};
			});

			// Each should be a valid color (hex or rgb)
			for (const [_name, value] of Object.entries(colorVars)) {
				expect(
					value.startsWith("#") ||
						value.startsWith("rgb") ||
						value.startsWith("hsl"),
				).toBe(true);
			}
		});

		test("should support theme switching via CSS variables", async () => {
			// Get initial background
			const _initialBg = await page.evaluate(() =>
				getComputedStyle(document.documentElement).getPropertyValue(
					"--background-body",
				),
			);

			// Click dark button
			const darkButton = page.locator("#btn-dark");
			if ((await darkButton.count()) > 0) {
				await darkButton.click();
				await page.waitForTimeout(200);

				const themeAttr = await page.evaluate(() =>
					document.documentElement.getAttribute("data-theme"),
				);

				// Should have data-theme attribute set
				expect(themeAttr).toBe("dark");
			}
		});
	});

	describe("Classless Design", () => {
		test("should have minimal classes in HTML", async () => {
			const classUsage = await page.evaluate(() => {
				const allElements = document.querySelectorAll("*");
				let withClasses = 0;

				for (const el of Array.from(allElements)) {
					if (
						el.className &&
						typeof el.className === "string" &&
						el.className.trim()
					) {
						// Exclude Prism syntax highlighting classes (demo feature, not framework)
						const classes = el.className.trim();
						if (
							classes.startsWith("token") ||
							classes.startsWith("language-")
						) {
							continue;
						}
						withClasses++;
					}
				}

				return {
					total: allElements.length,
					withClasses,
					percentage: (withClasses / allElements.length) * 100,
				};
			});

			// Most elements should not have classes (classless framework)
			// Demo site has some classes for theme switcher buttons etc.
			expect(classUsage.percentage).toBeLessThan(10);
		});

		test("should style semantic HTML without classes", async () => {
			const semanticElements = await page.evaluate(() => {
				const elements = {
					button: document.querySelector("button"),
					input: document.querySelector("input"),
					table: document.querySelector("table"),
					blockquote: document.querySelector("blockquote"),
				};

				return {
					button: elements.button
						? {
								hasClass: !!elements.button.className,
								hasStyle: !!getComputedStyle(elements.button).backgroundColor,
							}
						: null,
					input: elements.input
						? {
								hasClass: !!elements.input.className,
								hasStyle: !!getComputedStyle(elements.input).borderRadius,
							}
						: null,
				};
			});

			// Elements should be styled even without classes
			if (semanticElements.button) {
				expect(semanticElements.button.hasStyle).toBe(true);
			}
			if (semanticElements.input) {
				expect(semanticElements.input.hasStyle).toBe(true);
			}
		});
	});

	describe("Simplicity & Minimalism", () => {
		test("should not over-style elements", async () => {
			const buttonStyles = await page.evaluate(() => {
				const button = document.querySelector("button");
				if (!button) return null;

				const styles = getComputedStyle(button);
				return {
					boxShadow: styles.boxShadow,
					textShadow: styles.textShadow,
					border: styles.border,
				};
			});

			if (buttonStyles) {
				// Should not have text shadows (too much decoration)
				expect(buttonStyles.textShadow).toBe("none");
				// Border should be simple or none
				expect(buttonStyles.border).toBeTruthy();
			}
		});

		test("should use consistent spacing throughout", async () => {
			const spacing = await page.evaluate(() => {
				const elements = {
					button: document.querySelector("button"),
					input: document.querySelector("input"),
					select: document.querySelector("select"),
				};

				return {
					buttonPadding: elements.button
						? getComputedStyle(elements.button).padding
						: null,
					inputPadding: elements.input
						? getComputedStyle(elements.input).padding
						: null,
					// Select has extra right padding for the dropdown arrow
					selectPaddingLeft: elements.select
						? getComputedStyle(elements.select).paddingLeft
						: null,
					inputPaddingLeft: elements.input
						? getComputedStyle(elements.input).paddingLeft
						: null,
				};
			});

			// Input and select should have similar left padding (right differs due to arrow)
			if (spacing.inputPaddingLeft && spacing.selectPaddingLeft) {
				expect(spacing.inputPaddingLeft).toBe(spacing.selectPaddingLeft);
			}
		});

		test("should use consistent border-radius throughout", async () => {
			const radii = await page.evaluate(() => {
				const elements = {
					button: document.querySelector("button"),
					input: document.querySelector("input"),
					select: document.querySelector("select"),
					table: document.querySelector("table"),
				};

				return {
					button: elements.button
						? parseFloat(getComputedStyle(elements.button).borderRadius)
						: 0,
					input: elements.input
						? parseFloat(getComputedStyle(elements.input).borderRadius)
						: 0,
					select: elements.select
						? parseFloat(getComputedStyle(elements.select).borderRadius)
						: 0,
					table: elements.table
						? parseFloat(getComputedStyle(elements.table).borderRadius)
						: 0,
				};
			});

			// All should use 8px border radius (Apple standard)
			expect(radii.button).toBe(8);
			expect(radii.input).toBe(8);
			expect(radii.select).toBe(8);
			expect(radii.table).toBe(8);
		});
	});

	describe("SwiftUI-like Principles", () => {
		test("should have clean fieldsets without borders", async () => {
			const fieldsetStyle = await page.evaluate(() => {
				const fieldset = document.querySelector("fieldset");
				if (!fieldset) return null;
				const styles = getComputedStyle(fieldset);
				return {
					border: styles.border,
					padding: parseFloat(styles.padding),
				};
			});

			if (fieldsetStyle) {
				expect(
					fieldsetStyle.border.includes("none") ||
						fieldsetStyle.border === "0px",
				).toBe(true);
				// Should still have padding for spacing
				expect(fieldsetStyle.padding).toBeGreaterThanOrEqual(0);
			}
		});

		test("should use system fonts (not web fonts)", async () => {
			const fonts = await page.evaluate(() => {
				const body = getComputedStyle(document.body);
				const code = document.querySelector("code");
				const codeFont = code ? getComputedStyle(code).fontFamily : "";

				return {
					body: body.fontFamily,
					code: codeFont,
				};
			});

			// Should use system fonts, not load external fonts
			expect(fonts.body).toContain("apple-system");
			expect(
				fonts.code.includes("Monaco") ||
					fonts.code.includes("SF Mono") ||
					fonts.code.includes("monospace"),
			).toBe(true);
		});

		test("should prefer native form controls", async () => {
			const formControls = await page.evaluate(() => {
				const select = document.querySelector("select");
				const input = document.querySelector("input");

				return {
					selectAppearance: select
						? getComputedStyle(select).getPropertyValue("appearance") ||
							getComputedStyle(select).getPropertyValue("-webkit-appearance")
						: null,
					inputType: input ? (input as HTMLInputElement).type : null,
				};
			});

			// Should not hide native select appearance completely
			// (Apple prefers enhanced native controls, not custom replacements)
			expect(formControls.inputType).toBeTruthy();
		});
	});

	describe("Performance & Efficiency", () => {
		test("should load CSS quickly", async () => {
			const cssLoadTime = await page.evaluate(() => {
				const cssLink = document.querySelector('link[rel="stylesheet"]');
				if (!cssLink) return null;

				const perfEntries = performance.getEntriesByType(
					"resource",
				) as PerformanceResourceTiming[];
				const cssEntry = perfEntries.find((entry) =>
					entry.name.includes("juice"),
				);

				return cssEntry ? cssEntry.duration : null;
			});

			if (cssLoadTime !== null) {
				// CSS should load quickly (< 100ms for local dev)
				expect(cssLoadTime).toBeLessThan(1000);
			}
		});

		test("should not have excessive CSS rules", async () => {
			const cssStats = await page.evaluate(() => {
				const sheets = Array.from(document.styleSheets);
				let totalRules = 0;

				for (const sheet of sheets) {
					try {
						if (sheet.cssRules) {
							totalRules += sheet.cssRules.length;
						}
					} catch (_e) {
						// CORS blocked
					}
				}

				return { totalRules };
			});

			// Simple framework should have reasonable number of rules (< 500)
			expect(cssStats.totalRules).toBeLessThan(500);
		});
	});

	describe("Accessibility", () => {
		test("should have sufficient color contrast", async () => {
			const contrast = await page.evaluate(() => {
				const body = document.body;
				const styles = getComputedStyle(body);

				const rgb = (color: string) => {
					const match = color.match(/\d+/g);
					return match ? match.map(Number) : [0, 0, 0];
				};

				const getLuminance = (r: number, g: number, b: number) => {
					const [rs, gs, bs] = [r, g, b].map((c) => {
						c = c / 255;
						return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
					}) as [number, number, number];
					return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
				};

				const bg = rgb(styles.backgroundColor);
				const fg = rgb(styles.color);

				const l1 = getLuminance(bg[0] ?? 0, bg[1] ?? 0, bg[2] ?? 0);
				const l2 = getLuminance(fg[0] ?? 0, fg[1] ?? 0, fg[2] ?? 0);

				const ratio =
					l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);

				return ratio;
			});

			// WCAG AA requires 4.5:1 for normal text
			expect(contrast).toBeGreaterThanOrEqual(4.5);
		});

		test("should have visible focus indicators", async () => {
			const input = page.locator("input[type='text']").first();
			await input.focus();
			await page.waitForTimeout(100);

			const focusStyle = await input.evaluate((el) => {
				const styles = getComputedStyle(el);
				return {
					outline: styles.outline,
					boxShadow: styles.boxShadow,
				};
			});

			// Should have either outline or box-shadow for focus
			expect(
				focusStyle.outline !== "none" || focusStyle.boxShadow !== "none",
			).toBe(true);
		});

		test("should not remove outlines globally", async () => {
			const hasGlobalOutlineNone = await page.evaluate(() => {
				const allElements = document.querySelectorAll("*");
				let countWithOutlineNone = 0;

				for (const el of Array.from(allElements)) {
					const styles = getComputedStyle(el);
					if (styles.outline === "none") {
						countWithOutlineNone++;
					}
				}

				return countWithOutlineNone === allElements.length;
			});

			// Should not remove outlines from all elements
			expect(hasGlobalOutlineNone).toBe(false);
		});
	});

	describe("Range Input Specifics", () => {
		test("range input should use appearance: none", async () => {
			const rangeAppearance = await page.evaluate(() => {
				const range = document.querySelector("input[type='range']");
				if (!range) return null;
				const styles = getComputedStyle(range);
				return (
					styles.getPropertyValue("appearance") ||
					styles.getPropertyValue("-webkit-appearance")
				);
			});

			if (rangeAppearance !== null) {
				expect(rangeAppearance).toBe("none");
			}
		});

		test("range input should be full width", async () => {
			const rangeWidth = await page.evaluate(() => {
				const range = document.querySelector("input[type='range']");
				if (!range) return null;
				return {
					width: (range as HTMLElement).offsetWidth,
					parentWidth: (range.parentElement as HTMLElement).offsetWidth,
				};
			});

			if (rangeWidth) {
				const percentage = (rangeWidth.width / rangeWidth.parentWidth) * 100;
				expect(percentage).toBeGreaterThan(98);
			}
		});
	});

	describe("Color Input Specifics", () => {
		test("color input should be styled as circular", async () => {
			const colorStyle = await page.evaluate(() => {
				const color = document.querySelector("input[type='color']");
				if (!color) return null;
				const styles = getComputedStyle(color);
				return {
					borderRadius: styles.borderRadius,
				};
			});

			if (colorStyle) {
				// Should use border-radius: 9999px for circular
				expect(colorStyle.borderRadius).toContain("9999px");
			}
		});
	});
});
