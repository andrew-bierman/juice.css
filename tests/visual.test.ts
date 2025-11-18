import { describe, expect, test, beforeAll, afterAll } from "bun:test";
import { chromium, type Browser, type Page } from "playwright";

describe("Visual Regression Tests", () => {
	let browser: Browser;
	let page: Page;

	beforeAll(async () => {
		browser = await chromium.launch();
		const context = await browser.newContext({
			viewport: { width: 1280, height: 1024 },
		});
		page = await context.newPage();
	});

	afterAll(async () => {
		await browser.close();
	});

	test("page should load without errors", async () => {
		const response = await page.goto("http://localhost:3000");
		expect(response?.status()).toBe(200);
	});

	test("header buttons should use flexbox layout", async () => {
		await page.goto("http://localhost:3000");

		const headerContainer = await page
			.locator("header p:has(button)")
			.evaluate((el) => {
				const styles = window.getComputedStyle(el);
				return {
					display: styles.display,
					gap: styles.gap,
				};
			});

		expect(headerContainer.display).toBe("flex");
		expect(headerContainer.gap).toBe("8px");
	});

	test("form inputs should be full width", async () => {
		await page.goto("http://localhost:3000");

		const inputWidths = await page.evaluate(() => {
			const inputs = document.querySelectorAll(
				'fieldset input[type="text"], fieldset input[type="email"]',
			);
			return Array.from(inputs).map((input) => {
				const el = input as HTMLElement;
				const parent = el.parentElement!;
				return (el.offsetWidth / parent.offsetWidth) * 100;
			});
		});

		for (const width of inputWidths) {
			expect(width).toBeGreaterThan(98); // Allow 2% margin for rounding
		}
	});

	test("range slider should be full width", async () => {
		await page.goto("http://localhost:3000");

		const rangeWidth = await page
			.locator('input[type="range"]')
			.first()
			.evaluate((el: HTMLElement) => {
				const parent = el.parentElement!;
				return (el.offsetWidth / parent.offsetWidth) * 100;
			});

		expect(rangeWidth).toBeGreaterThan(98);
	});

	test("color picker should be circular", async () => {
		await page.goto("http://localhost:3000");

		const colorPicker = await page
			.locator('input[type="color"]')
			.first()
			.evaluate((el) => {
				const styles = window.getComputedStyle(el);
				return {
					borderRadius: styles.borderRadius,
					width: el.offsetWidth,
					height: el.offsetHeight,
				};
			});

		expect(colorPicker.borderRadius).toContain("9999px");
		expect(colorPicker.width).toBe(32);
		expect(colorPicker.height).toBe(32);
	});

	test("first input should have rounded top corners", async () => {
		await page.goto("http://localhost:3000");

		const firstInput = await page
			.locator('fieldset input[type="text"]')
			.first()
			.evaluate((el) => {
				const styles = window.getComputedStyle(el);
				return {
					borderTopLeftRadius: parseFloat(styles.borderTopLeftRadius),
					borderTopRightRadius: parseFloat(styles.borderTopRightRadius),
				};
			});

		expect(firstInput.borderTopLeftRadius).toBeGreaterThanOrEqual(12);
		expect(firstInput.borderTopRightRadius).toBeGreaterThanOrEqual(12);
	});

	test("theme switcher should work", async () => {
		await page.goto("http://localhost:3000");

		// Click dark theme button
		await page.click("#btn-dark");
		await page.waitForTimeout(200);

		const darkThemeApplied = await page.evaluate(() => {
			return (
				document.documentElement.style.getPropertyValue("--background-body") ===
				"#000000"
			);
		});

		expect(darkThemeApplied).toBe(true);

		// Click light theme button
		await page.click("#btn-light");
		await page.waitForTimeout(200);

		const lightThemeApplied = await page.evaluate(() => {
			return (
				document.documentElement.style.getPropertyValue("--background-body") ===
				"#ffffff"
			);
		});

		expect(lightThemeApplied).toBe(true);
	});

	test("all viewports should render correctly", async () => {
		const viewports = [
			{ width: 375, height: 667, name: "iPhone SE" },
			{ width: 768, height: 1024, name: "iPad" },
			{ width: 1920, height: 1080, name: "Desktop" },
		];

		for (const vp of viewports) {
			await page.setViewportSize({ width: vp.width, height: vp.height });
			await page.goto("http://localhost:3000");

			// Check that form inputs are still full width
			const inputWidth = await page
				.locator('fieldset input[type="text"]')
				.first()
				.evaluate((el: HTMLElement) => {
					const parent = el.parentElement!;
					return (el.offsetWidth / parent.offsetWidth) * 100;
				});

			expect(inputWidth).toBeGreaterThan(98);
		}
	});
});
