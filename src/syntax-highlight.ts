/**
 * Syntax highlighting for code blocks using Prism.js
 */

import Prism from "prismjs";

// Import languages we need
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";

// Import juice.css-compatible theme
import "./prism-juice.css";

/**
 * Initialize syntax highlighting on all code blocks
 */
export function initSyntaxHighlight() {
	// Highlight all code blocks
	Prism.highlightAll();
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", () => initSyntaxHighlight());
} else {
	initSyntaxHighlight();
}
