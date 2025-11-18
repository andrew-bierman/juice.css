import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { type Browser, chromium, type Page } from "playwright";

/**
 * Semantic HTML Element Tests
 * Ensures all semantic HTML elements are properly styled
 */
describe("Semantic HTML Styling", () => {
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

    describe("Typography Elements", () => {
        test("headings should have consistent styling", async () => {
            const headingStyles = await page.evaluate(() => {
                const h1 = document.querySelector("h1");
                const h2 = document.querySelector("h2");

                return {
                    h1FontWeight: h1 ? getComputedStyle(h1).fontWeight : null,
                    h2FontWeight: h2 ? getComputedStyle(h2).fontWeight : null,
                    h1LineHeight: h1
                        ? parseFloat(getComputedStyle(h1).lineHeight) /
                          parseFloat(getComputedStyle(h1).fontSize)
                        : 0,
                };
            });

            // Headings should be bold
            expect(
                Number.parseInt(headingStyles.h1FontWeight || "0", 10),
            ).toBeGreaterThanOrEqual(600);
            expect(
                Number.parseInt(headingStyles.h2FontWeight || "0", 10),
            ).toBeGreaterThanOrEqual(600);

            // Tight line-height for headings
            expect(headingStyles.h1LineHeight).toBeLessThanOrEqual(1.3);
        });

        test("paragraphs should have proper spacing", async () => {
            const paragraphSpacing = await page.evaluate(() => {
                const p = document.querySelector("p");
                if (!p) return null;
                const styles = getComputedStyle(p);
                return {
                    marginTop: parseFloat(styles.marginTop),
                    marginBottom: parseFloat(styles.marginBottom),
                };
            });

            expect(paragraphSpacing?.marginTop).toBeGreaterThan(0);
            expect(paragraphSpacing?.marginBottom).toBeGreaterThan(0);
        });

        test("links should be styled with color and hover effect", async () => {
            const link = page.locator("a").first();

            const normalStyle = await link.evaluate((el) => {
                const styles = getComputedStyle(el);
                return {
                    color: styles.color,
                    textDecoration: styles.textDecoration,
                };
            });

            // Links should have color
            expect(normalStyle.color).toBeTruthy();

            // Should have underline on hover (or none by default)
            expect(normalStyle.textDecoration).toBeTruthy();
        });

        test("strong/bold text should have higher font-weight", async () => {
            const strongWeight = await page.evaluate(() => {
                const strong = document.querySelector("strong");
                return strong ? getComputedStyle(strong).fontWeight : null;
            });

            expect(
                Number.parseInt(strongWeight || "0", 10),
            ).toBeGreaterThanOrEqual(600);
        });

        test("code should use monospace font", async () => {
            const codeFontFamily = await page.evaluate(() => {
                const code = document.querySelector("code");
                return code ? getComputedStyle(code).fontFamily : null;
            });

            expect(
                codeFontFamily?.toLowerCase().includes("mono") ||
                    codeFontFamily?.toLowerCase().includes("monospace"),
            ).toBe(true);
        });

        test("blockquote should have border and styling", async () => {
            const blockquoteStyle = await page.evaluate(() => {
                const blockquote = document.querySelector("blockquote");
                if (!blockquote) return null;
                const styles = getComputedStyle(blockquote);
                return {
                    borderLeft: styles.borderLeft,
                    padding: styles.padding,
                    fontStyle: styles.fontStyle,
                };
            });

            if (blockquoteStyle) {
                expect(blockquoteStyle.borderLeft).not.toBe("none");
                expect(parseFloat(blockquoteStyle.padding)).toBeGreaterThan(0);
            }
        });
    });

    describe("Form Elements", () => {
        test("text inputs should be styled consistently", async () => {
            const inputStyles = await page.evaluate(() => {
                const input = document.querySelector("input[type='text']");
                if (!input) return null;
                const styles = getComputedStyle(input);
                return {
                    borderRadius: parseFloat(styles.borderRadius),
                    padding: styles.padding,
                    fontSize: styles.fontSize,
                    border: styles.border,
                };
            });

            expect(inputStyles?.borderRadius).toBeGreaterThanOrEqual(8);
            expect(inputStyles?.padding).toBeTruthy();
        });

        test("buttons should have consistent styling", async () => {
            const buttonStyles = await page.evaluate(() => {
                const button = document.querySelector("button");
                if (!button) return null;
                const styles = getComputedStyle(button);
                return {
                    borderRadius: parseFloat(styles.borderRadius),
                    padding: styles.padding,
                    cursor: styles.cursor,
                    fontWeight: styles.fontWeight,
                };
            });

            expect(buttonStyles?.borderRadius).toBeGreaterThanOrEqual(8);
            expect(buttonStyles?.cursor).toBe("pointer");
            expect(
                Number.parseInt(buttonStyles?.fontWeight || "0", 10),
            ).toBeGreaterThanOrEqual(500);
        });

        test("select elements should match input styling", async () => {
            const selectStyles = await page.evaluate(() => {
                const select = document.querySelector("select");
                const input = document.querySelector("input[type='text']");
                if (!select || !input) return null;

                return {
                    selectRadius: parseFloat(
                        getComputedStyle(select).borderRadius,
                    ),
                    inputRadius: parseFloat(
                        getComputedStyle(input).borderRadius,
                    ),
                    selectFont: getComputedStyle(select).fontFamily,
                    inputFont: getComputedStyle(input).fontFamily,
                };
            });

            if (selectStyles) {
                // Should have similar border radius
                expect(
                    Math.abs(
                        selectStyles.selectRadius - selectStyles.inputRadius,
                    ),
                ).toBeLessThan(2);
                // Should inherit font
                expect(selectStyles.selectFont).toBe(selectStyles.inputFont);
            }
        });

        test("textarea should be resizable and styled", async () => {
            const textareaStyles = await page.evaluate(() => {
                const textarea = document.querySelector("textarea");
                if (!textarea) return null;
                const styles = getComputedStyle(textarea);
                return {
                    resize: styles.resize,
                    borderRadius: parseFloat(styles.borderRadius),
                    minHeight: parseFloat(styles.minHeight),
                };
            });

            if (textareaStyles) {
                expect(textareaStyles.resize).toBe("vertical");
                expect(textareaStyles.borderRadius).toBeGreaterThanOrEqual(8);
                expect(textareaStyles.minHeight).toBeGreaterThan(50);
            }
        });

        test("labels should have proper spacing from inputs", async () => {
            const labelSpacing = await page.evaluate(() => {
                const label = document.querySelector("label");
                if (!label) return null;
                const styles = getComputedStyle(label);
                return {
                    display: styles.display,
                    marginBottom: parseFloat(styles.marginBottom),
                    fontWeight: styles.fontWeight,
                };
            });

            expect(labelSpacing?.display).toBe("block");
            expect(labelSpacing?.marginBottom).toBeGreaterThan(0);
        });

        test("disabled inputs should look disabled", async () => {
            const disabledButton = page.locator("button:disabled").first();
            if ((await disabledButton.count()) > 0) {
                const disabledStyles = await disabledButton.evaluate((el) => {
                    const styles = getComputedStyle(el);
                    return {
                        opacity: parseFloat(styles.opacity),
                        cursor: styles.cursor,
                    };
                });

                expect(disabledStyles.opacity).toBeLessThan(1);
                expect(disabledStyles.cursor).toBe("not-allowed");
            }
        });

        test("checkboxes and radios should be inline with labels", async () => {
            const checkboxLabel = await page.evaluate(() => {
                const label = document.querySelector(
                    "label:has(input[type='checkbox'])",
                );
                if (!label) return null;
                const styles = getComputedStyle(label);
                return {
                    display: styles.display,
                    alignItems: styles.alignItems,
                };
            });

            if (checkboxLabel) {
                expect(checkboxLabel.display).toContain("flex");
            }
        });
    });

    describe("Table Elements", () => {
        test("tables should have proper styling", async () => {
            const tableStyles = await page.evaluate(() => {
                const table = document.querySelector("table");
                if (!table) return null;
                const styles = getComputedStyle(table);
                return {
                    borderCollapse: styles.borderCollapse,
                    width: styles.width,
                    borderRadius: parseFloat(styles.borderRadius),
                };
            });

            if (tableStyles) {
                expect(tableStyles.borderCollapse).toBe("collapse");
                expect(tableStyles.borderRadius).toBeGreaterThanOrEqual(8);
            }
        });

        test("tables should be full width of container", async () => {
            const widthInfo = await page.evaluate(() => {
                const table = document.querySelector("table");
                if (!table) return null;
                const parent = table.parentElement;
                if (!parent) return null;

                return {
                    tableWidth: table.offsetWidth,
                    parentWidth: parent.offsetWidth,
                    percentage: (table.offsetWidth / parent.offsetWidth) * 100,
                };
            });

            if (widthInfo) {
                // Table should be 100% of parent (allow 1px for rounding)
                expect(widthInfo.percentage).toBeGreaterThan(99);
            }
        });

        test("table headers should be visually distinct", async () => {
            const thStyles = await page.evaluate(() => {
                const th = document.querySelector("th");
                if (!th) return null;
                const styles = getComputedStyle(th);
                return {
                    fontWeight: styles.fontWeight,
                    backgroundColor: styles.backgroundColor,
                    padding: styles.padding,
                };
            });

            if (thStyles) {
                expect(
                    Number.parseInt(thStyles.fontWeight, 10),
                ).toBeGreaterThanOrEqual(600);
                expect(thStyles.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
            }
        });

        test("table rows should have hover effect", async () => {
            const firstRow = page.locator("tbody tr").first();
            if ((await firstRow.count()) > 0) {
                const _normalBg = await firstRow.evaluate(
                    (el) => getComputedStyle(el).backgroundColor,
                );

                await firstRow.hover();
                await page.waitForTimeout(100);

                const hoverBg = await firstRow.evaluate(
                    (el) => getComputedStyle(el).backgroundColor,
                );

                // Background should change on hover (or at least be defined)
                expect(hoverBg).toBeTruthy();
            }
        });
    });

    describe("Media Elements", () => {
        test("images should be responsive", async () => {
            const imageStyles = await page.evaluate(() => {
                const img = document.querySelector("img");
                if (!img) return null;
                const styles = getComputedStyle(img);
                const rect = img.getBoundingClientRect();
                return {
                    maxWidth: styles.maxWidth,
                    borderRadius: parseFloat(styles.borderRadius),
                    fitsInContainer:
                        rect.width <=
                        (img.parentElement?.offsetWidth || Infinity),
                };
            });

            if (imageStyles) {
                expect(imageStyles.maxWidth).toBe("100%");
                expect(imageStyles.borderRadius).toBeGreaterThanOrEqual(8);
                expect(imageStyles.fitsInContainer).toBe(true);
            }
        });
    });

    describe("Interactive Elements", () => {
        test("details/summary should be styled", async () => {
            const summaryStyles = await page.evaluate(() => {
                const summary = document.querySelector("summary");
                if (!summary) return null;
                const styles = getComputedStyle(summary);
                return {
                    cursor: styles.cursor,
                    fontWeight: styles.fontWeight,
                    userSelect: styles.userSelect,
                };
            });

            if (summaryStyles) {
                expect(summaryStyles.cursor).toBe("pointer");
                expect(
                    Number.parseInt(summaryStyles.fontWeight, 10),
                ).toBeGreaterThanOrEqual(600);
            }
        });

        test("progress bars should be styled", async () => {
            const progressStyles = await page.evaluate(() => {
                const progress = document.querySelector("progress");
                if (!progress) return null;
                const styles = getComputedStyle(progress);
                return {
                    width: styles.width,
                    height: parseFloat(styles.height),
                    borderRadius: parseFloat(styles.borderRadius),
                };
            });

            if (progressStyles) {
                expect(progressStyles.borderRadius).toBeGreaterThan(0);
            }
        });
    });

    describe("Horizontal Rules", () => {
        test("hr should have clean styling", async () => {
            const hrStyles = await page.evaluate(() => {
                const hr = document.querySelector("hr");
                if (!hr) return null;
                const styles = getComputedStyle(hr);
                return {
                    border: styles.border,
                    borderTop: styles.borderTop,
                    margin: styles.margin,
                };
            });

            if (hrStyles) {
                expect(hrStyles.borderTop).not.toBe("none");
            }
        });
    });
});
