<p align="center">
  <img src="https://em-content.zobj.net/source/apple/391/beverage-box_1f9c3.png" width="120" alt="juice.css logo">
</p>

<h1 align="center">juice.css</h1>

<p align="center">
  <strong>Drop-in CSS to make simple websites look beautiful.</strong><br>
  Apple-inspired styling for semantic HTML. No classes required.
</p>

<p align="center">
  <a href="https://github.com/andrew-bierman/juice.css/releases"><img src="https://img.shields.io/github/v/release/andrew-bierman/juice.css?style=flat-square" alt="Release"></a>
  <a href="https://github.com/andrew-bierman/juice.css/blob/main/LICENSE"><img src="https://img.shields.io/github/license/andrew-bierman/juice.css?style=flat-square" alt="License"></a>
  <a href="https://www.jsdelivr.com/package/gh/andrew-bierman/juice.css"><img src="https://img.shields.io/jsdelivr/gh/hm/andrew-bierman/juice.css?style=flat-square" alt="jsDelivr hits"></a>
  <img src="https://img.shields.io/badge/dependencies-0-brightgreen?style=flat-square" alt="Zero dependencies">
</p>

<p align="center">
  <a href="https://andrew-bierman.github.io/juice.css">Live Demo</a> ·
  <a href="#quick-start">Quick Start</a> ·
  <a href="#theming">Theming</a> ·
  <a href="#browser-support">Browser Support</a>
</p>

---

## Features

| Feature | Description |
|---------|-------------|
| **Classless** | Just write semantic HTML - no classes needed |
| **Dark Mode** | Automatic light/dark theme based on system preference |
| **Responsive** | Looks great on mobile, tablet, and desktop |
| **Lightweight** | ~16KB minified, ~11KB for single theme |
| **Customizable** | Override any style with CSS variables |
| **Modern** | Built for modern browsers with CSS custom properties |

## Quick Start

Add one line to your `<head>`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/andrew-bierman/juice.css@0.1.0/out/juice.min.css">
```

That's it! Your HTML is now styled.

### Theme Options

| Theme | File | Description |
|-------|------|-------------|
| **Auto** | `juice.min.css` | Switches light/dark with system preference |
| **Light** | `juice-light.min.css` | Always light theme |
| **Dark** | `juice-dark.min.css` | Always dark theme |

> Unminified versions available without `.min` for debugging.

## What Gets Styled?

juice.css styles all semantic HTML elements:

- **Typography** - Headings, paragraphs, links, lists, blockquotes
- **Forms** - Inputs, buttons, selects, textareas, checkboxes, radios
- **Tables** - Responsive with hover states
- **Code** - Inline code and code blocks
- **Media** - Images, figures, videos
- **Interactive** - Details/summary, dialogs, progress bars

## Theming

Customize any aspect with CSS variables:

```css
:root {
  --links: #ff2d55;
  --button-base: #ff2d55;
  --background: #fafafa;
}
```

<details>
<summary><strong>View all CSS variables</strong></summary>

```css
:root {
  /* Backgrounds */
  --background-body: #ffffff;
  --background: #f5f5f7;
  --background-alt: #ffffff;
  
  /* Text */
  --text-main: #1d1d1f;
  --text-bright: #000000;
  --text-muted: #86868b;
  
  /* Interactive */
  --links: #007aff;
  --focus: rgba(0, 122, 255, 0.4);
  --selection: rgba(0, 122, 255, 0.2);
  
  /* Buttons */
  --button-base: #007aff;
  --button-hover: #0051d5;
  --button-text: #ffffff;
  
  /* Forms */
  --form-text: #1d1d1f;
  --form-placeholder: #86868b;
  --border: #d2d2d7;
  
  /* Code */
  --code: #1d1d1f;
  --code-bg: #f5f5f7;
  
  /* Semantic */
  --success: #34c759;
  --warning: #ff9500;
  --error: #ff3b30;
}
```

</details>

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| Edge | Last 2 versions |
| Mobile | iOS Safari, Chrome Android |

## Development

```bash
# Clone
git clone https://github.com/andrew-bierman/juice.css.git
cd juice.css

# Install
bun install

# Dev server with hot reload
bun dev

# Build
bun run build

# Test
bun run test
```

## Credits

- [water.css](https://github.com/kognise/water.css) - The OG classless CSS framework
- [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/) - Design inspiration
- [Bun](https://bun.sh) - Build tooling

## License

MIT © [Andrew Bierman](https://github.com/andrew-bierman)
