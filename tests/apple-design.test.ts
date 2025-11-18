import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { type Browser, chromium, type Page } from "playwright";

/**
 * Apple Design System Compliance Tests
 * Validates that juice.css follows Apple's design principles
 */
describe("Apple Design System Compliance", () => {
	let browser: Browser;
	let page: Page;

	beforeAll(async () => {
		browser = await chromium.launch({ headless: false });
		const context = await browser.newContext({
			viewport: { width: 1280, height: 1024 },
		});
		page = await context.newPage();
		await page.goto("http://localhost:3000");
	});

	afterAll(async () => {
		await browser.close();
	});

	test("should use San Francisco font stack", async () => {
		const fontFamily = await page.evaluate(() => {
			const body = getComputedStyle(document.body);
			return body.fontFamily;
		});

		expect(
			fontFamily.includes("-apple-system") ||
				fontFamily.includes("BlinkMacSystemFont") ||
				fontFamily.includes("SF Pro"),
		).toBe(true);
	});

	test("should use antialiased font smoothing", async () => {
		const smoothing = await page.evaluate(() => {
			const body = getComputedStyle(document.body);
			return (body as any).webkitFontSmoothing;
		});

		expect(smoothing).toBe("antialiased");
	});

	test("should have Apple blue (#007aff) for primary actions", async () => {
		const buttonColor = await page.evaluate(() => {
			const button = document.querySelector("button[type='submit']");
			if (!button) return null;
			return getComputedStyle(button).backgroundColor;
		});

		// Apple blue is rgb(0, 122, 255)
		expect(buttonColor).toContain("0, 122, 255");
	});

	test("should have generous border radius (≥8px) on interactive elements", async () => {
		const borderRadii = await page.evaluate(() => {
			const elements = {
				button: document.querySelector("button"),
				input: document.querySelector("input"),
				select: document.querySelector("select"),
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
			};
		});

		expect(borderRadii.button).toBeGreaterThanOrEqual(8);
		expect(borderRadii.input).toBeGreaterThanOrEqual(8);
		expect(borderRadii.select).toBeGreaterThanOrEqual(8);
	});

	test("should use smooth transitions", async () => {
		const transitions = await page.evaluate(() => {
			const button = document.querySelector("button");
			const input = document.querySelector("input");

			return {
				button: button ? getComputedStyle(button).transition : "",
				input: input ? getComputedStyle(input).transition : "",
			};
		});

		// Should have transitions defined (ease, linear, etc.)
		expect(transitions.button.length).toBeGreaterThan(0);
		expect(transitions.input.length).toBeGreaterThan(0);
	});

	test("should have generous spacing and padding", async () => {
		const spacing = await page.evaluate(() => {
			const body = getComputedStyle(document.body);
			const h1 = document.querySelector("h1");
			const h1Style = h1 ? getComputedStyle(h1) : null;

			return {
				bodyPadding: parseFloat(body.padding),
				h1MarginTop: h1Style ? parseFloat(h1Style.marginTop) : 0,
			};
		});

		expect(spacing.bodyPadding).toBeGreaterThanOrEqual(20);
		expect(spacing.h1MarginTop).toBeGreaterThanOrEqual(20);
	});

	test("should have proper heading hierarchy with decreasing sizes", async () => {
		const headingSizes = await page.evaluate(() => {
			const headings = ["h1", "h2", "h3", "h4", "h5", "h6"];
			return headings.map((tag) => {
				const el = document.querySelector(tag);
				return el ? parseFloat(getComputedStyle(el).fontSize) : 0;
			});
		});

		// Each heading should be smaller than the previous
		for (let i = 1; i < headingSizes.length; i++) {
			if (headingSizes[i] > 0) {
				expect(headingSizes[i]).toBeLessThanOrEqual(headingSizes[i - 1]);
			}
		}
	});

	test("should use subtle focus rings with blue tint", async () => {
		const input = page.locator("input[type='text']").first();
		await input.focus();
		await page.waitForTimeout(100);

		const focusStyle = await input.evaluate((el) => {
			const styles = getComputedStyle(el);
			return styles.boxShadow;
		});

		// Should have a box shadow (focus ring)
		expect(focusStyle).not.toBe("none");
		expect(focusStyle).toContain("rgba");
	});

	test("should have clean, borderless fieldsets", async () => {
		const fieldsetBorder = await page.evaluate(() => {
			const fieldset = document.querySelector("fieldset");
			if (!fieldset) return null;
			return getComputedStyle(fieldset).border;
		});

		expect(fieldsetBorder?.includes("none") || fieldsetBorder === "0px").toBe(
			true,
		);
	});

	test("should use SF Mono for code elements", async () => {
		const codeFontFamily = await page.evaluate(() => {
			const code = document.querySelector("code");
			if (!code) return null;
			return getComputedStyle(code).fontFamily;
		});

		expect(
			codeFontFamily?.includes("SF Mono") ||
				codeFontFamily?.includes("Monaco") ||
				codeFontFamily?.includes("monospace"),
		).toBe(true);
	});

	test("should have hover states that darken buttons", async () => {
		const button = page.locator("button[type='submit']").first();

		const normalBg = await button.evaluate(
			(el) => getComputedStyle(el).backgroundColor,
		);

		await button.hover();
		await page.waitForTimeout(200);

		const hoverBg = await button.evaluate(
			(el) => getComputedStyle(el).backgroundColor,
		);

		// Background should change on hover
		expect(normalBg).not.toBe(hoverBg);
	});

	test("should have proper line-height for readability", async () => {
		const lineHeight = await page.evaluate(() => {
			const body = getComputedStyle(document.body);
			const bodyLineHeight = parseFloat(body.lineHeight);
			const bodyFontSize = parseFloat(body.fontSize);
			return bodyLineHeight / bodyFontSize;
		});

		// Apple typically uses 1.4-1.6 line-height
		expect(lineHeight).toBeGreaterThanOrEqual(1.4);
		expect(lineHeight).toBeLessThanOrEqual(1.6);
	});
});
