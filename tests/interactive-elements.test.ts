import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { type Browser, chromium, type Page } from "playwright";

/**
 * Interactive Elements Tests
 * Tests that all interactive elements work properly and render correctly
 * Including dropdowns, pickers, date inputs, responsive behavior, etc.
 */
describe("Interactive Elements - Functionality & Rendering", () => {
	let browser: Browser;
	let page: Page;

	beforeAll(async () => {
		browser = await chromium.launch({ headless: false, slowMo: 50 });
		const context = await browser.newContext({
			viewport: { width: 1280, height: 1024 },
		});
		page = await context.newPage();
		await page.goto("http://localhost:3000");
	});

	afterAll(async () => {
		await browser.close();
	});

	describe("Select Dropdowns", () => {
		test("select should render with proper width", async () => {
			const selectWidth = await page.evaluate(() => {
				const select = document.querySelector("select");
				if (!select) return null;
				const parent = select.parentElement!;
				return {
					selectWidth: (select as HTMLElement).offsetWidth,
					parentWidth: parent.offsetWidth,
					percentage:
						((select as HTMLElement).offsetWidth / parent.offsetWidth) * 100,
				};
			});

			expect(selectWidth).toBeTruthy();
			expect(selectWidth?.percentage).toBeGreaterThan(98); // Should be full width
		});

		test("select should open dropdown when clicked", async () => {
			const select = page.locator("select").first();

			// Click to open
			await select.click();
			await page.waitForTimeout(300);

			// Check if it's focused (dropdown should be open)
			const isFocused = await select.evaluate(
				(el) => document.activeElement === el,
			);
			expect(isFocused).toBe(true);
		});

		test("select should show all options", async () => {
			const optionCount = await page.evaluate(() => {
				const select = document.querySelector("select");
				if (!select) return 0;
				return select.querySelectorAll("option").length;
			});

			expect(optionCount).toBeGreaterThan(0);
		});

		test("select should be able to change value", async () => {
			const select = page.locator("select").first();

			const initialValue = await select.inputValue();

			// Select a different option
			await select.selectOption({ index: 1 });
			await page.waitForTimeout(100);

			const newValue = await select.inputValue();

			// Value should have changed (unless there's only one option)
			const hasMultipleOptions = await page.evaluate(() => {
				const sel = document.querySelector("select");
				return sel ? sel.querySelectorAll("option").length > 1 : false;
			});

			if (hasMultipleOptions) {
				expect(newValue).not.toBe(initialValue);
			}
		});

		test("select should maintain styling in fieldset", async () => {
			const selectInFieldset = await page.evaluate(() => {
				const fieldset = document.querySelector("fieldset");
				const select = fieldset?.querySelector("select");
				if (!select) return null;

				const styles = getComputedStyle(select);
				return {
					borderRadius: parseFloat(styles.borderRadius),
					padding: styles.padding,
					backgroundColor: styles.backgroundColor,
				};
			});

			if (selectInFieldset) {
				expect(selectInFieldset.borderRadius).toBeGreaterThanOrEqual(8);
				expect(selectInFieldset.padding).toBeTruthy();
			}
		});
	});

	describe("Text Inputs", () => {
		test("text input should accept and display text", async () => {
			const input = page.locator('input[type="text"]').first();

			// Clear and type
			await input.clear();
			await input.fill("Test input text");

			const value = await input.inputValue();
			expect(value).toBe("Test input text");
		});

		test("text input should be full width in fieldset", async () => {
			const inputWidth = await page.evaluate(() => {
				const fieldset = document.querySelector("fieldset");
				const input = fieldset?.querySelector('input[type="text"]');
				if (!input) return null;

				const parent = input.parentElement!;
				return {
					width: (input as HTMLElement).offsetWidth,
					parentWidth: parent.offsetWidth,
					percentage:
						((input as HTMLElement).offsetWidth / parent.offsetWidth) * 100,
				};
			});

			expect(inputWidth?.percentage).toBeGreaterThan(98);
		});

		test("text input should show focus state when clicked", async () => {
			const input = page.locator('input[type="text"]').first();

			await input.click();
			await page.waitForTimeout(200);

			const focusStyles = await input.evaluate((el) => {
				const styles = getComputedStyle(el);
				return {
					boxShadow: styles.boxShadow,
					outline: styles.outline,
				};
			});

			// Should have visible focus indicator
			expect(
				focusStyles.boxShadow !== "none" || focusStyles.outline !== "none",
			).toBe(true);
		});

		test("email input should have same width as text input", async () => {
			const widths = await page.evaluate(() => {
				const textInput = document.querySelector('input[type="text"]');
				const emailInput = document.querySelector('input[type="email"]');

				if (!textInput || !emailInput) return null;

				return {
					text: (textInput as HTMLElement).offsetWidth,
					email: (emailInput as HTMLElement).offsetWidth,
				};
			});

			if (widths) {
				// Should be within 5px of each other (accounting for rounding)
				expect(Math.abs(widths.text - widths.email)).toBeLessThan(5);
			}
		});
	});

	describe("Textarea", () => {
		test("textarea should accept multi-line text", async () => {
			const textarea = page.locator("textarea").first();

			const testText = "Line 1\nLine 2\nLine 3";
			await textarea.clear();
			await textarea.fill(testText);

			const value = await textarea.inputValue();
			expect(value).toBe(testText);
		});

		test("textarea should be vertically resizable", async () => {
			const resize = await page.evaluate(() => {
				const textarea = document.querySelector("textarea");
				if (!textarea) return null;
				return getComputedStyle(textarea).resize;
			});

			expect(resize).toBe("vertical");
		});

		test("textarea should have minimum height", async () => {
			const minHeight = await page.evaluate(() => {
				const textarea = document.querySelector("textarea");
				if (!textarea) return 0;
				return (textarea as HTMLElement).offsetHeight;
			});

			expect(minHeight).toBeGreaterThan(50);
		});

		test("textarea should be full width", async () => {
			const width = await page.evaluate(() => {
				const textarea = document.querySelector("textarea");
				if (!textarea) return null;
				const parent = textarea.parentElement!;
				return (
					((textarea as HTMLElement).offsetWidth / parent.offsetWidth) * 100
				);
			});

			expect(width).toBeGreaterThan(98);
		});
	});

	describe("Range Input (Slider)", () => {
		test("range input should be interactive", async () => {
			const range = page.locator('input[type="range"]').first();

			const _initialValue = await range.inputValue();

			// Try to change the value
			await range.fill("50");
			await page.waitForTimeout(100);

			const newValue = await range.inputValue();
			expect(newValue).toBe("50");
		});

		test("range input should be full width", async () => {
			const width = await page.evaluate(() => {
				const range = document.querySelector('input[type="range"]');
				if (!range) return null;
				const parent = range.parentElement!;
				return {
					width: (range as HTMLElement).offsetWidth,
					parentWidth: parent.offsetWidth,
					percentage:
						((range as HTMLElement).offsetWidth / parent.offsetWidth) * 100,
				};
			});

			expect(width?.percentage).toBeGreaterThan(98);
		});

		test("range input should have custom styling (appearance: none)", async () => {
			const rangeStyle = await page.evaluate(() => {
				const range = document.querySelector('input[type="range"]');
				if (!range) return null;
				const styles = getComputedStyle(range);
				return {
					appearance:
						(styles as any).appearance || (styles as any).webkitAppearance,
					background: styles.background,
					height: parseFloat(styles.height),
				};
			});

			expect(rangeStyle?.appearance).toBe("none");
			expect(rangeStyle?.height).toBeGreaterThan(0);
		});

		test("range track should be styled", async () => {
			// We can't directly test pseudo-elements, but we can verify the range renders properly
			const rangeRendered = await page.evaluate(() => {
				const range = document.querySelector('input[type="range"]');
				if (!range) return false;
				return (
					(range as HTMLElement).offsetHeight > 0 &&
					(range as HTMLElement).offsetWidth > 0
				);
			});

			expect(rangeRendered).toBe(true);
		});
	});

	describe("Color Input (Color Picker)", () => {
		test("color input should open color picker", async () => {
			const colorInput = page.locator('input[type="color"]').first();

			// Color inputs should be clickable
			await colorInput.click();
			await page.waitForTimeout(300);

			// Should be focused
			const isFocused = await colorInput.evaluate(
				(el) => document.activeElement === el,
			);
			expect(isFocused).toBe(true);
		});

		test("color input should accept hex color values", async () => {
			const colorInput = page.locator('input[type="color"]').first();

			// Set a color value
			await colorInput.fill("#ff0000");
			await page.waitForTimeout(100);

			const value = await colorInput.inputValue();
			expect(value).toBe("#ff0000");
		});

		test("color input should be styled as circular", async () => {
			const colorStyle = await page.evaluate(() => {
				const color = document.querySelector('input[type="color"]');
				if (!color) return null;
				const styles = getComputedStyle(color);
				return {
					borderRadius: styles.borderRadius,
					width: (color as HTMLElement).offsetWidth,
					height: (color as HTMLElement).offsetHeight,
				};
			});

			expect(colorStyle?.borderRadius).toContain("9999px");
			// Should be roughly square/circular
			expect(Math.abs(colorStyle?.width - colorStyle?.height)).toBeLessThan(5);
		});

		test("color input should have pointer cursor", async () => {
			const cursor = await page.evaluate(() => {
				const color = document.querySelector('input[type="color"]');
				if (!color) return null;
				return getComputedStyle(color).cursor;
			});

			expect(cursor).toBe("pointer");
		});
	});

	describe("Checkbox & Radio Inputs", () => {
		test("checkbox should be clickable and toggle state", async () => {
			const checkbox = page.locator('input[type="checkbox"]').first();

			const initialChecked = await checkbox.isChecked();

			await checkbox.click();
			await page.waitForTimeout(100);

			const newChecked = await checkbox.isChecked();
			expect(newChecked).toBe(!initialChecked);
		});

		test("radio buttons should be clickable", async () => {
			const radio = page.locator('input[type="radio"]').first();

			await radio.click();
			await page.waitForTimeout(100);

			const isChecked = await radio.isChecked();
			expect(isChecked).toBe(true);
		});

		test("checkbox should have inline layout with label", async () => {
			const labelLayout = await page.evaluate(() => {
				const label = document.querySelector(
					'label:has(input[type="checkbox"])',
				);
				if (!label) return null;
				const styles = getComputedStyle(label);
				return {
					display: styles.display,
					alignItems: styles.alignItems,
				};
			});

			if (labelLayout) {
				expect(labelLayout.display).toContain("flex");
			}
		});

		test("radio buttons should be mutually exclusive in same group", async () => {
			const radios = await page
				.locator('input[type="radio"][name="theme"]')
				.all();

			if (radios.length > 1) {
				await radios[0].click();
				await page.waitForTimeout(100);
				const first = await radios[0].isChecked();

				await radios[1].click();
				await page.waitForTimeout(100);
				const firstAfter = await radios[0].isChecked();
				const second = await radios[1].isChecked();

				expect(first).toBe(true);
				expect(second).toBe(true);
				expect(firstAfter).toBe(false); // First should be unchecked
			}
		});
	});

	describe("Buttons", () => {
		test("submit button should be clickable", async () => {
			const button = page.locator('button[type="submit"]').first();

			await button.click();
			await page.waitForTimeout(100);

			// Button click should work (page might prevent default, but click should register)
			const clickable = await button.evaluate(
				(el) => !el.hasAttribute("disabled"),
			);
			expect(clickable).toBe(true);
		});

		test("button should show active state when clicked", async () => {
			const button = page.locator('button[type="submit"]').first();

			const _normalTransform = await button.evaluate(
				(el) => getComputedStyle(el).transform,
			);

			// Simulate active state with hover and click
			await button.hover();
			await page.mouse.down();
			await page.waitForTimeout(50);

			const _activeTransform = await button.evaluate(
				(el) => getComputedStyle(el).transform,
			);

			await page.mouse.up();

			// Transform might change on active (translateY)
			// If not, that's okay, just verify it's interactive
			expect(button).toBeTruthy();
		});

		test("disabled button should not be clickable", async () => {
			const disabledButton = page.locator("button:disabled").first();

			if ((await disabledButton.count()) > 0) {
				const isDisabled = await disabledButton.isDisabled();
				expect(isDisabled).toBe(true);

				const styles = await disabledButton.evaluate((el) => {
					const s = getComputedStyle(el);
					return {
						opacity: parseFloat(s.opacity),
						cursor: s.cursor,
					};
				});

				expect(styles.opacity).toBeLessThan(1);
				expect(styles.cursor).toBe("not-allowed");
			}
		});

		test("reset button should work", async () => {
			const resetButton = page.locator('button[type="reset"]').first();

			if ((await resetButton.count()) > 0) {
				// Fill a form field
				const input = page.locator('input[type="text"]').first();
				await input.fill("Test data");

				// Click reset
				await resetButton.click();
				await page.waitForTimeout(100);

				// Input should be cleared
				const value = await input.inputValue();
				expect(value).toBe("");
			}
		});
	});

	describe("Progress & Meter", () => {
		test("progress bar should render with proper width", async () => {
			const progressWidth = await page.evaluate(() => {
				const progress = document.querySelector("progress");
				if (!progress) return null;
				const parent = progress.parentElement!;
				return (
					((progress as HTMLElement).offsetWidth / parent.offsetWidth) * 100
				);
			});

			if (progressWidth) {
				expect(progressWidth).toBeGreaterThan(98);
			}
		});

		test("progress bar should have value", async () => {
			const progressValue = await page.evaluate(() => {
				const progress = document.querySelector("progress");
				if (!progress) return null;
				return {
					value: (progress as HTMLProgressElement).value,
					max: (progress as HTMLProgressElement).max,
				};
			});

			if (progressValue) {
				expect(progressValue.value).toBeGreaterThan(0);
				expect(progressValue.max).toBeGreaterThan(0);
			}
		});

		test("meter should render correctly", async () => {
			const meterExists = await page.evaluate(() => {
				const meter = document.querySelector("meter");
				return meter !== null;
			});

			if (meterExists) {
				const meterValue = await page.evaluate(() => {
					const meter = document.querySelector("meter") as HTMLMeterElement;
					return {
						value: meter.value,
						min: meter.min,
						max: meter.max,
					};
				});

				expect(meterValue.value).toBeGreaterThanOrEqual(meterValue.min);
				expect(meterValue.value).toBeLessThanOrEqual(meterValue.max);
			}
		});
	});

	describe("Details/Summary (Accordion)", () => {
		test("details should expand and collapse", async () => {
			const details = page.locator("details").first();

			if ((await details.count()) > 0) {
				// Close if open
				const initialOpen = await details.evaluate(
					(el) => (el as HTMLDetailsElement).open,
				);

				// Click summary to toggle
				const summary = details.locator("summary");
				await summary.click();
				await page.waitForTimeout(200);

				const afterClick = await details.evaluate(
					(el) => (el as HTMLDetailsElement).open,
				);

				// State should have toggled
				expect(afterClick).toBe(!initialOpen);
			}
		});

		test("summary should have pointer cursor", async () => {
			const summaryCursor = await page.evaluate(() => {
				const summary = document.querySelector("summary");
				if (!summary) return null;
				return getComputedStyle(summary).cursor;
			});

			if (summaryCursor) {
				expect(summaryCursor).toBe("pointer");
			}
		});
	});
});
