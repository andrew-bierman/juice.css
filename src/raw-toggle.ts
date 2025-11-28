/**
 * Raw HTML toggle - allows users to see styled vs completely unstyled HTML
 */

function initRawToggle() {
	const rawBtn = document.getElementById("toggle-raw");
	if (!rawBtn) return;

	const allStyles = document.querySelectorAll(
		'link[rel="stylesheet"], style',
	) as NodeListOf<HTMLLinkElement | HTMLStyleElement>;

	let isRaw = false;

	rawBtn.addEventListener("click", () => {
		isRaw = !isRaw;

		// Toggle all stylesheets
		for (const style of Array.from(allStyles)) {
			if (style instanceof HTMLLinkElement) {
				style.disabled = isRaw;
			} else if (style instanceof HTMLStyleElement) {
				style.disabled = isRaw;
			}
		}

		// Update button text
		rawBtn.textContent = isRaw ? "Show Styled" : "Raw HTML";
	});
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initRawToggle);
} else {
	initRawToggle();
}
