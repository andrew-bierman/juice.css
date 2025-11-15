# juice.css

A classless CSS framework inspired by SwiftUI & Apple's design system. Built on the comprehensive foundation of [water.css](https://github.com/kognise/water.css) with Apple aesthetics.

## Quick Start

Just add this line to your HTML `<head>`:

```html
<link rel="stylesheet" href="https://your-cdn-url.com/juice.css">
```

That's it! Your semantic HTML will now look beautiful.

## Features

- **Classless** - No classes needed, just write semantic HTML
- **Apple-inspired** - Beautiful typography and colors following Apple's design guidelines  
- **Dark mode** - Automatic dark mode support via `prefers-color-scheme`
- **Lightweight** - Single CSS file, no dependencies
- **Responsive** - Works on all screen sizes

## Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
    <link rel="stylesheet" href="https://your-cdn-url.com/juice.css">
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is styled with juice.css</p>
    <button>Click me</button>
</body>
</html>
```

## Customization

Override CSS variables in your own stylesheet:

```css
:root {
  --background-body: #ffffff;
  --text-main: #1d1d1f;
  --links: #007aff;
}
```

## Demo

See [index.html](index.html) for a complete demo of all styled elements.

## CDN Setup

### Cloudflare Pages
1. Push this repo to GitHub
2. Connect to Cloudflare Pages
3. Your CSS will be available at `https://yourproject.pages.dev/juice.css`

### GitHub Pages
1. Enable GitHub Pages in your repo settings
2. Your CSS will be available at `https://yourusername.github.io/juice/juice.css`

### jsDelivr (auto-CDN from GitHub)
Once pushed to GitHub, your CSS is automatically available at:
```
https://cdn.jsdelivr.net/gh/yourusername/juice/juice.css
```

## Credits

- Forked from [water.css](https://github.com/kognise/water.css)
- Inspired by Apple's design system and SwiftUI

## License

MIT
