/**
 * Dialog controls for demo page
 */

function initDialog() {
	const dialog = document.getElementById("demo-dialog") as HTMLDialogElement;
	const openBtn = document.getElementById("open-dialog");
	const closeBtn = document.getElementById("close-dialog");

	openBtn?.addEventListener("click", () => dialog?.showModal());
	closeBtn?.addEventListener("click", () => dialog?.close());

	// Close on backdrop click
	dialog?.addEventListener("click", (e) => {
		if (e.target === dialog) dialog.close();
	});
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initDialog);
} else {
	initDialog();
}
