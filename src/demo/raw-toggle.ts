/**
 * Raw HTML toggle - allows users to see styled vs completely unstyled HTML
 * Only shown in dev mode (localhost)
 */

function initRawToggle() {
	const rawBtn = document.getElementById("toggle-raw");
	if (!rawBtn) return;

	// Only show in dev mode
	const isDev =
		location.hostname === "localhost" || location.hostname === "127.0.0.1";
	if (!isDev) {
		rawBtn.style.display = "none";
		return;
	}

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
