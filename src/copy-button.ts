/**
 * Add GitHub-style copy buttons to code blocks
 */

function addCopyButtons() {
	// Find all <pre><code> blocks
	const codeBlocks = document.querySelectorAll("pre > code");

	for (const codeBlock of Array.from(codeBlocks)) {
		const pre = codeBlock.parentElement;
		if (!pre) continue;

		// Create wrapper for positioning
		const wrapper = document.createElement("div");
		wrapper.style.position = "relative";

		// Wrap the pre element
		pre.parentNode?.insertBefore(wrapper, pre);
		wrapper.appendChild(pre);

		// Create copy button
		const button = document.createElement("button");
		button.textContent = "Copy";
		button.setAttribute("aria-label", "Copy code to clipboard");
		button.style.position = "absolute";
		button.style.top = "var(--space-2)";
		button.style.right = "var(--space-2)";
		button.style.padding = "var(--space-1) var(--space-3)";
		button.style.fontSize = "var(--font-size-caption)";
		button.style.opacity = "0";
		button.style.transition =
			"opacity var(--animation-duration) var(--animation-easing)";
		button.style.cursor = "pointer";

		// Show button on hover
		wrapper.addEventListener("mouseenter", () => {
			button.style.opacity = "1";
		});

		wrapper.addEventListener("mouseleave", () => {
			if (!button.classList.contains("copied")) {
				button.style.opacity = "0";
			}
		});

		// Keep button visible during click
		button.addEventListener("mouseenter", () => {
			button.style.opacity = "1";
		});

		// Copy functionality
		button.addEventListener("click", async () => {
			const text = codeBlock.textContent || "";

			try {
				await navigator.clipboard.writeText(text);
				button.textContent = "Copied!";
				button.classList.add("copied");

				setTimeout(() => {
					button.textContent = "Copy";
					button.classList.remove("copied");
					button.style.opacity = "0";
				}, 2000);
			} catch (err) {
				console.error("Failed to copy:", err);
				button.textContent = "Failed";
				setTimeout(() => {
					button.textContent = "Copy";
				}, 2000);
			}
		});

		wrapper.appendChild(button);
	}
}

// Run when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", addCopyButtons);
} else {
	addCopyButtons();
}
