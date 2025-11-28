# juice.css

<p align="center">
  <strong>A drop-in collection of CSS styles to make simple websites look beautiful.</strong>
</p>

<p align="center">
  🧃 Inspired by Apple's design system. Served via jsDelivr CDN.
</p>

---

## Goals

- **Responsive** - Looks great on all screen sizes from mobile to desktop
- **Themeable** - Automatic dark mode support with CSS variables  
- **Beautiful** - Apple-inspired typography, spacing, and colors
- **Modern** - Built for modern browsers with cutting-edge CSS features
- **Lightweight** - ~15KB for auto theme, ~13KB for single theme (unminified)
- **No classes** - Just write semantic HTML, zero classes required

## Why?

I commonly make quick demo pages or websites with simple content. For these, I don't want to spend time styling them, but don't like the look of unstyled HTML. juice.css gives you beautiful, Apple-inspired styling with zero effort.

## Who?

You might want to use juice.css if you're making a simple static page or demo website and want it to look clean and modern without writing any CSS. It's perfect for:

- Documentation sites
- Prototypes and demos  
- Simple landing pages
- Internal tools
- README previews

juice.css is a great starting point for a custom theme, but is also fine to use on its own for a simple, Apple-like aesthetic.

## How?

Just add this to your `<head>`:

### Automatic Theme (Recommended)

Automatically switches between light and dark based on system preference:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/andrew-bierman/juice.css@0.0.1/out/juice.css">
```

### Always Light

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/andrew-bierman/juice.css@0.0.1/out/juice-light.css">
```

### Always Dark

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/andrew-bierman/juice.css@0.0.1/out/juice-dark.css">
```

> **Note:** Always pin to a specific version (e.g., `@0.0.1`) in production. Using `@latest` is convenient for development but can cause unexpected changes when the library updates.

## Theming

juice.css uses CSS variables for all theming. You can customize any of these:

```css
:root {
  /* Backgrounds */
  --background-body: #ffffff;
  --background: #f5f5f7;
  --background-alt: #ffffff;
  
  /* Text colors */
  --text-main: #1d1d1f;
  --text-bright: #000000;
  --text-muted: #86868b;
  
  /* Interactive elements */
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
  
  /* Borders & dividers */
  --border: #d2d2d7;
  
  /* Code blocks */
  --code: #1d1d1f;
  --variable: #34c759;
  --highlight: rgba(255, 214, 10, 0.5);
  
  /* UI elements */
  --scrollbar-thumb: #d2d2d7;
  --scrollbar-thumb-hover: #86868b;
  --slider-thumb: #ffffff;
  
  /* Semantic colors */
  --success: #34c759;
  --warning: #ff9500;
  --error: #ff3b30;
  
  /* Animation */
  --animation-duration: 0.15s;
}
```

## Runtime Theming

Override variables at runtime without recompiling:

```html
<style>
  :root {
    --links: #ff2d55;
    --button-base: #ff2d55;
  }
</style>
```

## Building Your Own Theme

Want to customize juice.css beyond CSS variables? 

1. Clone this repository
2. Edit the source files in `src/`:
   - `variables-light.css` - Light theme colors
   - `variables-dark.css` - Dark theme colors
   - `base.css` - All styling (uses variables)
3. Run `bun run build` to generate CSS files in `out/`

## Development

Built with [Bun](https://bun.sh) - zero dependencies!

```bash
# Install Bun (if needed)
curl -fsSL https://bun.sh/install | bash

# Clone the repo
git clone https://github.com/andrew-bierman/juice.css.git
cd juice.css

# Start dev server with hot reload
bun dev

# Build CSS files
bun run build
```

## Performance

juice.css is served via **jsDelivr's global CDN** with:
- Multi-CDN approach (Cloudflare, Fastly, StackPath)
- 200+ edge locations worldwide
- Automatic caching and compression
- 99.9% uptime SLA
- Free forever for open-source projects

## Browser Support

juice.css works in all modern browsers:

- Chrome/Edge (latest)
- Firefox (latest)  
- Safari (latest)
- Mobile browsers

Legacy browser support is not a priority. juice.css uses modern CSS features like CSS variables, which are supported in all browsers released after 2016.

## Credits

juice.css builds upon the excellent work of:

- [water.css](https://github.com/kognise/water.css) by [@kognise](https://github.com/kognise) - The original classless CSS framework that inspired this project
- [Apple's Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) - Design principles and color system
- [Bun](https://bun.sh) - Lightning-fast JavaScript runtime used for building

Special thanks to the water.css community for creating such a solid foundation!

## License

MIT © [andrew-bierman](https://github.com/andrew-bierman)
